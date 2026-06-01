import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest } from "../lib/api.js";
import { useAuth } from "./AuthContext.jsx";

const DataContext = createContext(null);

// Helper: ubah field snake_case dari backend ke camelCase yang dipakai UI
function mapAsset(a) {
  return {
    id: a.id,
    name: a.name,
    category: a.category,
    serialNumber: a.serial_number,
    location: a.location,
    status: a.status,
    condition: a.condition,
    procurementDate: a.procurement_date,
    unitOwner: a.unit_owner,
    nextMaintenance: a.next_maintenance,
    note: a.note,
    image: a.image ?? null,
    priority: a.priority ?? "Normal",
    createdAt: a.created_at,
    updatedAt: a.updated_at
  };
}

function mapMutation(m) {
  return {
    id: m.id,
    assetId: m.asset_id,
    assetName: m.assets?.name ?? m.asset_name ?? "-",
    fromLocation: m.from_location,
    toLocation: m.to_location,
    officer: m.officer,
    note: m.note,
    status: m.status,
    createdAt: m.created_at
  };
}

function mapMaintenance(m) {
  return {
    id: m.id,
    assetId: m.asset_id,
    assetName: m.assets?.name ?? m.asset_name ?? "-",
    technician: m.technician,
    scheduledDate: m.scheduled_date,
    result: m.result,
    status: m.status
  };
}

function mapBorrow(b) {
  return {
    id: b.id,
    assetId: b.asset_id,
    assetName: b.assets?.name ?? b.asset_name ?? "-",
    borrower: b.borrower,
    borrowerRole: b.borrower_role,
    unit: b.unit,
    fromLocation: b.from_location,
    toLocation: b.to_location,
    purpose: b.purpose,
    requestedAt: b.requested_at,
    expectedReturn: b.expected_return,
    status: b.status,
    timeline: b.timeline ?? []
  };
}

function mapUser(u) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    unit: u.unit,
    status: u.status,
    createdAt: u.created_at
  };
}

export function DataProvider({ children }) {
  const { user } = useAuth();
  const [assets, setAssets] = useState([]);
  const [mutations, setMutations] = useState([]);
  const [maintenances, setMaintenances] = useState([]);
  const [borrowRequests, setBorrowRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ambil data ketika user sudah login, dan bersihkan data ketika logout.
  // Sebelumnya fetch hanya berjalan sekali saat aplikasi mount, sehingga
  // setelah login pengguna harus refresh dulu agar token terbaca.
  const fetchAll = useCallback(async () => {
    setError(null);

    const token = localStorage.getItem("simami_token");

    if (!user || !token) {
      setAssets([]);
      setMutations([]);
      setMaintenances([]);
      setBorrowRequests([]);
      setUsers([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const [assetsRes, mutRes, maintRes, borrowRes, usersRes] = await Promise.allSettled([
        apiRequest("/assets"),
        apiRequest("/mutations"),
        apiRequest("/maintenance"),
        apiRequest("/borrows"),
        apiRequest("/users")
      ]);

      if (assetsRes.status === "fulfilled") {
        setAssets((assetsRes.value.data ?? []).map(mapAsset));
      } else {
        throw assetsRes.reason;
      }

      if (mutRes.status === "fulfilled") setMutations((mutRes.value.data ?? []).map(mapMutation));
      if (maintRes.status === "fulfilled") setMaintenances((maintRes.value.data ?? []).map(mapMaintenance));
      if (borrowRes.status === "fulfilled") setBorrowRequests((borrowRes.value.data ?? []).map(mapBorrow));
      if (usersRes.status === "fulfilled") setUsers((usersRes.value.data ?? []).map(mapUser));
    } catch (err) {
      setError(err.message || "Gagal memuat data dari server.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ─── ASSETS ─────────────────────────────────────────────────────────────────

  async function createAsset(payload) {
    const res = await apiRequest("/assets", {
      method: "POST",
      body: JSON.stringify({
        id: payload.id,
        name: payload.name,
        category: payload.category,
        serial_number: payload.serialNumber ?? null,
        location: payload.location,
        status: payload.status,
        condition: payload.condition,
        procurement_date: payload.procurementDate ?? null,
        unit_owner: payload.unitOwner ?? null,
        next_maintenance: payload.nextMaintenance ?? null,
        note: payload.note ?? null
      })
    });
    const item = mapAsset(res.data);
    setAssets((prev) => [item, ...prev]);
    return item;
  }

  async function updateAsset(id, payload) {
    const res = await apiRequest(`/assets/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        name: payload.name,
        category: payload.category,
        serial_number: payload.serialNumber ?? null,
        location: payload.location,
        status: payload.status,
        condition: payload.condition,
        procurement_date: payload.procurementDate ?? null,
        unit_owner: payload.unitOwner ?? null,
        next_maintenance: payload.nextMaintenance ?? null,
        note: payload.note ?? null
      })
    });
    const updated = mapAsset(res.data);
    setAssets((prev) => prev.map((a) => (a.id === id ? updated : a)));
  }

  async function deleteAsset(id) {
    await apiRequest(`/assets/${id}`, { method: "DELETE" });
    setAssets((prev) => prev.filter((a) => a.id !== id));
  }

  // ─── MUTATIONS ───────────────────────────────────────────────────────────────

  async function createMutation(payload) {
    const res = await apiRequest("/mutations", {
      method: "POST",
      body: JSON.stringify({
        asset_id: payload.assetId,
        from_location: payload.fromLocation,
        to_location: payload.toLocation,
        officer: payload.officer,
        note: payload.note ?? null,
        status: payload.status ?? "Belum kembali"
      })
    });
    const item = mapMutation(res.data);
    setMutations((prev) => [item, ...prev]);
    // Update lokasi aset di state lokal (backend sudah update di DB)
    setAssets((prev) =>
      prev.map((a) =>
        a.id === payload.assetId
          ? {
              ...a,
              location: payload.toLocation,
              status: payload.status === "Selesai" ? "Tersedia" : "Dipinjam",
              updatedAt: new Date().toISOString()
            }
          : a
      )
    );
    return item;
  }

  // ─── MAINTENANCE ─────────────────────────────────────────────────────────────

  async function createMaintenance(payload) {
    const res = await apiRequest("/maintenance", {
      method: "POST",
      body: JSON.stringify({
        asset_id: payload.assetId,
        technician: payload.technician,
        scheduled_date: payload.scheduledDate,
        result: payload.result ?? null,
        status: payload.status ?? "Terjadwal"
      })
    });
    const item = mapMaintenance(res.data);
    setMaintenances((prev) => [item, ...prev]);
    // Update status aset di state lokal
    setAssets((prev) =>
      prev.map((a) =>
        a.id === payload.assetId
          ? { ...a, status: "Maintenance", updatedAt: new Date().toISOString() }
          : a
      )
    );
    return item;
  }

  // ─── BORROWS ─────────────────────────────────────────────────────────────────

  async function createBorrowRequest(payload) {
    const asset = assets.find((a) => a.id === payload.assetId);
    const res = await apiRequest("/borrows", {
      method: "POST",
      body: JSON.stringify({
        asset_id: payload.assetId,
        borrower: payload.borrower,
        borrower_role: payload.borrowerRole ?? "Petugas Bangsal",
        unit: payload.unit,
        from_location: asset?.location ?? "-",
        to_location: payload.toLocation,
        purpose: payload.purpose,
        expected_return: payload.expectedReturn ?? null
      })
    });
    const item = mapBorrow(res.data);
    setBorrowRequests((prev) => [item, ...prev]);
    return item;
  }

  async function updateBorrowStatus(id, status) {
    const res = await apiRequest(`/borrows/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    });
    const updated = mapBorrow(res.data);
    setBorrowRequests((prev) => prev.map((b) => (b.id === id ? updated : b)));

    // Update aset di state lokal sesuai logika backend
    const request = borrowRequests.find((b) => b.id === id);
    if (request) {
      if (status === "Sedang Dipinjam") {
        setAssets((prev) =>
          prev.map((a) =>
            a.id === request.assetId
              ? { ...a, status: "Dipinjam", location: request.toLocation, updatedAt: new Date().toISOString() }
              : a
          )
        );
      }
      if (status === "Selesai") {
        setAssets((prev) =>
          prev.map((a) =>
            a.id === request.assetId
              ? { ...a, status: "Tersedia", location: request.fromLocation, updatedAt: new Date().toISOString() }
              : a
          )
        );
      }
    }
  }

  // ─── USERS ───────────────────────────────────────────────────────────────────

  async function createUser(payload) {
    const res = await apiRequest("/users", {
      method: "POST",
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        password: payload.password ?? "password",
        role: payload.role,
        unit: payload.unit,
        status: payload.status ?? "Aktif"
      })
    });
    const item = mapUser(res.data);
    setUsers((prev) => [item, ...prev]);
    return item;
  }

  const value = useMemo(
    () => ({
      assets,
      mutations,
      maintenances,
      borrowRequests,
      users,
      loading,
      error,
      refetch: fetchAll,
      createAsset,
      updateAsset,
      deleteAsset,
      createMutation,
      createMaintenance,
      createBorrowRequest,
      updateBorrowStatus,
      createUser
    }),
    [assets, mutations, maintenances, borrowRequests, users, loading, error]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  return useContext(DataContext);
}

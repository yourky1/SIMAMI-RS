import { createContext, useContext, useMemo, useState } from "react";
import { initialAssets, initialBorrowRequests, initialMaintenances, initialMutations, initialUsers } from "../data/mockData.js";

const DataContext = createContext(null);

function load(key, fallback) {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : fallback;
}

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function makeId(prefix, list) {
  const number = list.length + 1;
  return `${prefix}-${String(Date.now()).slice(-4)}${String(number).padStart(2, "0")}`;
}

function makeBorrowTimeline(status) {
  const now = new Date().toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
  return [
    { label: "Pengajuan dibuat", time: now, done: true },
    { label: status === "Menunggu Persetujuan" ? "Menunggu approval admin" : "Disetujui admin", time: "-", done: status !== "Menunggu Persetujuan" },
    { label: "Alat diserahkan", time: "-", done: false },
    { label: "Pengembalian", time: "-", done: false }
  ];
}

export function DataProvider({ children }) {
  const [assets, setAssets] = useState(() => load("simami_assets", initialAssets));
  const [mutations, setMutations] = useState(() => load("simami_mutations", initialMutations));
  const [maintenances, setMaintenances] = useState(() => load("simami_maintenances", initialMaintenances));
  const [users, setUsers] = useState(() => load("simami_users", initialUsers));
  const [borrowRequests, setBorrowRequests] = useState(() => load("simami_borrow_requests", initialBorrowRequests));

  function persistAssets(next) {
    setAssets(next);
    save("simami_assets", next);
  }

  function persistMutations(next) {
    setMutations(next);
    save("simami_mutations", next);
  }

  function persistMaintenances(next) {
    setMaintenances(next);
    save("simami_maintenances", next);
  }

  function persistUsers(next) {
    setUsers(next);
    save("simami_users", next);
  }

  function persistBorrowRequests(next) {
    setBorrowRequests(next);
    save("simami_borrow_requests", next);
  }

  function createAsset(payload) {
    const id = payload.id || makeId("AST", assets);
    const item = {
      ...payload,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    persistAssets([item, ...assets]);
    return item;
  }

  function updateAsset(id, payload) {
    const next = assets.map((asset) =>
      asset.id === id ? { ...asset, ...payload, updatedAt: new Date().toISOString() } : asset
    );
    persistAssets(next);
  }

  function deleteAsset(id) {
    persistAssets(assets.filter((asset) => asset.id !== id));
  }

  function createMutation(payload) {
    const mutation = {
      id: makeId("MTS", mutations),
      ...payload,
      createdAt: new Date().toISOString()
    };

    persistMutations([mutation, ...mutations]);

    const nextAssets = assets.map((asset) =>
      asset.id === payload.assetId
        ? {
            ...asset,
            location: payload.toLocation,
            status: payload.status === "Selesai" ? "Tersedia" : "Dipinjam",
            updatedAt: new Date().toISOString()
          }
        : asset
    );
    persistAssets(nextAssets);
    return mutation;
  }

  function createMaintenance(payload) {
    const item = {
      id: makeId("MTN", maintenances),
      ...payload
    };
    persistMaintenances([item, ...maintenances]);

    const nextAssets = assets.map((asset) =>
      asset.id === payload.assetId ? { ...asset, status: "Maintenance", condition: payload.condition || asset.condition } : asset
    );
    persistAssets(nextAssets);
    return item;
  }

  function createUser(payload) {
    const item = {
      id: makeId("USR", users),
      status: "Aktif",
      ...payload
    };
    persistUsers([item, ...users]);
    return item;
  }

  function createBorrowRequest(payload) {
    const asset = assets.find((item) => item.id === payload.assetId);
    const item = {
      id: makeId("BRW", borrowRequests),
      assetId: payload.assetId,
      assetName: asset?.name || "-",
      borrower: payload.borrower,
      borrowerRole: payload.borrowerRole || "Petugas Bangsal",
      unit: payload.unit,
      fromLocation: asset?.location || "-",
      toLocation: payload.toLocation,
      purpose: payload.purpose,
      requestedAt: new Date().toISOString(),
      expectedReturn: payload.expectedReturn,
      status: "Menunggu Persetujuan",
      timeline: makeBorrowTimeline("Menunggu Persetujuan")
    };
    persistBorrowRequests([item, ...borrowRequests]);
    return item;
  }

  function updateBorrowStatus(id, status) {
    const now = new Date().toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
    let selected = null;

    const nextRequests = borrowRequests.map((request) => {
      if (request.id !== id) return request;
      selected = request;

      let timeline = request.timeline.map((item) => ({ ...item }));

      if (status === "Disetujui") {
        timeline = [
          { label: "Pengajuan dibuat", time: timeline[0]?.time || now, done: true },
          { label: "Disetujui admin", time: now, done: true },
          { label: "Alat diserahkan", time: "-", done: false },
          { label: "Pengembalian", time: "-", done: false }
        ];
      }

      if (status === "Sedang Dipinjam") {
        timeline = [
          { label: "Pengajuan dibuat", time: timeline[0]?.time || now, done: true },
          { label: "Disetujui admin", time: timeline[1]?.time === "-" ? now : timeline[1]?.time, done: true },
          { label: "Alat diserahkan", time: now, done: true },
          { label: "Pengembalian", time: "-", done: false }
        ];
      }

      if (status === "Selesai") {
        timeline = [
          { label: "Pengajuan dibuat", time: timeline[0]?.time || now, done: true },
          { label: "Disetujui admin", time: timeline[1]?.time === "-" ? now : timeline[1]?.time, done: true },
          { label: "Alat diserahkan", time: timeline[2]?.time === "-" ? now : timeline[2]?.time, done: true },
          { label: "Pengembalian", time: now, done: true }
        ];
      }

      if (status === "Ditolak") {
        timeline = [
          { label: "Pengajuan dibuat", time: timeline[0]?.time || now, done: true },
          { label: "Ditolak admin", time: now, done: true },
          { label: "Proses selesai", time: now, done: true }
        ];
      }

      return { ...request, status, timeline };
    });

    persistBorrowRequests(nextRequests);

    if (selected && ["Sedang Dipinjam", "Selesai"].includes(status)) {
      const nextAssets = assets.map((asset) => {
        if (asset.id !== selected.assetId) return asset;
        return {
          ...asset,
          status: status === "Selesai" ? "Tersedia" : "Dipinjam",
          location: status === "Selesai" ? selected.fromLocation : selected.toLocation,
          updatedAt: new Date().toISOString()
        };
      });
      persistAssets(nextAssets);
    }
  }

  function resetDemoData() {
    persistAssets(initialAssets);
    persistMutations(initialMutations);
    persistMaintenances(initialMaintenances);
    persistUsers(initialUsers);
    persistBorrowRequests(initialBorrowRequests);
  }

  const value = useMemo(
    () => ({
      assets,
      mutations,
      maintenances,
      users,
      borrowRequests,
      createAsset,
      updateAsset,
      deleteAsset,
      createMutation,
      createMaintenance,
      createUser,
      createBorrowRequest,
      updateBorrowStatus,
      resetDemoData
    }),
    [assets, mutations, maintenances, users, borrowRequests]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  return useContext(DataContext);
}

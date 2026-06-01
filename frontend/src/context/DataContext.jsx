from pathlib import Path
import zipfile

zip_path = Path("/mnt/data/SIMAMI-RS-main.zip")
output_path = Path("/mnt/data/DataContext_FIXED.jsx")

with zipfile.ZipFile(zip_path) as zf:
    original = zf.read("SIMAMI-RS-main/frontend/src/context/DataContext.jsx").decode("utf-8")

fixed = original

fixed = fixed.replace(
    'import { apiRequest } from "../lib/api.js";',
    'import { apiRequest } from "../lib/api.js";\nimport { useAuth } from "./AuthContext.jsx";'
)

fixed = fixed.replace(
    'export function DataProvider({ children }) {\n  const [assets, setAssets] = useState([]);',
    'export function DataProvider({ children }) {\n  const { user } = useAuth();\n  const [assets, setAssets] = useState([]);'
)

old_block = '''  // Fetch semua data dari backend saat pertama kali mount
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("simami_token");
      if (!token) {
        setLoading(false);
        return;
      }

      const [assetsRes, mutRes, maintRes, borrowRes, usersRes] = await Promise.allSettled([
        apiRequest("/assets"),
        apiRequest("/mutations"),
        apiRequest("/maintenance"),
        apiRequest("/borrows"),
        apiRequest("/users")
      ]);

      if (assetsRes.status === "fulfilled") setAssets((assetsRes.value.data ?? []).map(mapAsset));
      if (mutRes.status === "fulfilled") setMutations((mutRes.value.data ?? []).map(mapMutation));
      if (maintRes.status === "fulfilled") setMaintenances((maintRes.value.data ?? []).map(mapMaintenance));
      if (borrowRes.status === "fulfilled") setBorrowRequests((borrowRes.value.data ?? []).map(mapBorrow));
      if (usersRes.status === "fulfilled") setUsers((usersRes.value.data ?? []).map(mapUser));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);'''

new_block = '''  // Ambil data ketika user sudah login, dan bersihkan data ketika logout.
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
  }, [fetchAll]);'''

if old_block not in fixed:
    raise RuntimeError("Blok fetchAll asli tidak ditemukan; file sumber berbeda dari yang diharapkan.")

fixed = fixed.replace(old_block, new_block)
output_path.write_text(fixed, encoding="utf-8")

# Validasi perubahan penting ada di file keluaran.
checks = [
    'import { useAuth } from "./AuthContext.jsx";',
    'const { user } = useAuth();',
    '}, [user]);',
    'setAssets([]);'
]
for check in checks:
    if check not in fixed:
        raise RuntimeError(f"Validasi gagal: {check}")

print(f"File perbaikan siap: {output_path.name}")

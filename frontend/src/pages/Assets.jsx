import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../components/ui/EmptyState.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import SearchFilterBar from "../components/ui/SearchFilterBar.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import { useData } from "../context/DataContext.jsx";

const PAGE_SIZE = 10;

const conditionColor = {
  "Baik": "bg-emerald-500",
  "Perlu Cek Ringan": "bg-amber-400",
  "Butuh Kalibrasi": "bg-rose-500",
};

const STATUS_OPTIONS = ["Semua", "Tersedia", "Dipakai", "Dipinjam", "Maintenance"];

export default function Assets() {
  const { assets, deleteAsset } = useData();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const keyword = query.toLowerCase();
    return assets.filter((asset) => {
      const matchSearch = [asset.id, asset.name, asset.category, asset.location, asset.status, asset.condition].some(
        (v) => String(v).toLowerCase().includes(keyword)
      );
      const matchStatus = statusFilter === "Semua" || asset.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [assets, query, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilterChange = (status) => {
    setStatusFilter(status);
    setPage(1);
  };

  const handleQueryChange = (val) => {
    setQuery(val);
    setPage(1);
  };

  return (
    <div>
      <PageHeader
        title="Data Aset Medis"
        description="Kelola inventaris alat medis berdasarkan nomor inventaris, lokasi, status, kondisi, dan jadwal maintenance."
        action={
          <Link
            to="/assets/new"
            className="inline-flex items-center gap-1.5 rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
          >
            <Plus size={16} />
            Input Aset
          </Link>
        }
      />

      {/* Search + Filter */}
      <SearchFilterBar value={query} onChange={handleQueryChange} placeholder="Cari nama aset, kode, kategori, atau lokasi..." />

      {/* Status Filter Tabs */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => handleFilterChange(s)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
              statusFilter === s
                ? "bg-teal-600 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {s}
            {s !== "Semua" && (
              <span className="ml-1.5 rounded-sm bg-white/20 px-1 py-0.5 text-[10px] font-semibold">
                {assets.filter((a) => a.status === s).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-sticky divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50 text-left">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Kode Aset
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Nama & Kategori
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Lokasi
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Kondisi
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Maintenance
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {paginated.map((asset) => (
                  <tr key={asset.id} className="transition hover:bg-slate-50">
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs font-semibold text-slate-700">
                      {asset.id}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{asset.name}</p>
                      <p className="text-xs text-slate-400">{asset.category}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">{asset.location}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <StatusBadge value={asset.status} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${conditionColor[asset.condition] ?? "bg-slate-300"}`}
                        />
                        <span className="text-slate-600">{asset.condition}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                      {asset.nextMaintenance ?? asset.next_maintenance ?? "-"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/assets/${asset.id}`}
                          className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-teal-700 transition hover:bg-teal-50"
                        >
                          Detail
                        </Link>
                        <Link
                          to={`/assets/${asset.id}/edit`}
                          className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => deleteAsset(asset.id)}
                          className="rounded-md border border-rose-100 px-2.5 py-1 text-xs font-medium text-rose-600 transition hover:bg-rose-50"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
            <p className="text-xs text-slate-500">
              Menampilkan{" "}
              <span className="font-medium text-slate-700">
                {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}
              </span>{" "}
              dari <span className="font-medium text-slate-700">{filtered.length}</span> aset
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-md border border-slate-200 p-1.5 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-7 w-7 rounded-md text-xs font-medium transition ${
                    p === page
                      ? "bg-teal-600 text-white"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-md border border-slate-200 p-1.5 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

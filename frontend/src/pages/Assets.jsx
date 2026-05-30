import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../components/ui/EmptyState.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import SearchFilterBar from "../components/ui/SearchFilterBar.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import { useData } from "../context/DataContext.jsx";

export default function Assets() {
  const { assets, deleteAsset } = useData();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const keyword = query.toLowerCase();
    return assets.filter((asset) =>
      [asset.id, asset.name, asset.category, asset.location, asset.status, asset.condition].some((value) =>
        String(value).toLowerCase().includes(keyword)
      )
    );
  }, [assets, query]);

  return (
    <div>
      <PageHeader
        title="Data Aset Medis"
        description="Kelola data inventaris alat medis berdasarkan nomor inventaris, lokasi, status ketersediaan, kondisi, dan jadwal maintenance."
        action={<Link to="/assets/new" className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-100 hover:bg-emerald-700"><Plus size={18} /> Input Aset</Link>}
      />
      <SearchFilterBar value={query} onChange={setQuery} placeholder="Cari nama aset, kode, kategori, atau lokasi..." />

      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-4">Kode Aset</th>
                  <th className="px-5 py-4">Nama Aset</th>
                  <th className="px-5 py-4">Lokasi</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Kondisi</th>
                  <th className="px-5 py-4">Maintenance</th>
                  <th className="px-5 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filtered.map((asset) => (
                  <tr key={asset.id} className="hover:bg-slate-50/80">
                    <td className="whitespace-nowrap px-5 py-4 font-bold text-slate-900">{asset.id}</td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">{asset.name}</p>
                      <p className="text-xs text-slate-500">{asset.category}</p>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">{asset.location}</td>
                    <td className="whitespace-nowrap px-5 py-4"><StatusBadge value={asset.status} /></td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">{asset.condition}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">{asset.nextMaintenance}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <Link to={`/assets/${asset.id}`} className="rounded-xl px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-50">Detail</Link>
                      <Link to={`/assets/${asset.id}/edit`} className="rounded-xl px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100">Edit</Link>
                      <button onClick={() => deleteAsset(asset.id)} className="rounded-xl px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50">Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

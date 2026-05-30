import { AlertTriangle, Edit, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import QRCodeCard from "../components/ui/QRCodeCard.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import { useData } from "../context/DataContext.jsx";

export default function AssetDetail() {
  const { assetId } = useParams();
  const navigate = useNavigate();
  const { assets, mutations, maintenances, deleteAsset } = useData();
  const asset = assets.find((item) => item.id === assetId);

  if (!asset) {
    return (
      <div>
        <PageHeader title="Aset tidak ditemukan" description="Data aset yang diminta tidak tersedia." />
        <Link to="/assets" className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white">Kembali ke Data Aset</Link>
      </div>
    );
  }

  const assetMutations = mutations.filter((item) => item.assetId === asset.id);
  const assetMaintenances = maintenances.filter((item) => item.assetId === asset.id);

  function handleDelete() {
    deleteAsset(asset.id);
    navigate("/assets");
  }

  return (
    <div>
      <PageHeader
        title="Detail Aset"
        description="Informasi lengkap satu aset, termasuk status, lokasi, QR Code, riwayat mutasi, dan riwayat maintenance."
        action={
          <div className="flex gap-2">
            <Link to={`/assets/${asset.id}/edit`} className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white"><Edit size={17} /> Edit</Link>
            <button onClick={handleDelete} className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50"><Trash2 size={17} /> Hapus</button>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-bold text-emerald-700">{asset.id}</p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">{asset.name}</h2>
              <p className="mt-2 text-sm text-slate-500">{asset.category}</p>
            </div>
            <StatusBadge value={asset.status} />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              ["Lokasi saat ini", asset.location],
              ["Kondisi", asset.condition],
              ["Serial number", asset.serialNumber || "-"],
              ["Penanggung jawab", asset.unitOwner],
              ["Tanggal pengadaan", asset.procurementDate],
              ["Maintenance berikutnya", asset.nextMaintenance],
              ["Metode identifikasi", "QR Code + input manual"],
              ["Catatan", asset.note || "-"]
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
                <p className="mt-1 font-semibold text-slate-900">{value}</p>
              </div>
            ))}
          </div>

          {asset.condition !== "Baik" && (
            <div className="mt-6 rounded-3xl border border-rose-100 bg-rose-50 p-5">
              <div className="flex gap-3">
                <AlertTriangle className="mt-1 text-rose-600" />
                <div>
                  <h3 className="font-bold text-rose-950">Aset perlu perhatian</h3>
                  <p className="mt-1 text-sm leading-6 text-rose-700">{asset.note || "Perlu pengecekan teknisi sebelum digunakan kembali."}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-3 font-bold text-slate-950">Riwayat Mutasi</h3>
              <div className="space-y-3">
                {assetMutations.length === 0 ? <p className="text-sm text-slate-500">Belum ada mutasi.</p> : assetMutations.map((item) => (
                  <div key={item.id} className="rounded-2xl bg-slate-50 p-4 text-sm">
                    <p className="font-bold text-slate-900">{item.fromLocation} → {item.toLocation}</p>
                    <p className="text-slate-500">{item.officer} • {new Date(item.createdAt).toLocaleString("id-ID")}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-3 font-bold text-slate-950">Riwayat Maintenance</h3>
              <div className="space-y-3">
                {assetMaintenances.length === 0 ? <p className="text-sm text-slate-500">Belum ada maintenance.</p> : assetMaintenances.map((item) => (
                  <div key={item.id} className="rounded-2xl bg-slate-50 p-4 text-sm">
                    <p className="font-bold text-slate-900">{item.scheduledDate}</p>
                    <p className="text-slate-500">{item.result}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <QRCodeCard asset={asset} />
      </div>
    </div>
  );
}

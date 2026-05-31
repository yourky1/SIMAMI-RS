import { Printer } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import PageHeader from "../components/ui/PageHeader.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import { useData } from "../context/DataContext.jsx";

export default function Reports() {
  const { assets, mutations, maintenances } = useData();

  const locationData = Object.values(
    assets.reduce((acc, asset) => {
      acc[asset.location] = acc[asset.location] || { name: asset.location, value: 0 };
      acc[asset.location].value += 1;
      return acc;
    }, {})
  );

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });

  const belumKembali = mutations.filter((m) => m.status === "Belum kembali");

  return (
    <div>
      <PageHeader
        title="Laporan & Audit"
        description="Ringkasan aset berdasarkan lokasi, status, mutasi, dan maintenance untuk kebutuhan audit internal maupun eksternal."
        action={
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
          >
            <Printer size={15} /> Export / Print
          </button>
        }
      />

      {/* ── Print Area: semua konten di bawah ini akan tercetak ── */}
      <div className="print-area space-y-6">

        {/* Header laporan (hanya terlihat saat print) */}
        <div className="hidden print:block mb-6 border-b border-slate-200 pb-4">
          <p className="text-xs text-slate-500">SIMAMI-RS — RS Permata Medika</p>
          <h1 className="mt-1 text-xl font-bold text-slate-900">Laporan Inventaris Aset Medis</h1>
          <p className="text-xs text-slate-500">Dicetak: {today}</p>
        </div>

        {/* Row 1: Chart + Ringkasan */}
        <div className="grid gap-5 xl:grid-cols-2">
          {/* Chart */}
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-900">Distribusi Aset per Lokasi</h2>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={locationData} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <Tooltip
                    contentStyle={{ border: "1px solid #e2e8f0", borderRadius: "6px", fontSize: "12px" }}
                  />
                  <Bar dataKey="value" fill="#0d9488" radius={[4, 4, 0, 0]} name="Jumlah Aset" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Ringkasan audit */}
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-900">Ringkasan Audit</h2>
            <div className="mt-4 space-y-2">
              {[
                ["Total aset terdaftar", `${assets.length} item`, "Seluruh aset tercatat dalam sistem"],
                ["Aset tersedia", `${assets.filter(a => a.status === "Tersedia").length} item`, "Siap digunakan"],
                ["Aset dipinjam/dipakai", `${assets.filter(a => ["Dipinjam", "Dipakai"].includes(a.status)).length} item`, "Dalam transaksi aktif"],
                ["Aset maintenance", `${assets.filter(a => a.status === "Maintenance").length} item`, "Perlu tindak lanjut teknisi"],
                ["Mutasi belum kembali", `${belumKembali.length} transaksi`, "Perlu konfirmasi unit peminjam"],
                ["Jadwal maintenance aktif", `${maintenances.length} jadwal`, "Jadwal teknisi tercatat"],
                ["QR bermasalah", "0 laporan", "Tidak ada QR rusak hari ini"],
              ].map(([label, value, note]) => (
                <div key={label} className="flex items-center justify-between rounded-md bg-slate-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{label}</p>
                    <p className="text-xs text-slate-500">{note}</p>
                  </div>
                  <p className="text-sm font-semibold text-teal-700">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Tabel semua aset */}
        <div className="rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-900">Daftar Lengkap Aset Medis</h2>
            <p className="text-xs text-slate-400">{assets.length} aset terdaftar per {today}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50 text-left">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Kode</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Nama Aset</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Lokasi</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Kondisi</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Maintenance</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Prioritas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {assets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-xs font-medium text-slate-600">{asset.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{asset.name}</p>
                      <p className="text-xs text-slate-400">{asset.category}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">{asset.location}</td>
                    <td className="whitespace-nowrap px-4 py-3"><StatusBadge value={asset.status} /></td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">{asset.condition}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-500 text-xs">{asset.next_maintenance ?? asset.nextMaintenance ?? "-"}</td>
                    <td className="whitespace-nowrap px-4 py-3"><StatusBadge value={asset.priority} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Row 3: Tabel mutasi */}
        {mutations.length > 0 && (
          <div className="rounded-lg border border-slate-200 bg-white">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-slate-900">Riwayat Mutasi Aset</h2>
              <p className="text-xs text-slate-400">{mutations.length} catatan mutasi</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-sm">
                <thead className="bg-slate-50 text-left">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">ID</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Aset</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Dari</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Ke</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Petugas</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {mutations.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono text-xs text-slate-600">{m.id}</td>
                      <td className="px-4 py-3 font-medium text-slate-900">{m.assetName}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">{m.fromLocation}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">{m.toLocation}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">{m.officer}</td>
                      <td className="whitespace-nowrap px-4 py-3"><StatusBadge value={m.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Row 4: Tabel maintenance */}
        {maintenances.length > 0 && (
          <div className="rounded-lg border border-slate-200 bg-white">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-slate-900">Jadwal Maintenance</h2>
              <p className="text-xs text-slate-400">{maintenances.length} jadwal tercatat</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-sm">
                <thead className="bg-slate-50 text-left">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">ID Aset</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Teknisi</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Tanggal</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {maintenances.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono text-xs text-slate-600">{m.assetId}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-900">{m.technician}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">{m.scheduledDate}</td>
                      <td className="whitespace-nowrap px-4 py-3"><StatusBadge value={m.status} /></td>
                      <td className="px-4 py-3 text-xs text-slate-500">{m.result ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer print */}
        <div className="hidden print:block border-t border-slate-200 pt-4 text-center text-xs text-slate-400">
          SIMAMI-RS — Sistem Manajemen Aset Medis RS Permata Medika · Dicetak {today} · Dokumen ini bersifat konfidensial
        </div>

      </div>{/* end print-area */}
    </div>
  );
}

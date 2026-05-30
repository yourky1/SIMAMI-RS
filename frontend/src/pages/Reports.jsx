import { Printer } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import PageHeader from "../components/ui/PageHeader.jsx";
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

  return (
    <div>
      <PageHeader
        title="Laporan & Audit"
        description="Ringkasan aset berdasarkan lokasi, status, mutasi, dan maintenance untuk kebutuhan audit internal maupun eksternal."
        action={<button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white"><Printer size={17} /> Export / Print</button>}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-slate-950">Aset per Lokasi</h2>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationData} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#059669" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-slate-950">Ringkasan Audit</h2>
          <div className="mt-5 space-y-3">
            {[
              ["Total aset", `${assets.length} item`, "Seluruh aset tercatat dalam sistem"],
              ["Aset belum kembali", `${mutations.filter((item) => item.status === "Belum kembali").length} transaksi`, "Perlu konfirmasi unit peminjam"],
              ["Maintenance aktif", `${maintenances.length} jadwal`, "Jadwal teknisi dan tindak lanjut"],
              ["QR bermasalah", "0 laporan", "Tidak ada QR rusak hari ini"]
            ].map(([label, value, note]) => (
              <div key={label} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                <div><p className="font-bold text-slate-950">{label}</p><p className="text-sm text-slate-500">{note}</p></div>
                <p className="font-black text-emerald-700">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { Bell, Building2, Database, ShieldCheck } from "lucide-react";
import PageHeader from "../components/ui/PageHeader.jsx";
import { useData } from "../context/DataContext.jsx";

export default function Settings() {
  const { resetDemoData } = useData();

  const settings = [
    ["Keamanan akses", "Aktifkan verifikasi role dan pembatasan akses halaman berdasarkan jabatan pengguna.", ShieldCheck],
    ["Notifikasi maintenance", "Kirim pengingat kepada teknisi sebelum jadwal pemeriksaan alat medis.", Bell],
    ["Backup data", "Simpan cadangan data aset, mutasi, dan maintenance secara berkala.", Database],
    ["Unit rumah sakit", "Kelola daftar bangsal, IGD, ICU, poli, gudang, dan ruang operasi.", Building2]
  ];

  return (
    <div>
      <PageHeader title="Pengaturan Sistem" description="Konfigurasi dasar sistem, keamanan, notifikasi, dan preferensi pencatatan aset." />
      <div className="grid gap-5 xl:grid-cols-2">
        {settings.map(([title, desc, Icon]) => (
          <div key={title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700"><Icon size={22} /></div>
              <div className="flex-1"><h2 className="font-bold text-slate-950">{title}</h2><p className="mt-1 text-sm leading-6 text-slate-500">{desc}</p></div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" defaultChecked />
                <div className="h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition peer-checked:bg-emerald-600 peer-checked:after:translate-x-5" />
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-3xl border border-rose-200 bg-white p-5 shadow-sm">
        <h2 className="font-bold text-slate-950">Reset Data Demo</h2>
        <p className="mt-1 text-sm text-slate-500">Mengembalikan data dummy seperti awal. Berguna saat demo sudah terlalu kreatif.</p>
        <button onClick={resetDemoData} className="mt-4 rounded-2xl bg-rose-600 px-4 py-3 text-sm font-bold text-white">Reset Data</button>
      </div>
    </div>
  );
}

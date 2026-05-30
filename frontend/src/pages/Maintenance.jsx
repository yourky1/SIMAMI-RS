import { AlertTriangle, CalendarClock, CheckCircle2, Plus, UserCog } from "lucide-react";
import { useState } from "react";
import FormInput from "../components/ui/FormInput.jsx";
import Modal from "../components/ui/Modal.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import StatCard from "../components/ui/StatCard.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import { useData } from "../context/DataContext.jsx";
import { todayInputValue } from "../utils/date.js";

export default function Maintenance() {
  const { assets, maintenances, createMaintenance } = useData();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    assetId: assets[0]?.id || "",
    technician: "Teknisi Elektromedis A",
    scheduledDate: todayInputValue(),
    result: "",
    status: "Terjadwal",
    condition: "Butuh Kalibrasi"
  });

  function submit(event) {
    event.preventDefault();
    const asset = assets.find((item) => item.id === form.assetId);
    createMaintenance({ ...form, assetName: asset?.name || "-" });
    setOpen(false);
  }

  return (
    <div>
      <PageHeader
        title="Maintenance Alat Medis"
        description="Jadwal servis, hasil pemeriksaan, catatan teknisi, dan status tindak lanjut alat medis."
        action={<button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white"><Plus size={17} /> Jadwalkan Servis</button>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Jadwal Aktif" value={maintenances.filter((item) => item.status === "Terjadwal").length} note="Menunggu teknisi" icon={CalendarClock} tone="blue" />
        <StatCard title="Selesai Bulan Ini" value="19" note="Sudah divalidasi" icon={CheckCircle2} />
        <StatCard title="Butuh Tindak Lanjut" value={maintenances.filter((item) => item.status === "Butuh tindak lanjut").length} note="Prioritas tinggi" icon={AlertTriangle} tone="rose" />
        <StatCard title="Teknisi Aktif" value="3" note="Elektromedis & sarana" icon={UserCog} tone="amber" />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {maintenances.map((item) => (
          <div key={item.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{item.id}</p>
                <h2 className="mt-1 font-bold text-slate-950">{item.assetName}</h2>
              </div>
              <StatusBadge value={item.status} />
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p><span className="font-semibold text-slate-800">Tanggal:</span> {item.scheduledDate}</p>
              <p><span className="font-semibold text-slate-800">Teknisi:</span> {item.technician}</p>
              <p className="rounded-2xl bg-slate-50 p-4 leading-6">{item.result || "Belum ada catatan hasil pemeriksaan."}</p>
            </div>
          </div>
        ))}
      </div>

      <Modal open={open} title="Jadwalkan Maintenance" onClose={() => setOpen(false)}>
        <form onSubmit={submit} className="space-y-4">
          <FormInput label="Pilih Aset" as="select" value={form.assetId} onChange={(e) => setForm({ ...form, assetId: e.target.value })}>
            {assets.map((asset) => <option key={asset.id} value={asset.id}>{asset.id} - {asset.name}</option>)}
          </FormInput>
          <FormInput label="Teknisi" value={form.technician} onChange={(e) => setForm({ ...form, technician: e.target.value })} />
          <FormInput label="Tanggal Maintenance" type="date" value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} />
          <FormInput label="Status" as="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option>Terjadwal</option>
            <option>Selesai</option>
            <option>Butuh tindak lanjut</option>
          </FormInput>
          <FormInput label="Catatan Hasil" as="textarea" className="min-h-24 resize-none" value={form.result} onChange={(e) => setForm({ ...form, result: e.target.value })} />
          <button className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white">Simpan Maintenance</button>
        </form>
      </Modal>
    </div>
  );
}

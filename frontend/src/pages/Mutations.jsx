import { Plus } from "lucide-react";
import { useState } from "react";
import FormInput from "../components/ui/FormInput.jsx";
import Modal from "../components/ui/Modal.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import SearchFilterBar from "../components/ui/SearchFilterBar.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import { useData } from "../context/DataContext.jsx";
import { locations } from "../data/mockData.js";

export default function Mutations() {
  const { assets, mutations, createMutation } = useData();
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    assetId: assets[0]?.id || "",
    toLocation: "IGD",
    officer: "Petugas Bangsal",
    note: "",
    status: "Belum kembali"
  });

  const filtered = mutations.filter((item) =>
    [item.id, item.assetName, item.fromLocation, item.toLocation, item.officer, item.status].some((value) =>
      String(value).toLowerCase().includes(query.toLowerCase())
    )
  );

  function submit(event) {
    event.preventDefault();
    const asset = assets.find((item) => item.id === form.assetId);
    createMutation({
      ...form,
      assetName: asset?.name || "-",
      fromLocation: asset?.location || "-"
    });
    setModalOpen(false);
  }

  return (
    <div>
      <PageHeader
        title="Mutasi & Peminjaman Aset"
        description="Riwayat perpindahan aset antar unit, bangsal, IGD, ICU, ruang operasi, dan gudang alat medis."
        action={<button onClick={() => setModalOpen(true)} className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white"><Plus size={17} /> Tambah Mutasi</button>}
      />
      <SearchFilterBar value={query} onChange={setQuery} placeholder="Cari ID mutasi, nama aset, unit, atau petugas..." />

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="text-left text-xs font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Aset</th>
                <th className="px-4 py-3">Perpindahan</th>
                <th className="px-4 py-3">Petugas</th>
                <th className="px-4 py-3">Waktu</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((row) => (
                <tr key={row.id}>
                  <td className="whitespace-nowrap px-4 py-3 font-bold text-slate-900">{row.id}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">{row.assetName}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">{row.fromLocation} → {row.toLocation}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">{row.officer}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-500">{new Date(row.createdAt).toLocaleString("id-ID")}</td>
                  <td className="whitespace-nowrap px-4 py-3"><StatusBadge value={row.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} title="Tambah Mutasi Aset" onClose={() => setModalOpen(false)}>
        <form onSubmit={submit} className="space-y-4">
          <FormInput label="Pilih Aset" as="select" value={form.assetId} onChange={(e) => setForm({ ...form, assetId: e.target.value })}>
            {assets.map((asset) => <option key={asset.id} value={asset.id}>{asset.id} - {asset.name}</option>)}
          </FormInput>
          <FormInput label="Tujuan Lokasi" as="select" value={form.toLocation} onChange={(e) => setForm({ ...form, toLocation: e.target.value })}>
            {locations.map((location) => <option key={location}>{location}</option>)}
          </FormInput>
          <FormInput label="Petugas" value={form.officer} onChange={(e) => setForm({ ...form, officer: e.target.value })} />
          <FormInput label="Status" as="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option>Belum kembali</option>
            <option>Dipakai</option>
            <option>Selesai</option>
          </FormInput>
          <FormInput label="Catatan" as="textarea" className="min-h-24 resize-none" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
          <button className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white">Simpan Mutasi</button>
        </form>
      </Modal>
    </div>
  );
}

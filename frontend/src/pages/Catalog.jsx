import { CalendarDays, CheckCircle2, Grid2X2, MapPin, PackageSearch, Search, Send, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import AssetVisual from "../components/ui/AssetVisual.jsx";
import FormInput from "../components/ui/FormInput.jsx";
import Modal from "../components/ui/Modal.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useData } from "../context/DataContext.jsx";
import { locations } from "../data/mockData.js";
import { todayInputValue } from "../utils/date.js";

export default function Catalog() {
  const { user } = useAuth();
  const { assets, createBorrowRequest } = useData();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const [selected, setSelected] = useState(null);
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    borrower: user?.name || "",
    unit: user?.unit || "Bangsal Mawar",
    toLocation: "Bangsal Mawar",
    expectedReturn: todayInputValue(),
    purpose: ""
  });

  const categories = ["Semua", ...new Set(assets.map((asset) => asset.category))];

  const filtered = useMemo(() => {
    return assets.filter((asset) => {
      const matchQuery = [asset.id, asset.name, asset.location, asset.category].some((value) =>
        String(value).toLowerCase().includes(query.toLowerCase())
      );
      const matchCategory = category === "Semua" || asset.category === category;
      return matchQuery && matchCategory;
    });
  }, [assets, query, category]);

  function openBorrow(asset) {
    setSelected(asset);
    setSuccess("");
    setForm((prev) => ({
      ...prev,
      toLocation: user?.unit || "Bangsal Mawar",
      unit: user?.unit || "Bangsal Mawar",
      purpose: ""
    }));
  }

  function submit(event) {
    event.preventDefault();
    createBorrowRequest({
      assetId: selected.id,
      borrower: form.borrower,
      unit: form.unit,
      toLocation: form.toLocation,
      expectedReturn: form.expectedReturn,
      purpose: form.purpose || `Peminjaman ${selected.name} untuk kebutuhan pelayanan pasien.`
    });
    setSuccess(`Pengajuan peminjaman ${selected.name} berhasil dibuat.`);
    setSelected(null);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Internal Equipment Store"
        title="Katalog Alat Medis"
        description="Pilih alat medis berdasarkan kebutuhan unit. Desainnya dibuat seperti katalog internal premium agar petugas tidak perlu menatap tabel seolah itu hukuman administratif."
      />

      <div className="mb-5 rounded-[2rem] border border-white/70 bg-white/85 p-4 shadow-soft backdrop-blur-xl">
        <div className="grid gap-3 xl:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white/80 py-3 pl-11 pr-4 text-sm font-semibold outline-none transition focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              placeholder="Cari alat, kode aset, kategori, atau lokasi..."
            />
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-3 py-2">
            <SlidersHorizontal className="text-slate-400" size={18} />
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-transparent px-2 py-1 text-sm font-bold outline-none">
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white">
            <Grid2X2 size={18} /> {filtered.length} Item
          </div>
        </div>
      </div>

      {success && (
        <div className="mb-5 flex items-center gap-3 rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-black text-emerald-700 shadow-sm">
          <CheckCircle2 size={18} /> {success}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-4 xl:grid-cols-3">
        {filtered.map((asset) => {
          const canBorrow = asset.status === "Tersedia";
          return (
            <div key={asset.id} className="group overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-1.5 hover:shadow-soft">
              <AssetVisual type={asset.image} className="m-3 h-48" />
              <div className="p-5 pt-2">
                <div className="mb-3 flex flex-wrap gap-2">
                  <StatusBadge value={asset.status} />
                  <StatusBadge value={asset.priority} />
                </div>
                <h2 className="text-xl font-black text-slate-950">{asset.name}</h2>
                <p className="mt-1 text-sm font-medium text-slate-500">{asset.category} • {asset.id}</p>

                <div className="mt-4 grid gap-3 text-sm">
                  <div className="flex items-center gap-2 text-slate-600"><MapPin size={17} className="text-slate-400" /> {asset.location}</div>
                  <div className="flex items-center gap-2 text-slate-600"><CalendarDays size={17} className="text-slate-400" /> Maintenance: {asset.nextMaintenance}</div>
                  <div className="flex items-center gap-2 text-slate-600"><PackageSearch size={17} className="text-slate-400" /> Kondisi: {asset.condition}</div>
                </div>

                <button
                  disabled={!canBorrow}
                  onClick={() => openBorrow(asset)}
                  className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black transition ${
                    canBorrow
                      ? "bg-slate-950 text-white shadow-lg shadow-slate-200 hover:-translate-y-0.5 hover:bg-emerald-700"
                      : "cursor-not-allowed bg-slate-100 text-slate-400"
                  }`}
                >
                  <Send size={17} /> {canBorrow ? "Ajukan Peminjaman" : "Tidak Tersedia"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={Boolean(selected)} title="Ajukan Peminjaman Alat" onClose={() => setSelected(null)}>
        {selected && (
          <form onSubmit={submit} className="space-y-4">
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-xs font-black uppercase tracking-wider text-slate-400">Alat yang dipilih</p>
              <p className="mt-1 font-black text-slate-950">{selected.name}</p>
              <p className="text-sm text-slate-500">{selected.id} • Lokasi asal: {selected.location}</p>
            </div>
            <FormInput label="Nama Peminjam" value={form.borrower} onChange={(e) => setForm({ ...form, borrower: e.target.value })} required />
            <FormInput label="Unit Peminjam" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} required />
            <FormInput label="Lokasi Tujuan" as="select" value={form.toLocation} onChange={(e) => setForm({ ...form, toLocation: e.target.value })}>
              {locations.map((location) => <option key={location}>{location}</option>)}
            </FormInput>
            <FormInput label="Estimasi Pengembalian" type="date" value={form.expectedReturn} onChange={(e) => setForm({ ...form, expectedReturn: e.target.value })} required />
            <FormInput label="Keperluan" as="textarea" className="min-h-24 resize-none" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} placeholder="Contoh: digunakan untuk pasien observasi di Bangsal Mawar." />
            <button className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-black text-white hover:bg-emerald-700">
              Kirim Pengajuan <Send size={17} />
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
}

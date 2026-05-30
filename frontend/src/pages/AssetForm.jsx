import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormInput from "../components/ui/FormInput.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import { categories, locations } from "../data/mockData.js";
import { useData } from "../context/DataContext.jsx";
import { todayInputValue } from "../utils/date.js";

const blank = {
  id: "",
  name: "",
  category: "Monitoring",
  serialNumber: "",
  location: "IGD",
  status: "Tersedia",
  condition: "Baik",
  procurementDate: todayInputValue(),
  unitOwner: "",
  nextMaintenance: todayInputValue(),
  note: ""
};

export default function AssetForm() {
  const { assetId } = useParams();
  const navigate = useNavigate();
  const { assets, createAsset, updateAsset } = useData();
  const editing = Boolean(assetId);
  const current = useMemo(() => assets.find((item) => item.id === assetId), [assets, assetId]);
  const [form, setForm] = useState(current || blank);

  function setField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (editing) {
      updateAsset(assetId, form);
      navigate(`/assets/${assetId}`);
      return;
    }

    const item = createAsset(form);
    navigate(`/assets/${item.id}`);
  }

  return (
    <div>
      <PageHeader
        title={editing ? "Edit Aset" : "Tambah Aset"}
        description="Form ini digunakan untuk pencatatan aset baru dan pembaruan data aset medis."
      />

      <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <h2 className="mb-5 font-bold text-slate-950">Informasi Aset</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <FormInput label="Kode Aset" value={form.id} onChange={(e) => setField("id", e.target.value)} placeholder="AST-NEW-001" disabled={editing} />
            <FormInput label="Nama Aset" value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="Contoh: Syringe Pump" required />
            <FormInput label="Kategori" as="select" value={form.category} onChange={(e) => setField("category", e.target.value)}>
              {categories.map((item) => <option key={item}>{item}</option>)}
            </FormInput>
            <FormInput label="Serial Number" value={form.serialNumber} onChange={(e) => setField("serialNumber", e.target.value)} placeholder="SN-2026-001" />
            <FormInput label="Lokasi" as="select" value={form.location} onChange={(e) => setField("location", e.target.value)}>
              {locations.map((item) => <option key={item}>{item}</option>)}
            </FormInput>
            <FormInput label="Status" as="select" value={form.status} onChange={(e) => setField("status", e.target.value)}>
              <option>Tersedia</option>
              <option>Dipakai</option>
              <option>Dipinjam</option>
              <option>Maintenance</option>
            </FormInput>
            <FormInput label="Kondisi" as="select" value={form.condition} onChange={(e) => setField("condition", e.target.value)}>
              <option>Baik</option>
              <option>Perlu Cek Ringan</option>
              <option>Butuh Kalibrasi</option>
              <option>Rusak</option>
            </FormInput>
            <FormInput label="Tanggal Pengadaan" type="date" value={form.procurementDate} onChange={(e) => setField("procurementDate", e.target.value)} />
            <FormInput label="Maintenance Berikutnya" type="date" value={form.nextMaintenance} onChange={(e) => setField("nextMaintenance", e.target.value)} />
            <FormInput label="Penanggung Jawab Unit" value={form.unitOwner} onChange={(e) => setField("unitOwner", e.target.value)} placeholder="Contoh: Kepala Ruang ICU" />
            <FormInput label="Catatan" as="textarea" className="min-h-28 resize-none md:col-span-2" value={form.note} onChange={(e) => setField("note", e.target.value)} placeholder="Tulis catatan kondisi, kelengkapan, atau lokasi penyimpanan." />
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => navigate("/assets")} className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">Batal</button>
            <button className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-100 hover:bg-emerald-700">Simpan Aset</button>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-slate-950">Catatan Validasi</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p className="rounded-2xl bg-slate-50 p-4">Kode aset harus unik agar QR Code tidak berubah menjadi teka-teki logistik.</p>
            <p className="rounded-2xl bg-slate-50 p-4">Pilih lokasi awal sesuai posisi fisik alat ketika pertama kali didaftarkan.</p>
            <p className="rounded-2xl bg-slate-50 p-4">Setelah data disimpan, QR Code dapat dibuat dari halaman QR Code.</p>
          </div>
        </div>
      </form>
    </div>
  );
}

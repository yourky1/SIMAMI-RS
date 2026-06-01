import { Lock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormInput from "../components/ui/FormInput.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import { categories, locations } from "../data/mockData.js";
import { useData } from "../context/DataContext.jsx";
import { todayInputValue } from "../utils/date.js";

// ── Mapping: nama lokasi → kode singkat untuk ID aset & serial number ─────────
const LOCATION_CODE = {
  "IGD": "IGD",
  "ICU": "ICU",
  "Bangsal Mawar": "BM",
  "Bangsal Melati": "BMT",
  "Bangsal Anak": "BA",
  "Ruang Operasi": "RO",
  "Poli Umum": "POL",
  "Gudang Alat Medis": "GUD",
};

/**
 * Hitung nomor urut berikutnya untuk prefix tertentu dari daftar aset.
 * Contoh prefix "AST-IGD" → cek semua id dengan pola AST-IGD-NNN → ambil max NNN + 1.
 */
function nextSequence(existingAssets, prefix) {
  const pattern = new RegExp(`^${prefix}-(\\d+)$`);
  let max = 0;
  for (const a of existingAssets) {
    const m = (a.id ?? "").match(pattern);
    if (m) max = Math.max(max, parseInt(m[1], 10));
  }
  return String(max + 1).padStart(3, "0");
}

/**
 * Generate kode aset: AST-[LOC_CODE]-[NNN]
 */
function generateAssetId(location, existingAssets) {
  const loc = LOCATION_CODE[location] ?? location.toUpperCase().replace(/\s+/g, "").slice(0, 4);
  const prefix = `AST-${loc}`;
  const seq = nextSequence(existingAssets, prefix);
  return `${prefix}-${seq}`;
}

/**
 * Generate serial number: SN-[LOC_CODE]-[NNN]
 * Menggunakan nomor urut yang sama dengan kode aset supaya konsisten.
 */
function generateSerialNumber(location, assetId) {
  const loc = LOCATION_CODE[location] ?? location.toUpperCase().replace(/\s+/g, "").slice(0, 4);
  // Ambil nomor di belakang dari assetId (AST-LOC-NNN → NNN)
  const seq = assetId.split("-").pop() ?? "001";
  return `SN-${loc}-${seq}`;
}

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

  // ── Auto-generate kode & serial number saat mode tambah aset baru ────────────
  useEffect(() => {
    if (editing) return; // Saat edit, id tidak boleh berubah
    const generatedId = generateAssetId(form.location, assets);
    const generatedSN = generateSerialNumber(form.location, generatedId);
    setForm((prev) => ({ ...prev, id: generatedId, serialNumber: generatedSN }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.location, assets.length, editing]);

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

            {/* ── Kode Aset — auto-generated, read-only ─────────────────────── */}
            <label className="space-y-2">
              <span className="flex items-center gap-1.5 text-sm font-medium text-slate-900">
                Kode Aset
                <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-semibold text-teal-700 ring-1 ring-teal-200">
                  <Lock size={9} strokeWidth={2.5} />
                  Otomatis
                </span>
              </span>
              <div className="relative">
                <input
                  readOnly
                  value={form.id}
                  className="w-full cursor-not-allowed rounded-md border border-teal-200 bg-teal-50 px-3 py-2.5 text-sm font-mono font-semibold text-teal-800 outline-none"
                />
              </div>
              <p className="text-[11px] text-slate-400">Mengikuti pola AST-[LOKASI]-[NOMOR URUT]</p>
            </label>

            <FormInput label="Nama Aset" value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="Contoh: Syringe Pump" required />

            <FormInput label="Kategori" as="select" value={form.category} onChange={(e) => setField("category", e.target.value)}>
              {categories.map((item) => <option key={item}>{item}</option>)}
            </FormInput>

            {/* ── Serial Number — auto-generated, read-only ──────────────────── */}
            <label className="space-y-2">
              <span className="flex items-center gap-1.5 text-sm font-medium text-slate-900">
                Serial Number
                <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-semibold text-teal-700 ring-1 ring-teal-200">
                  <Lock size={9} strokeWidth={2.5} />
                  Otomatis
                </span>
              </span>
              <div className="relative">
                <input
                  readOnly
                  value={form.serialNumber}
                  className="w-full cursor-not-allowed rounded-md border border-teal-200 bg-teal-50 px-3 py-2.5 text-sm font-mono font-semibold text-teal-800 outline-none"
                />
              </div>
              <p className="text-[11px] text-slate-400">Mengikuti pola SN-[LOKASI]-[NOMOR URUT]</p>
            </label>

            {/* ── Lokasi — perubahan lokasi memicu regenerasi kode ──────────── */}
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
            <p className="rounded-2xl bg-slate-50 p-4">
              <strong className="text-slate-800">Kode Aset & Serial Number</strong> digenerate otomatis sesuai lokasi yang dipilih dan tidak dapat diubah manual.
            </p>
            <p className="rounded-2xl bg-slate-50 p-4">Ganti <strong className="text-slate-800">Lokasi</strong> untuk memperbarui kode dan nomor urut sesuai ruangan aset.</p>
            <p className="rounded-2xl bg-slate-50 p-4">Setelah data disimpan, QR Code dapat dibuat dari halaman QR Code.</p>
          </div>
        </div>
      </form>
    </div>
  );
}

import { Lock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormInput from "../components/ui/FormInput.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import { categories, locations } from "../data/mockData.js";
import { useData } from "../context/DataContext.jsx";
import { todayInputValue } from "../utils/date.js";

// Mapping nama lokasi ke kode singkat untuk ID aset dan serial number.
const LOCATION_CODE = {
  IGD: "IGD",
  ICU: "ICU",
  "Bangsal Mawar": "BM",
  "Bangsal Melati": "BMT",
  "Bangsal Anak": "BA",
  "Ruang Operasi": "RO",
  "Poli Umum": "POL",
  "Gudang Alat Medis": "GUD"
};

/**
 * Menghitung nomor urut berikutnya untuk prefix tertentu.
 * Contoh: AST-IGD → AST-IGD-001, AST-IGD-002, dan seterusnya.
 */
function nextSequence(existingAssets, prefix) {
  const pattern = new RegExp(`^${prefix}-(\\d+)$`);
  let max = 0;

  for (const asset of existingAssets) {
    const match = (asset.id ?? "").match(pattern);
    if (match) {
      max = Math.max(max, Number.parseInt(match[1], 10));
    }
  }

  return String(max + 1).padStart(3, "0");
}

/**
 * Membuat kode aset dengan pola AST-[KODE LOKASI]-[NOMOR].
 */
function generateAssetId(location, existingAssets) {
  const locationCode =
    LOCATION_CODE[location] ??
    location.toUpperCase().replace(/\s+/g, "").slice(0, 4);
  const prefix = `AST-${locationCode}`;
  const sequence = nextSequence(existingAssets, prefix);

  return `${prefix}-${sequence}`;
}

/**
 * Membuat serial number dengan pola SN-[KODE LOKASI]-[NOMOR].
 */
function generateSerialNumber(location, assetId) {
  const locationCode =
    LOCATION_CODE[location] ??
    location.toUpperCase().replace(/\s+/g, "").slice(0, 4);
  const sequence = assetId.split("-").pop() ?? "001";

  return `SN-${locationCode}-${sequence}`;
}

function createBlankForm() {
  return {
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
}

export default function AssetForm() {
  const { assetId } = useParams();
  const navigate = useNavigate();
  const { assets, createAsset, updateAsset } = useData();

  const editing = Boolean(assetId);
  const current = useMemo(
    () => assets.find((item) => item.id === assetId),
    [assets, assetId]
  );

  const [form, setForm] = useState(() => current || createBlankForm());
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Saat data edit baru selesai dimuat dari API, isi form dengan aset tersebut.
  useEffect(() => {
    if (editing && current) {
      setForm(current);
    }
  }, [editing, current]);

  // Saat menambah aset, ID dan serial number mengikuti lokasi yang dipilih.
  useEffect(() => {
    if (editing) return;

    const generatedId = generateAssetId(form.location, assets);
    const generatedSerialNumber = generateSerialNumber(form.location, generatedId);

    setForm((previous) => ({
      ...previous,
      id: generatedId,
      serialNumber: generatedSerialNumber
    }));
  }, [form.location, assets, editing]);

  function setField(name, value) {
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (saving) return;

    setSubmitError("");
    setSaving(true);

    try {
      if (editing) {
        await updateAsset(assetId, form);
        navigate(`/assets/${assetId}`, { replace: true });
        return;
      }

      const item = await createAsset(form);

      if (!item?.id) {
        throw new Error("Data tersimpan, tetapi ID aset tidak diterima dari server.");
      }

      navigate(`/assets/${item.id}`, { replace: true });
    } catch (error) {
      setSubmitError(error.message || "Gagal menyimpan data aset.");
    } finally {
      setSaving(false);
    }
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

          {submitError && (
            <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {submitError}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="flex items-center gap-1.5 text-sm font-medium text-slate-900">
                Kode Aset
                <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-semibold text-teal-700 ring-1 ring-teal-200">
                  <Lock size={9} strokeWidth={2.5} />
                  Otomatis
                </span>
              </span>
              <input
                readOnly
                value={form.id}
                className="w-full cursor-not-allowed rounded-md border border-teal-200 bg-teal-50 px-3 py-2.5 text-sm font-mono font-semibold text-teal-800 outline-none"
              />
              <p className="text-[11px] text-slate-400">
                Mengikuti pola AST-[LOKASI]-[NOMOR URUT]
              </p>
            </label>

            <FormInput
              label="Nama Aset"
              value={form.name}
              onChange={(event) => setField("name", event.target.value)}
              placeholder="Contoh: Syringe Pump"
              required
            />

            <FormInput
              label="Kategori"
              as="select"
              value={form.category}
              onChange={(event) => setField("category", event.target.value)}
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </FormInput>

            <label className="space-y-2">
              <span className="flex items-center gap-1.5 text-sm font-medium text-slate-900">
                Serial Number
                <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-semibold text-teal-700 ring-1 ring-teal-200">
                  <Lock size={9} strokeWidth={2.5} />
                  Otomatis
                </span>
              </span>
              <input
                readOnly
                value={form.serialNumber}
                className="w-full cursor-not-allowed rounded-md border border-teal-200 bg-teal-50 px-3 py-2.5 text-sm font-mono font-semibold text-teal-800 outline-none"
              />
              <p className="text-[11px] text-slate-400">
                Mengikuti pola SN-[LOKASI]-[NOMOR URUT]
              </p>
            </label>

            <FormInput
              label="Lokasi"
              as="select"
              value={form.location}
              onChange={(event) => setField("location", event.target.value)}
            >
              {locations.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </FormInput>

            <FormInput
              label="Status"
              as="select"
              value={form.status}
              onChange={(event) => setField("status", event.target.value)}
            >
              <option>Tersedia</option>
              <option>Dipakai</option>
              <option>Dipinjam</option>
              <option>Maintenance</option>
            </FormInput>

            <FormInput
              label="Kondisi"
              as="select"
              value={form.condition}
              onChange={(event) => setField("condition", event.target.value)}
            >
              <option>Baik</option>
              <option>Perlu Cek Ringan</option>
              <option>Butuh Kalibrasi</option>
              <option>Rusak</option>
            </FormInput>

            <FormInput
              label="Tanggal Pengadaan"
              type="date"
              value={form.procurementDate}
              onChange={(event) => setField("procurementDate", event.target.value)}
            />

            <FormInput
              label="Maintenance Berikutnya"
              type="date"
              value={form.nextMaintenance}
              onChange={(event) => setField("nextMaintenance", event.target.value)}
            />

            <FormInput
              label="Penanggung Jawab Unit"
              value={form.unitOwner}
              onChange={(event) => setField("unitOwner", event.target.value)}
              placeholder="Contoh: Kepala Ruang ICU"
            />

            <FormInput
              label="Catatan"
              as="textarea"
              className="min-h-28 resize-none md:col-span-2"
              value={form.note}
              onChange={(event) => setField("note", event.target.value)}
              placeholder="Tulis catatan kondisi, kelengkapan, atau lokasi penyimpanan."
            />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={saving}
              onClick={() => navigate("/assets")}
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-100 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Menyimpan..." : editing ? "Simpan Perubahan" : "Simpan Aset"}
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-slate-950">Catatan Validasi</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p className="rounded-2xl bg-slate-50 p-4">
              <strong className="text-slate-800">Kode Aset & Serial Number</strong>{" "}
              dibuat otomatis sesuai lokasi yang dipilih dan tidak dapat diubah manual.
            </p>
            <p className="rounded-2xl bg-slate-50 p-4">
              Ganti <strong className="text-slate-800">Lokasi</strong> untuk memperbarui
              kode dan nomor urut sesuai ruangan aset.
            </p>
            <p className="rounded-2xl bg-slate-50 p-4">
              Setelah data disimpan, QR Code dapat dibuat dari halaman QR Code.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

import { Html5Qrcode } from "html5-qrcode";
import { Camera, CheckCircle2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import FormInput from "../components/ui/FormInput.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import { useData } from "../context/DataContext.jsx";
import { locations } from "../data/mockData.js";

export default function ScanQR() {
  const { assets, createMutation } = useData();
  const [scanning, setScanning] = useState(false);
  const [asset, setAsset] = useState(null);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ toLocation: "IGD", note: "", officer: "Petugas Bangsal", status: "Belum kembali" });
  const qrRef = useRef(null);

  function resolveAsset(rawText) {
    try {
      const parsed = JSON.parse(rawText);
      return assets.find((item) => item.id === parsed.assetId);
    } catch {
      return assets.find((item) => item.id === rawText);
    }
  }

  async function startScanner() {
    setMessage("");
    setScanning(true);
    const scanner = new Html5Qrcode("qr-reader");
    qrRef.current = scanner;

    try {
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          const found = resolveAsset(decodedText);
          if (found) {
            setAsset(found);
            setMessage("Scan berhasil.");
            await scanner.stop();
            setScanning(false);
          } else {
            setMessage("QR terbaca, tetapi aset tidak ditemukan.");
          }
        }
      );
    } catch (error) {
      setScanning(false);
      setMessage("Kamera tidak bisa diakses. Pastikan izin kamera aktif atau gunakan simulasi scan.");
    }
  }

  async function stopScanner() {
    if (qrRef.current && scanning) {
      await qrRef.current.stop();
      setScanning(false);
    }
  }

  function simulateScan() {
    const sample = assets[3] || assets[0];
    setAsset(sample);
    setMessage("Scan berhasil melalui simulasi.");
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!asset) return;

    createMutation({
      assetId: asset.id,
      assetName: asset.name,
      fromLocation: asset.location,
      toLocation: form.toLocation,
      officer: form.officer,
      note: form.note,
      status: form.status
    });

    setMessage("Transaksi mutasi berhasil disimpan.");
  }

  useEffect(() => {
    return () => {
      if (qrRef.current && scanning) {
        qrRef.current.stop().catch(() => {});
      }
    };
  }, [scanning]);

  return (
    <div>
      <PageHeader title="Scan QR Code" description="Pindai QR Code menggunakan kamera perangkat untuk melihat detail aset dan mencatat mutasi atau peminjaman antar unit." />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white shadow-sm xl:col-span-2">
          <div className="relative min-h-[420px] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-emerald-950 p-4">
            <div id="qr-reader" className="mx-auto max-w-lg overflow-hidden rounded-3xl" />
            {!scanning && (
              <div className="grid min-h-[380px] place-items-center text-center">
                <div>
                  <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-white/10 backdrop-blur">
                    <Camera size={36} />
                  </div>
                  <h2 className="mt-5 text-xl font-bold">Area Pemindaian QR</h2>
                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-300">Arahkan kamera ke stiker QR aset. Untuk laptop tanpa kamera, gunakan simulasi scan.</p>
                  <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                    <button onClick={startScanner} className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-400">Mulai Scan Kamera</button>
                    <button onClick={simulateScan} className="rounded-2xl border border-white/20 px-5 py-3 text-sm font-bold text-white hover:bg-white/10">Simulasikan Scan</button>
                  </div>
                </div>
              </div>
            )}
            {scanning && <button onClick={stopScanner} className="mt-4 rounded-2xl bg-rose-500 px-5 py-3 text-sm font-bold text-white">Hentikan Scan</button>}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-slate-950">Hasil Scan</h2>
          {message && <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">{message}</div>}

          {!asset ? (
            <div className="mt-5 rounded-3xl bg-slate-50 p-5 text-sm leading-6 text-slate-500">Belum ada QR Code yang terbaca.</div>
          ) : (
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-950">{asset.name}</p>
                    <p className="text-sm text-slate-500">{asset.id} • {asset.location}</p>
                  </div>
                  <StatusBadge value={asset.status} />
                </div>
              </div>

              <FormInput label="Petugas" value={form.officer} onChange={(e) => setForm({ ...form, officer: e.target.value })} />
              <FormInput label="Mutasi ke lokasi" as="select" value={form.toLocation} onChange={(e) => setForm({ ...form, toLocation: e.target.value })}>
                {locations.map((location) => <option key={location}>{location}</option>)}
              </FormInput>
              <FormInput label="Status transaksi" as="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option>Belum kembali</option>
                <option>Dipakai</option>
                <option>Selesai</option>
              </FormInput>
              <FormInput label="Catatan" as="textarea" className="min-h-24 resize-none" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Contoh: dipinjam untuk pasien observasi." />
              <button className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700">
                <CheckCircle2 size={18} /> Simpan Transaksi
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

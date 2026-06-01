import { Html5Qrcode } from "html5-qrcode";
import { Camera, CheckCircle2, StopCircle } from "lucide-react";
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
  const [form, setForm] = useState({
    toLocation: "IGD",
    note: "",
    officer: "Petugas Bangsal",
    status: "Belum kembali"
  });
  const qrRef = useRef(null);
  const scanningRef = useRef(false); // ref untuk hindari stale closure

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
    scanningRef.current = true;

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
            await scanner.stop().catch(() => { });
            scanningRef.current = false;
            setScanning(false);
          } else {
            setMessage("QR terbaca, tetapi aset tidak ditemukan.");
          }
        }
      );
    } catch {
      scanningRef.current = false;
      setScanning(false);
      setMessage("Kamera tidak bisa diakses. Pastikan izin kamera aktif atau gunakan simulasi scan.");
    }
  }

  async function stopScanner() {
    if (qrRef.current && scanningRef.current) {
      try {
        await qrRef.current.stop();
      } catch {
        // scanner mungkin sudah berhenti
      }
      qrRef.current = null;
    }
    scanningRef.current = false;
    setScanning(false);
    setMessage("Scan dihentikan.");
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

  // Cleanup saat komponen unmount
  useEffect(() => {
    return () => {
      if (qrRef.current && scanningRef.current) {
        qrRef.current.stop().catch(() => { });
      }
    };
  }, []);

  return (
    <div>
      <PageHeader
        title="Scan QR Code"
        description="Pindai QR Code menggunakan kamera perangkat untuk melihat detail aset dan mencatat mutasi atau peminjaman antar unit."
      />

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Scanner Panel */}
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-900 xl:col-span-2">
          {/* Tombol kontrol di atas — selalu terlihat */}
          <div className="flex items-center justify-between border-b border-slate-700 px-5 py-3">
            <p className="text-sm font-medium text-slate-300">Area Pemindaian Kamera</p>
            {scanning ? (
              <button
                onClick={stopScanner}
                className="inline-flex items-center gap-1.5 rounded-md bg-rose-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-rose-500"
              >
                <StopCircle size={14} />
                Hentikan Scan
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={startScanner}
                  className="inline-flex items-center gap-1.5 rounded-md bg-teal-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-teal-500"
                >
                  <Camera size={14} />
                  Mulai Scan
                </button>
                <button
                  onClick={simulateScan}
                  className="inline-flex items-center gap-1.5 rounded-md border border-slate-600 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800"
                >
                  Simulasikan Scan
                </button>
              </div>
            )}
          </div>

          {/* Area kamera — div #qr-reader SELALU ada di DOM */}
          <div className="relative min-h-[380px] p-5">
            {/* div ini harus selalu ada agar Html5Qrcode bisa attach */}
            <div id="qr-reader" className="mx-auto max-w-lg overflow-hidden rounded-lg" />

            {/* Overlay placeholder saat tidak sedang scan */}
            {!scanning && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
                <div className="grid h-16 w-16 place-items-center rounded-lg bg-white/10">
                  <Camera size={32} className="text-slate-300" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white">Area Pemindaian QR</h2>
                  <p className="mt-1 max-w-sm text-sm text-slate-400">
                    Arahkan kamera ke stiker QR aset. Untuk laptop tanpa kamera, gunakan simulasi scan.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Pesan status */}
          {message && (
            <div className="border-t border-slate-700 px-5 py-3 text-sm font-medium text-slate-300">
              {message}
            </div>
          )}
        </div>

        {/* Hasil Scan + Form */}
        <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="font-semibold text-slate-900">Hasil Scan</h2>

          {!asset ? (
            <div className="mt-4 rounded-md bg-slate-50 p-4 text-sm text-slate-500">
              Belum ada QR Code yang terbaca.
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              <div className="rounded-md border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{asset.name}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {asset.id} • {asset.location}
                    </p>
                  </div>
                  <StatusBadge value={asset.status} />
                </div>
              </div>

              <FormInput
                label="Petugas"
                value={form.officer}
                onChange={(e) => setForm({ ...form, officer: e.target.value })}
              />
              <FormInput
                label="Mutasi ke lokasi"
                as="select"
                value={form.toLocation}
                onChange={(e) => setForm({ ...form, toLocation: e.target.value })}
              >
                {locations.map((loc) => (
                  <option key={loc}>{loc}</option>
                ))}
              </FormInput>
              <FormInput
                label="Status transaksi"
                as="select"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option>Belum kembali</option>
                <option>Dipakai</option>
                <option>Selesai</option>
              </FormInput>
              <FormInput
                label="Catatan"
                as="textarea"
                className="min-h-24 resize-none"
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                placeholder="Contoh: dipinjam untuk pasien observasi."
              />
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
              >
                <CheckCircle2 size={16} />
                Simpan Transaksi
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

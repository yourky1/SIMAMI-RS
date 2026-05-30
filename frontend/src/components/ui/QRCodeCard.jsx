import { Printer, QrCode } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

export default function QRCodeCard({ asset }) {
  if (!asset) return null;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-slate-950">QR Aset</h2>
        <QrCode className="text-slate-400" />
      </div>

      <div className="print-area mt-5 flex justify-center">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 text-center">
          <QRCodeCanvas value={JSON.stringify({ assetId: asset.id, name: asset.name })} size={180} level="H" includeMargin />
          <p className="mt-3 text-xs font-bold uppercase tracking-wider text-slate-400">Kode Inventaris</p>
          <p className="font-black text-slate-950">{asset.id}</p>
          <p className="text-sm text-slate-500">{asset.name}</p>
          <p className="text-xs text-slate-400">{asset.location}</p>
        </div>
      </div>

      <button onClick={() => window.print()} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800">
        <Printer size={18} /> Cetak Stiker QR
      </button>
    </div>
  );
}

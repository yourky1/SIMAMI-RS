import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { QrCode, Printer, Download, Search } from 'lucide-react';
import QRCode from 'qrcode';
import AppLayout from '../components/layout/AppLayout';
import StatusBadge from '../components/common/StatusBadge';
import { asets } from '../data/dummy';

function QRCard({ aset, qrDataUrl }) {
  return (
    <div className="bg-white border-2 border-slate-200 rounded-xl p-5 text-center" id={`qr-card-${aset.id}`}>
      <div className="mb-3">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">RS Permata Medika</p>
        <p className="text-xs text-slate-400">SIMAMI-RS</p>
      </div>
      <div className="flex justify-center mb-3">
        {qrDataUrl ? (
          <img src={qrDataUrl} alt={`QR ${aset.kode}`} className="w-36 h-36" />
        ) : (
          <div className="w-36 h-36 bg-slate-100 rounded-lg flex items-center justify-center">
            <QrCode className="w-10 h-10 text-slate-300" />
          </div>
        )}
      </div>
      <div className="border-t border-dashed border-slate-200 pt-3">
        <p className="font-bold text-slate-800 text-sm leading-snug">{aset.nama}</p>
        <p className="font-mono text-primary-600 font-bold text-sm mt-1">{aset.kode}</p>
        <p className="text-xs text-slate-400 mt-0.5">{aset.nomorInventaris}</p>
        <p className="text-xs text-slate-500 mt-1">{aset.lokasi}</p>
      </div>
    </div>
  );
}

export default function QRCodePage() {
  const [searchParams] = useSearchParams();
  const preselect = searchParams.get('id');
  const [selectedId, setSelectedId] = useState(preselect || '');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [search, setSearch] = useState('');

  const selectedAset = asets.find(a => a.id === selectedId);

  const filteredAsets = asets.filter(a =>
    !search || a.nama.toLowerCase().includes(search.toLowerCase()) || a.kode.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (!selectedAset) { setQrDataUrl(''); return; }
    const data = JSON.stringify({ id: selectedAset.id, kode: selectedAset.kode, nama: selectedAset.nama });
    QRCode.toDataURL(data, {
      width: 256, margin: 2,
      color: { dark: '#1e293b', light: '#ffffff' }
    }).then(setQrDataUrl).catch(console.error);
  }, [selectedId]);

  const handlePrint = () => {
    if (!selectedAset) return;
    const w = window.open('', '_blank');
    w.document.write(`
      <html><head><title>Stiker QR — ${selectedAset.kode}</title>
      <style>
        body { font-family: sans-serif; padding: 20px; text-align: center; }
        .card { border: 2px solid #e2e8f0; border-radius: 12px; padding: 20px; display: inline-block; max-width: 200px; }
        .header { font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }
        img { width: 144px; height: 144px; margin: 10px 0; }
        .nama { font-size: 11px; font-weight: 700; color: #1e293b; }
        .kode { font-family: monospace; font-size: 12px; font-weight: 700; color: #32a86d; }
        .inv { font-size: 9px; color: #94a3b8; }
        .lokasi { font-size: 10px; color: #64748b; margin-top: 4px; }
        hr { border: 1px dashed #e2e8f0; margin: 10px 0; }
      </style></head><body>
      <div class="card">
        <p class="header">RS Permata Medika</p>
        <img src="${qrDataUrl}" />
        <hr/>
        <p class="nama">${selectedAset.nama}</p>
        <p class="kode">${selectedAset.kode}</p>
        <p class="inv">${selectedAset.nomorInventaris}</p>
        <p class="lokasi">${selectedAset.lokasi}</p>
      </div>
      <script>window.onload=()=>{window.print();window.close();}</script>
      </body></html>
    `);
    w.document.close();
  };

  return (
    <AppLayout title="Generate QR Code Aset" subtitle="Buat dan cetak stiker QR untuk identifikasi aset medis">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Aset list */}
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input className="text-sm bg-transparent outline-none flex-1 placeholder-slate-400"
                placeholder="Cari aset..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="overflow-y-auto max-h-[calc(100vh-280px)]">
            {filteredAsets.map(a => (
              <button
                key={a.id}
                onClick={() => setSelectedId(a.id)}
                className={`w-full text-left px-4 py-3.5 border-b border-slate-50 hover:bg-slate-50 transition-colors ${selectedId === a.id ? 'bg-primary-50 border-l-2 border-l-primary-500' : ''}`}
              >
                <p className="text-sm font-medium text-slate-800 leading-snug">{a.nama}</p>
                <p className="text-xs font-mono text-slate-500 mt-0.5">{a.kode}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <StatusBadge status={a.status} size="xs" />
                  <span className="text-xs text-slate-400">{a.lokasi}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: QR Preview */}
        <div className="lg:col-span-2">
          {!selectedAset ? (
            <div className="card h-full flex items-center justify-center py-20">
              <div className="text-center">
                <QrCode className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                <p className="text-sm text-slate-400">Pilih aset di sebelah kiri untuk men-generate QR Code.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="card p-5">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-base font-semibold text-slate-800">{selectedAset.nama}</h3>
                    <p className="text-xs text-slate-400 mt-0.5 font-mono">{selectedAset.kode} · {selectedAset.nomorInventaris}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handlePrint} className="btn-primary">
                      <Printer className="w-4 h-4" /> Cetak Stiker
                    </button>
                    {qrDataUrl && (
                      <a href={qrDataUrl} download={`QR-${selectedAset.kode}.png`} className="btn-secondary">
                        <Download className="w-4 h-4" /> Unduh
                      </a>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                  {/* Preview stiker */}
                  <div>
                    <p className="label mb-3">Preview Stiker QR</p>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex justify-center">
                      <QRCard aset={selectedAset} qrDataUrl={qrDataUrl} />
                    </div>
                    <p className="text-xs text-slate-400 text-center mt-2">Tampilan stiker yang akan dicetak</p>
                  </div>

                  {/* Info aset */}
                  <div className="space-y-3">
                    <p className="label">Informasi Aset</p>
                    {[
                      ['Lokasi Sekarang', selectedAset.lokasi],
                      ['Status', <StatusBadge key="s" status={selectedAset.status} />],
                      ['Kondisi', <StatusBadge key="k" status={selectedAset.kondisi} showDot={false} />],
                      ['Merk / Model', `${selectedAset.merk} ${selectedAset.model}`],
                      ['Penanggung Jawab', selectedAset.penanggungJawab],
                    ].map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between py-2 border-b border-slate-50">
                        <span className="text-xs text-slate-500">{k}</span>
                        <span className="text-xs font-medium text-slate-800">{v}</span>
                      </div>
                    ))}
                    <div className="bg-amber-50 rounded-lg p-3 mt-3">
                      <p className="text-xs text-amber-700 font-semibold mb-1">Jika QR Code Rusak</p>
                      <p className="text-xs text-amber-600">Masukkan kode aset secara manual: <span className="font-mono font-bold">{selectedAset.kode}</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

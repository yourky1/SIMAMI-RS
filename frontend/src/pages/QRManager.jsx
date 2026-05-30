import { useState } from "react";
import PageHeader from "../components/ui/PageHeader.jsx";
import QRCodeCard from "../components/ui/QRCodeCard.jsx";
import SearchFilterBar from "../components/ui/SearchFilterBar.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import { useData } from "../context/DataContext.jsx";
import { cn } from "../utils/cn.js";

export default function QRManager() {
  const { assets } = useData();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(assets[0]);

  const filtered = assets.filter((asset) =>
    [asset.id, asset.name, asset.location].some((value) => String(value).toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div>
      <PageHeader
        title="Generate & Print QR Code"
        description="Setiap aset memiliki identitas digital agar proses mutasi dan pelacakan lokasi tidak lagi bergantung pada ingatan manusia, karena itu strategi yang sangat rapuh."
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <SearchFilterBar value={query} onChange={setQuery} placeholder="Cari aset untuk dibuatkan QR..." />
          <div className="space-y-3">
            {filtered.map((asset) => (
              <button
                key={asset.id}
                onClick={() => setSelected(asset)}
                className={cn("flex w-full items-center justify-between rounded-2xl border p-4 text-left transition", selected?.id === asset.id ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white hover:bg-slate-50")}
              >
                <div>
                  <p className="font-bold text-slate-950">{asset.name}</p>
                  <p className="text-sm text-slate-500">{asset.id} • {asset.location}</p>
                </div>
                <StatusBadge value={asset.status} />
              </button>
            ))}
          </div>
        </div>
        <QRCodeCard asset={selected} />
      </div>
    </div>
  );
}

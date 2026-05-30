import { CalendarClock, MapPin, UserRound } from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";
import BorrowTimeline from "./BorrowTimeline.jsx";

export default function BorrowRequestCard({ request, actions }) {
  return (
    <div className="group rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-soft">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-black uppercase tracking-wider text-slate-400">{request.id}</p>
            <StatusBadge value={request.status} />
          </div>
          <h3 className="mt-2 text-xl font-black text-slate-950">{request.assetName}</h3>
          <p className="mt-1 text-sm leading-7 text-slate-500">{request.purpose}</p>
        </div>
        {actions}
      </div>

      <div className="mt-5 grid gap-3 text-sm md:grid-cols-3">
        <div className="rounded-2xl bg-slate-50/90 p-3 ring-1 ring-slate-100">
          <UserRound className="mb-2 text-slate-400" size={18} />
          <p className="font-black text-slate-900">{request.borrower}</p>
          <p className="text-xs text-slate-500">{request.unit}</p>
        </div>
        <div className="rounded-2xl bg-slate-50/90 p-3 ring-1 ring-slate-100">
          <MapPin className="mb-2 text-slate-400" size={18} />
          <p className="font-black text-slate-900">{request.fromLocation}</p>
          <p className="text-xs text-slate-500">Tujuan: {request.toLocation}</p>
        </div>
        <div className="rounded-2xl bg-slate-50/90 p-3 ring-1 ring-slate-100">
          <CalendarClock className="mb-2 text-slate-400" size={18} />
          <p className="font-black text-slate-900">Kembali: {request.expectedReturn}</p>
          <p className="text-xs text-slate-500">{new Date(request.requestedAt).toLocaleString("id-ID")}</p>
        </div>
      </div>

      <div className="mt-5 rounded-3xl bg-gradient-to-br from-slate-50 to-white p-4 ring-1 ring-slate-100">
        <BorrowTimeline timeline={request.timeline} />
      </div>
    </div>
  );
}

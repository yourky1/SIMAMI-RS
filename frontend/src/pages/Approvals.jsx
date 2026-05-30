import { Check, PackageCheck, Send, X } from "lucide-react";
import BorrowRequestCard from "../components/ui/BorrowRequestCard.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import StatCard from "../components/ui/StatCard.jsx";
import { useData } from "../context/DataContext.jsx";

export default function Approvals() {
  const { borrowRequests, updateBorrowStatus } = useData();
  const waiting = borrowRequests.filter((item) => item.status === "Menunggu Persetujuan");
  const approved = borrowRequests.filter((item) => item.status === "Disetujui");
  const active = borrowRequests.filter((item) => item.status === "Sedang Dipinjam");

  return (
    <div>
      <PageHeader
        title="Approval Peminjaman"
        description="Admin dapat menyetujui, menolak, menyerahkan, dan memantau permintaan peminjaman alat medis antar unit."
      />

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <StatCard title="Menunggu Approval" value={waiting.length} note="Perlu keputusan admin" icon={Send} tone="amber" />
        <StatCard title="Sudah Disetujui" value={approved.length} note="Menunggu penyerahan" icon={Check} tone="blue" />
        <StatCard title="Sedang Dipinjam" value={active.length} note="Aktif di unit peminjam" icon={PackageCheck} tone="emerald" />
      </div>

      <div className="grid gap-5">
        {borrowRequests.length === 0 ? (
          <EmptyState title="Belum ada pengajuan" description="Pengajuan dari katalog alat akan muncul di sini." />
        ) : (
          borrowRequests.map((request) => (
            <BorrowRequestCard
              key={request.id}
              request={request}
              actions={
                <div className="flex flex-wrap gap-2">
                  {request.status === "Menunggu Persetujuan" && (
                    <>
                      <button onClick={() => updateBorrowStatus(request.id, "Disetujui")} className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"><Check size={17} /> Setujui</button>
                      <button onClick={() => updateBorrowStatus(request.id, "Ditolak")} className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50"><X size={17} /> Tolak</button>
                    </>
                  )}
                  {request.status === "Disetujui" && (
                    <button onClick={() => updateBorrowStatus(request.id, "Sedang Dipinjam")} className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"><PackageCheck size={17} /> Serahkan Alat</button>
                  )}
                  {request.status === "Sedang Dipinjam" && (
                    <button onClick={() => updateBorrowStatus(request.id, "Selesai")} className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"><Check size={17} /> Tandai Kembali</button>
                  )}
                </div>
              }
            />
          ))
        )}
      </div>
    </div>
  );
}

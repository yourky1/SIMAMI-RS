import { RotateCcw } from "lucide-react";
import BorrowRequestCard from "../components/ui/BorrowRequestCard.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useData } from "../context/DataContext.jsx";

export default function MyBorrows() {
  const { user } = useAuth();
  const { borrowRequests, updateBorrowStatus } = useData();

  const mine = borrowRequests.filter((request) => request.borrower === user?.name || request.unit === user?.unit);

  return (
    <div>
      <PageHeader
        title="Peminjaman Saya"
        description="Pantau status pengajuan, approval, penyerahan alat, dan pengembalian. Jadi tidak perlu tanya ke admin lima kali, walau manusia tampaknya menyukai itu."
      />

      {mine.length === 0 ? (
        <EmptyState title="Belum ada peminjaman" description="Ajukan peminjaman dari halaman katalog alat medis." />
      ) : (
        <div className="grid gap-5">
          {mine.map((request) => (
            <BorrowRequestCard
              key={request.id}
              request={request}
              actions={
                request.status === "Sedang Dipinjam" ? (
                  <button
                    onClick={() => updateBorrowStatus(request.id, "Selesai")}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
                  >
                    <RotateCcw size={17} /> Kembalikan Alat
                  </button>
                ) : null
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

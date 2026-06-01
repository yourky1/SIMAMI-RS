import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header.jsx";
import Sidebar from "../components/layout/Sidebar.jsx";
import { useData } from "../context/DataContext.jsx";

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const { loading, error } = useData();

  return (
    <div className="h-screen overflow-hidden bg-slate-50 text-slate-900">
      {open && (
        <button
          aria-label="Tutup sidebar"
          className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="flex h-screen overflow-hidden">
        <Sidebar open={open} setOpen={setOpen} />

        <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
          <Header setOpen={setOpen} />

          <main className="premium-scrollbar min-h-0 flex-1 overflow-y-auto scroll-smooth p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-[1600px]">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-teal-600" />
                  <p className="mt-4 text-sm text-slate-500">Memuat data dari server…</p>
                </div>
              ) : error ? (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-6 text-center text-sm text-rose-700">
                  <p className="font-semibold">Gagal menghubungi server backend.</p>
                  <p className="mt-1 text-rose-500">{error}</p>
                  <p className="mt-2 text-rose-400">Pastikan backend Express sudah berjalan di <code className="font-mono">localhost:5000</code></p>
                </div>
              ) : (
                <Outlet />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}



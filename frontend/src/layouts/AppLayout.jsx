import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header.jsx";
import Sidebar from "../components/layout/Sidebar.jsx";

export default function AppLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="h-screen overflow-hidden bg-slate-100 text-slate-900">
      <div className="pointer-events-none fixed inset-0 -z-10 subtle-grid opacity-80" />
      <div className="pointer-events-none fixed -left-28 top-20 -z-10 h-96 w-96 rounded-full bg-emerald-300/30 blur-3xl" />
      <div className="pointer-events-none fixed -right-24 top-0 -z-10 h-96 w-96 rounded-full bg-sky-300/25 blur-3xl" />
      <div className="pointer-events-none fixed bottom-0 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-teal-300/20 blur-3xl" />

      {open && (
        <button
          aria-label="Tutup sidebar"
          className="fixed inset-0 z-30 bg-slate-950/45 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="flex h-screen overflow-hidden">
        <Sidebar open={open} setOpen={setOpen} />

        <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
          <Header setOpen={setOpen} />

          <main className="premium-scrollbar min-h-0 flex-1 overflow-y-auto scroll-smooth p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-[1600px]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

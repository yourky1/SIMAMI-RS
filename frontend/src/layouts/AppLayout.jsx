import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header.jsx";
import Sidebar from "../components/layout/Sidebar.jsx";

export default function AppLayout() {
  const [open, setOpen] = useState(false);

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
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}


import { useState } from "react";
import { Activity, ArrowRight, BadgeCheck, Boxes, QrCode, Stethoscope, UserCog, UserRound, Wrench } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const quickAccounts = [
  {
    role: "Administrator",
    email: "admin.simami@permata-medika.id",
    password: "password",
    icon: UserCog,
    note: "Dashboard admin, approval, aset, laporan"
  },
  {
    role: "Petugas Bangsal",
    email: "siti@permata-medika.id",
    password: "password",
    icon: UserRound,
    note: "Portal petugas, katalog, peminjaman"
  },
  {
    role: "Teknisi",
    email: "budi@permata-medika.id",
    password: "password",
    icon: Wrench,
    note: "Maintenance, scan QR, detail aset"
  }
];

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: "admin.simami@permata-medika.id",
    password: "password"
  });
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    try {
      login(form);
    } catch (err) {
      setError(err.message);
    }
  }

  function chooseAccount(account) {
    setForm({ email: account.email, password: account.password });
    setError("");
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-0">
      <div className="grid min-h-screen lg:grid-cols-[1.2fr_0.8fr]">

        {/* ── Left: Hero panel ── */}
        <div className="relative hidden overflow-hidden bg-slate-900 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          {/* Subtle accent glow — tipis, tidak mengganggu */}
          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 rounded-full bg-teal-600/10 blur-3xl" />

          {/* Logo */}
          <div className="relative flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-teal-600 text-white">
              <Stethoscope size={20} />
            </div>
            <div>
              <p className="font-semibold text-white">SIMAMI-RS</p>
              <p className="text-xs text-slate-400">Permata Medika Asset Suite</p>
            </div>
          </div>

          {/* Hero text */}
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-teal-600/20 px-2.5 py-1 text-xs font-semibold uppercase tracking-widest text-teal-300 ring-1 ring-teal-500/30">
              Health-Tech Platform
            </span>
            <h1 className="mt-6 max-w-lg text-4xl font-semibold leading-tight tracking-tight text-white">
              Kelola alat medis dengan sistem inventaris yang modern dan efisien.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-400">
              Portal admin, petugas, dan teknisi dipisah rapi. Peminjaman, approval, QR scan, mutasi, dan maintenance dalam satu sistem.
            </p>
          </div>

          {/* Bottom feature cards */}
          <div className="relative grid grid-cols-3 gap-3">
            {[
              { value: "Admin", label: "Aset & approval", Icon: BadgeCheck },
              { value: "Petugas", label: "Pinjam alat", Icon: QrCode },
              { value: "Teknisi", label: "Maintenance", Icon: Boxes }
            ].map(({ value, label, Icon }) => (
              <div key={label} className="rounded-lg border border-slate-700 bg-slate-800 p-4">
                <Icon className="mb-3 text-teal-400" size={18} />
                <p className="font-semibold text-white">{value}</p>
                <p className="mt-0.5 text-xs text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Login form ── */}
        <div className="flex items-center justify-center p-6 md:p-10">
          <form onSubmit={handleSubmit} className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="mb-6 flex items-center gap-2.5 lg:hidden">
              <div className="grid h-9 w-9 place-items-center rounded-md bg-teal-600 text-white">
                <Stethoscope size={18} />
              </div>
              <div>
                <p className="font-semibold text-slate-900">SIMAMI-RS</p>
                <p className="text-xs text-slate-500">RS Permata Medika</p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-md bg-teal-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-widest text-teal-700 ring-1 ring-teal-200">
              <Activity size={12} /> Role-Based Login
            </span>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">Masuk Portal</h2>
            <p className="mt-1 text-sm text-slate-500">Pilih akun demo. Setiap role langsung masuk ke tampilan yang berbeda.</p>

            {/* Quick account selector */}
            <div className="mt-5 grid gap-2">
              {quickAccounts.map((account) => {
                const Icon = account.icon;
                const active = form.email === account.email;
                return (
                  <button
                    key={account.email}
                    type="button"
                    onClick={() => chooseAccount(account)}
                    className={`flex items-center gap-3 rounded-lg border p-3.5 text-left transition ${
                      active
                        ? "border-teal-300 bg-teal-50"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className={`grid h-10 w-10 place-items-center rounded-md transition ${
                      active ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-500"
                    }`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{account.role}</p>
                      <p className="text-xs text-slate-500">{account.note}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {error && (
              <div className="mt-4 rounded-md bg-rose-50 p-3 text-sm text-rose-700 ring-1 ring-rose-200">
                {error}
              </div>
            )}

            {/* Email + Password */}
            <div className="mt-5 space-y-3">
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-slate-900">Email</span>
                <input
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-slate-900">Password</span>
                <input
                  type="password"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </label>
              <button className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-teal-700">
                Masuk ke Portal <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Activity, ArrowRight, BadgeCheck, Boxes, QrCode, Sparkles, Stethoscope, UserCog, UserRound, Wrench } from "lucide-react";
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
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#bbf7d0,transparent_34%),radial-gradient(circle_at_top_right,#bfdbfe,transparent_30%),linear-gradient(135deg,#f8fafc,#ecfeff)] p-4">
      <div className="grid min-h-[calc(100vh-2rem)] overflow-hidden rounded-[2.2rem] border border-white/80 bg-white/65 shadow-2xl backdrop-blur-2xl lg:grid-cols-[1.18fr_0.82fr]">
        <div className="premium-dark relative hidden overflow-hidden p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-24 -top-28 h-96 w-96 rounded-full bg-emerald-400/25 blur-3xl" />
          <div className="absolute bottom-4 left-8 h-80 w-80 rounded-full bg-cyan-300/15 blur-3xl" />
          <div className="absolute left-1/2 top-1/3 h-64 w-64 rounded-full bg-white/8 blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="grid h-14 w-14 place-items-center rounded-3xl bg-white/12 text-emerald-200 shadow-lg ring-1 ring-white/15 backdrop-blur">
                <Stethoscope />
              </div>
              <div>
                <p className="text-lg font-black">SIMAMI-RS</p>
                <p className="text-sm text-slate-300">Premium Hospital Asset Suite</p>
              </div>
            </div>

            <div className="mt-14 inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-100">
              <Sparkles size={14} /> Ultimate Premium Edition
            </div>

            <h1 className="mt-6 max-w-3xl text-6xl font-black leading-[0.98] tracking-tight">
              Kelola alat medis dengan rasa aplikasi enterprise kelas atas.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200/85">
              Portal admin, petugas, dan teknisi dipisah rapi. Peminjaman, approval, QR scan, mutasi, dan maintenance mengalir dalam satu pengalaman yang bersih, modern, dan tidak menyakiti mata.
            </p>
          </div>

          <div className="relative grid grid-cols-3 gap-4">
            {[
              ["Admin", "Aset & approval", BadgeCheck],
              ["Petugas", "Pinjam alat", QrCode],
              ["Teknisi", "Maintenance", Boxes]
            ].map(([value, label, Icon]) => (
              <div key={label} className="rounded-[1.7rem] border border-white/10 bg-white/10 p-5 shadow-lg backdrop-blur-xl">
                <Icon className="mb-5 text-emerald-200" />
                <p className="text-2xl font-black">{value}</p>
                <p className="text-sm text-slate-300">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center p-5 md:p-10">
          <form onSubmit={handleSubmit} className="w-full max-w-md rounded-[2rem] border border-white/80 bg-white/75 p-5 shadow-soft backdrop-blur-xl md:p-7">
            <div className="mb-6 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-600 text-white">
                  <Stethoscope />
                </div>
                <div><p className="font-black">SIMAMI-RS</p><p className="text-sm text-slate-500">RS Permata Medika</p></div>
              </div>
            </div>

            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-700 ring-1 ring-emerald-200">
              <Activity size={14} /> Role-Based Login
            </div>

            <h2 className="text-4xl font-black tracking-tight text-slate-950">Masuk Portal</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Pilih akun demo. Setiap role langsung masuk ke tampilan yang berbeda.</p>

            <div className="mt-6 grid gap-3">
              {quickAccounts.map((account) => {
                const Icon = account.icon;
                const active = form.email === account.email;
                return (
                  <button
                    key={account.email}
                    type="button"
                    onClick={() => chooseAccount(account)}
                    className={`group flex items-center gap-3 rounded-[1.4rem] border p-4 text-left transition duration-300 ${
                      active ? "border-emerald-300 bg-emerald-50 shadow-lg shadow-emerald-100" : "border-slate-200 bg-white/80 hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
                    }`}
                  >
                    <div className={`grid h-12 w-12 place-items-center rounded-2xl transition ${active ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-200" : "bg-slate-100 text-slate-600 group-hover:bg-slate-950 group-hover:text-white"}`}>
                      <Icon size={21} />
                    </div>
                    <div>
                      <p className="font-black text-slate-950">{account.role}</p>
                      <p className="text-xs leading-5 text-slate-500">{account.note}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {error && <div className="mt-5 rounded-2xl bg-rose-50 p-4 text-sm font-semibold text-rose-700 ring-1 ring-rose-100">{error}</div>}

            <div className="mt-6 space-y-4">
              <label className="block space-y-2">
                <span className="text-sm font-bold text-slate-700">Email</span>
                <input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-bold text-slate-700">Password</span>
                <input type="password" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
              </label>
              <button className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-black text-white shadow-xl shadow-slate-200 transition hover:-translate-y-0.5 hover:bg-emerald-700">
                Masuk ke Portal <ArrowRight className="transition group-hover:translate-x-1" size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

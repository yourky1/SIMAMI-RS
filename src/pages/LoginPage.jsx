import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import permataImage from '../assets/permata.jpg';
import logoImage from '../assets/logo.jpg';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = login(form.email, form.password);
    setLoading(false);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  const quickLogin = (u) => {
    setForm({ email: u.email, password: u.password });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left panel */}
      <div
        className="hidden lg:flex lg:w-2/5 relative flex-col justify-between p-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${permataImage})`,
        }}
      >
        <div className="absolute inset-0 bg-slate-950/60" />
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg overflow-hidden border border-white/20">
              <img src={logoImage} alt="SIMAMI-RS" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-white font-bold text-base">SIMAMI-RS</p>
              <p className="text-slate-200 text-xs">Permata Medika</p>
            </div>
          </div>
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white leading-snug">
            Sistem Informasi<br />Manajemen Aset &<br />Inventaris Alat Medis
          </h2>
          <p className="text-slate-200 mt-4 text-sm leading-relaxed max-w-xs">
            Lacak, kelola, dan pantau seluruh aset medis rumah sakit secara real-time — dari tabung oksigen hingga defibrilator.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { label: 'Total Aset Terdaftar', value: '12' },
              { label: 'Unit Terpantau', value: '8' },
              { label: 'Mutasi Bulan Ini', value: '5' },
              { label: 'Jadwal Maintenance', value: '3' },
            ].map(s => (
              <div key={s.label} className="bg-white/10 rounded-xl p-4">
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-slate-200 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="relative z-10 text-slate-200 text-xs">© 2026 RS Permata Medika. v1.0.0</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200">
              <img src={logoImage} alt="SIMAMI-RS" className="w-full h-full object-cover" />
            </div>
            <p className="font-bold text-slate-800">SIMAMI-RS</p>
          </div>

          <h1 className="text-2xl font-bold text-slate-800">Masuk ke Sistem</h1>
          <p className="text-slate-500 text-sm mt-1">Masukkan email dan password Anda untuk melanjutkan.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="nama@permatamedika.co.id"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input-field pr-10"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-lg px-3 py-2.5 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Memverifikasi...
                </span>
              ) : 'Masuk'}
            </button>
          </form>

          {/* Quick login demo */}
          <div className="mt-6 border border-slate-200 rounded-lg overflow-hidden">
            <p className="px-3 py-2 text-xs font-semibold text-slate-500 bg-slate-50 border-b border-slate-200 uppercase tracking-wide">Demo Akun</p>
            {DEMO_USERS.map(u => (
              <button
                key={u.id}
                onClick={() => quickLogin(u)}
                className="w-full text-left px-3 py-2.5 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{u.nama}</p>
                    <p className="text-xs text-slate-400">{u.email}</p>
                  </div>
                  <span className="text-xs text-primary-600 font-medium">Pilih</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

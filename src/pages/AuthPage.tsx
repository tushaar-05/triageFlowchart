import React, { useState } from 'react';

interface AuthPageProps {
  onLoginSuccess?: () => void;
}

// ─── Brand Panel ────────────────────────────────────────────────────────────
const BrandPanel: React.FC = () => {
  return (
    <div className="relative h-full min-h-screen bg-[#0F1C14] flex flex-col overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-[0.07]" style={{
        backgroundImage: `
          linear-gradient(to right, #10B981 1px, transparent 1px),
          linear-gradient(to bottom, #10B981 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px'
      }} />

      {/* Glow blobs */}
      <div className="absolute top-[20%] left-[10%] w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="absolute bottom-[20%] right-[10%] w-64 h-64 rounded-full bg-cyan-500/8 blur-3xl" />

      {/* Pulse line top decoration */}
      <div className="absolute top-0 left-0 right-0 text-emerald-400 opacity-20">
        <svg className="w-full h-16" viewBox="0 0 600 60" preserveAspectRatio="none">
          <path
            d="M0,30 L150,30 L165,15 L180,45 L195,30 L210,30 L225,10 L240,50 L255,30 L600,30"
            stroke="currentColor" strokeWidth="1.5" fill="none"
            className="animate-pulse-draw"
          />
        </svg>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col h-full min-h-screen px-10 py-12">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-emerald-500 flex items-center justify-center transform rotate-45 shadow-lg shadow-emerald-500/30">
              <div className="transform -rotate-45 font-bold text-white text-xl leading-none">+</div>
            </div>
            <div className="absolute inset-0 rounded-xl bg-emerald-500 blur-xl opacity-30" />
          </div>
          <div>
            <span className="font-display text-2xl text-white tracking-tight">TriageFlow</span>
            <div className="font-mono text-[9px] text-emerald-400 tracking-widest mt-0.5">AI CLINICAL SUPPORT</div>
          </div>
        </div>

        {/* Center hero content */}
        <div className="flex-1 flex flex-col justify-center mt-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/8 mb-8 w-fit">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[10px] text-emerald-400 font-semibold tracking-wider">SYSTEM ONLINE</span>
          </div>

          <h1 className="font-display text-5xl xl:text-6xl text-white leading-[0.92] mb-6">
            Clinical<br />
            Intelligence<br />
            <span className="text-emerald-400">At the Edge</span>
          </h1>

          <div className="border-l-4 border-emerald-500 pl-5 relative mb-12" style={{ borderLeftColor: '#10B981' }}>
            <div className="absolute left-[-4px] top-0 h-[30%] w-1 bg-emerald-300" style={{ animation: 'scan 2s ease-in-out infinite' }} />
            <p className="text-slate-300 text-base leading-relaxed font-light">
              Deterministic triage protocols for frontline workers.
              100% offline. Zero guesswork.
            </p>
          </div>

          {/* Live stats */}
          <div className="space-y-3">
            {[
              { label: 'Active Sessions', value: '247', unit: 'clinics online' },
              { label: 'Patients Today', value: '1,842', unit: 'triaged globally' },
              { label: 'Protocol Accuracy', value: '97.3%', unit: 'completion rate' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/[0.07]">
                <span className="font-mono text-xs text-slate-500">{stat.label}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-emerald-400">{stat.value}</span>
                  <span className="font-mono text-[10px] text-slate-500">{stat.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mt-12 pt-6 border-t border-white/[0.08] flex items-center justify-between">
          <span className="font-mono text-[10px] text-slate-600 tracking-wider">© 2026 TRIAGEFLOW AI</span>
          <div className="flex items-center gap-4">
            {['Privacy', 'Terms', 'HIPAA'].map(link => (
              <a key={link} href="#" className="font-mono text-[10px] text-slate-600 hover:text-slate-400 transition-colors tracking-wider">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Login Card ─────────────────────────────────────────────────────────────
const LoginCard: React.FC<{ onLoginSuccess?: () => void }> = ({ onLoginSuccess }) => {
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'nurse'>('nurse');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAuth = async (isDemo: boolean, e: React.MouseEvent) => {
    e.preventDefault();
    if (!isDemo && (!staffId || !password)) {
      setErrorMsg('Please enter both ID and Password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    const idToUse = isDemo ? 'DEMO-ADMIN' : staffId;
    const passToUse = isDemo ? 'Demo@1234' : password;

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staff_id: idToUse, password: passToUse }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.message || 'Login failed.');
        return;
      }
      onLoginSuccess?.();
    } catch (err) {
      setErrorMsg('Failed to connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    { id: 'admin' as const, label: 'Admin', icon: '⚙' },
    { id: 'nurse' as const, label: 'Nurse', icon: '♥' },
  ];

  return (
    <div className="w-full max-w-[420px]">
      {/* Header */}
      <div className="mb-8">
        {/* Mobile-only logo */}
        <div className="flex items-center gap-2.5 mb-8 lg:hidden">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center transform rotate-45">
            <div className="transform -rotate-45 font-bold text-white text-base">+</div>
          </div>
          <span className="font-display text-xl text-[#0F1C14]">TriageFlow</span>
        </div>

        <div className="font-mono text-xs text-emerald-600 tracking-wider font-semibold mb-2">SECURE ACCESS PORTAL</div>
        <h2 className="font-display text-4xl text-[#0F1C14] leading-tight">
          Welcome<br />Back
        </h2>
        <p className="text-slate-400 text-sm mt-2 font-light mb-4">Sign in to access your clinical dashboard.</p>

        {/* Error Message */}
        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-start gap-2 mb-4">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {errorMsg}
          </div>
        )}
      </div>

      {/* Role selector */}
      <div className="mb-6">
        <label className="block font-mono text-[10px] text-slate-400 tracking-wider mb-2">ACCESS LEVEL</label>
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
          {roles.map(r => (
            <button
              key={r.id}
              onClick={() => setRole(r.id)}
              className={`py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${role === r.id
                ? 'bg-white text-[#0F1C14] shadow-sm border border-slate-200'
                : 'text-slate-400 hover:text-slate-600'
                }`}
            >
              <span className="mr-1.5 text-xs">{r.icon}</span>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-4 mb-6">
        {/* ID */}
        <div>
          <label className="block font-mono text-[10px] text-slate-400 tracking-wider mb-1.5">CLINICIAN ID</label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c0 1.306.835 2.417 2 2.83" />
              </svg>
            </div>
            <input
              type="text"
              value={staffId}
              onChange={e => setStaffId(e.target.value)}
              disabled={isLoading}
              placeholder="e.g. TF-2024-NRS-001"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-[#0F1C14] text-sm placeholder-slate-300 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10 transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="font-mono text-[10px] text-slate-400 tracking-wider">PASSWORD</label>
            <a href="#" className="font-mono text-[10px] text-emerald-600 hover:text-emerald-500 transition-colors tracking-wider">RESET?</a>
          </div>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={isLoading}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200 bg-white text-[#0F1C14] text-sm placeholder-slate-300 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10 transition-all"
            />
            <button
              onClick={() => setShowPassword(p => !p)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors cursor-pointer"
            >
              {showPassword ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Remember me */}
      <div className="flex items-center gap-2.5 mb-6">
        <div className="w-4 h-4 rounded border border-slate-200 bg-white flex items-center justify-center cursor-pointer hover:border-emerald-400 transition-colors">
          <div className="w-2 h-2 rounded-sm bg-emerald-500 opacity-0 hover:opacity-100" />
        </div>
        <span className="font-mono text-[10px] text-slate-400 tracking-wider">KEEP ME SIGNED IN FOR 12 HOURS</span>
      </div>

      {/* Submit */}
      <button
        onClick={(e) => handleAuth(false, e)}
        disabled={isLoading}
        className="group relative w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-300 text-white font-bold text-sm transition-all cursor-pointer shadow-lg shadow-emerald-500/20 overflow-hidden"
      >
        <span className={`relative z-10 flex items-center justify-center gap-2 transition-opacity ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
          Access Dashboard
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-slate-100" />
        <span className="font-mono text-[10px] text-slate-300 tracking-widest">OR</span>
        <div className="flex-1 h-px bg-slate-100" />
      </div>

      {/* SSO */}
      <button
        onClick={(e) => handleAuth(true, e)}
        disabled={isLoading}
        className="w-full py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-[#0F1C14] font-semibold text-sm transition-all cursor-pointer flex items-center justify-center gap-2.5 shadow-sm disabled:opacity-50"
      >
        <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        Start with Demo
      </button>

      {/* Footer */}
      <p className="text-center text-xs text-slate-400 mt-8 font-light">
        New facility?{' '}
        <a href="#" className="text-emerald-600 hover:text-emerald-500 font-semibold transition-colors">
          Request an admin account
        </a>
      </p>

      {/* Security badge */}
      <div className="flex items-center justify-center gap-2 mt-6 text-slate-300">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span className="font-mono text-[9px] tracking-wider">256-BIT ENCRYPTED · HIPAA COMPLIANT</span>
      </div>
    </div>
  );
};

// ─── Auth Page ───────────────────────────────────────────────────────────────
const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row" role="main">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');

        * { font-family: 'Outfit', -apple-system, sans-serif; }

        .font-display {
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .font-mono { font-family: 'IBM Plex Mono', monospace; }

        @keyframes pulse-draw {
          0%, 100% { stroke-dashoffset: 0; }
          50% { stroke-dashoffset: 600; }
        }

        .animate-pulse-draw {
          stroke-dasharray: 600;
          animation: pulse-draw 3s ease-in-out infinite;
        }

        @keyframes scan {
          0%, 100% { top: 0%; }
          50% { top: 70%; }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .animate-spin { animation: spin 0.8s linear infinite; }
      `}</style>

      {/* ── Left: Brand panel (hidden on mobile) ── */}
      <section className="hidden lg:flex lg:w-[46%] xl:w-[42%] flex-shrink-0" aria-label="TriageFlow AI branding">
        <BrandPanel />
      </section>

      {/* ── Right: Login area ── */}
      <section
        className="flex-1 flex items-center justify-center px-5 py-12 lg:py-16 bg-[#F5F7F2]"
        aria-label="Login form"
      >
        <LoginCard onLoginSuccess={onLoginSuccess} />
      </section>
    </div>
  );
};

export default AuthPage;
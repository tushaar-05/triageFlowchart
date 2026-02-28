import React, { useState } from 'react';
import FormInput from '../ui/FormInput';

import Button from '../ui/Button';


const StaffIdIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="4" width="18" height="16" rx="2" strokeWidth={1.75} />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
      d="M8 10h8M8 14h5" />
    <circle cx="6.5" cy="9" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2" strokeWidth={1.75} />
    <path strokeLinecap="round" strokeWidth={1.75} d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

// ─── LoginCard ────────────────────────────────────────────────────────────────

interface LoginCardProps {
  onLoginSuccess?: () => void;
}

const LoginCard: React.FC<LoginCardProps> = ({ onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffId || !password) {
      setErrorMsg('Please enter both Staff ID and Password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staff_id: staffId, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.message || 'Login failed.');
        return;
      }

      // Normally here you'd save the auth token or user context and redirect.
      // For now, we'll just show a success alert since UI is the focus.
      alert(`Login Successful!\nWelcome back, ${data.staff.name} (${data.staff.role})`);

    } catch (err) {
      setErrorMsg('Failed to connect to the server. Is it running?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Mobile logo */}
      <div className="flex lg:hidden items-center justify-center gap-2.5 mb-8">
        <div className="w-9 h-9 rounded-xl bg-[#1E3A8A] flex items-center justify-center">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C11.4 2 10.9 2.5 10.9 3.1V9H5C4.4 9 4 9.4 4 10v4c0 .6.4 1 1 1h5.9v5.9c0 .6.5 1.1 1.1 1.1h4c.6 0 1-.5 1-1.1V15H19c.6 0 1-.4 1-1v-4c0-.6-.4-1-1-1h-5.1V3.1c0-.6-.5-1.1-1.1-1.1h-1.8z" />
          </svg>
        </div>
        <div>
          <p className="font-bold text-[#1E3A8A] text-lg leading-tight">TriageFlow AI</p>
          <p className="text-slate-400 text-xs tracking-widest uppercase">Clinical Support</p>
        </div>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/80 border border-slate-100 p-8 sm:p-10">

        {/* Card header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded bg-teal-50 flex items-center justify-center">
              <svg className="w-3 h-3 text-teal-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2L4 5v6c0 5.25 3.4 10.15 8 11.35C16.6 21.15 20 16.25 20 11V5l-8-3zm-1 12l-3-3 1.4-1.4 1.6 1.6 4.6-4.6 1.4 1.4-6 6z" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-teal-700 uppercase tracking-widest">Secure Access</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-2 leading-tight">
            Healthcare Worker Login
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Secure access to TriageFlow AI
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleLogin}
          noValidate
          aria-label="Healthcare worker login form"
        >
          <div className="space-y-5">

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {errorMsg}
              </div>
            )}

            {/* Staff ID */}
            <FormInput
              id="auth-staff-id"
              label="Staff ID"
              type="text"
              placeholder="e.g. TF-00142"
              autoComplete="username"
              icon={<StaffIdIcon />}
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              disabled={isLoading}
            />

            {/* Password */}
            <FormInput
              id="auth-password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              autoComplete="current-password"
              icon={<LockIcon />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              rightElement={
                <button
                  type="button"
                  id="toggle-password-visibility"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="p-0.5 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A]/40 cursor-pointer text-slate-400 hover:text-slate-600 transition-colors"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              }
            />


            {/* Forgot password */}
            <div className="flex justify-end -mt-1">
              <button
                type="button"
                id="forgot-password-link"
                className="text-xs font-medium text-[#1E3A8A] hover:text-blue-800 underline underline-offset-2 cursor-pointer focus-visible:outline-[#1E3A8A] rounded transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Login button */}
            <Button
              id="login-submit-btn"
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              fullWidth
              leftIcon={<UserIcon />}
              onClick={(e) => {
                e.preventDefault();
                if (onLoginSuccess) onLoginSuccess();
              }}
            >
              {isLoading ? 'Signing in…' : 'Sign in to TriageFlow'}
            </Button>
          </div>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-7" role="separator" aria-hidden="true">
          <div className="flex-1 h-px bg-slate-100" />
          <span className="text-xs text-slate-400 font-medium select-none">or</span>
          <div className="flex-1 h-px bg-slate-100" />
        </div>

        {/* Guest / Demo Mode */}
        <Button
          id="guest-demo-btn"
          type="button"
          variant="outline"
          size="md"
          fullWidth
          leftIcon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          }
          onClick={onLoginSuccess}
        >
          Continue as Guest (Demo Mode)
        </Button>

        {/* Info note */}
        <p className="mt-5 text-center text-xs text-slate-400 leading-relaxed">
          Demo mode provides read-only access with sample patient data.
        </p>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-slate-400 mt-6" role="contentinfo">
        © {new Date().getFullYear()} TriageFlow AI · Built for frontline healthcare workers
      </p>
    </div>
  );
};

export default LoginCard;

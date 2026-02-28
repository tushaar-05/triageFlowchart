import React from 'react';
import BrandPanel from '../components/auth/BrandPanel';
import LoginCard from '../components/auth/LoginCard';

/**
 * AuthPage – Full-page authentication screen for TriageFlow AI.
 *
 * Layout:
 *  Desktop : Two-column split – Brand panel (left) | Login card (right)
 *  Mobile  : Single-column, login card centred
 *
 * No backend / auth / routing logic is included.
 */
const AuthPage: React.FC = () => {
  return (
    <div className="min-h-screen auth-bg flex flex-col lg:flex-row" role="main">

      {/* ── Left: Brand panel (hidden on mobile) ────────────────── */}
      <section
        className="lg:w-[46%] xl:w-[42%] flex-shrink-0"
        aria-label="TriageFlow AI branding"
      >
        <BrandPanel />
      </section>

      {/* ── Right: Login area ────────────────────────────────────── */}
      <section
        className="flex-1 flex items-center justify-center px-5 py-12 lg:py-16"
        aria-label="Login form"
      >
        <LoginCard />
      </section>
    </div>
  );
};

export default AuthPage;

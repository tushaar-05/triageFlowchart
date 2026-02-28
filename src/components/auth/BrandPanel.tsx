import React from 'react';

// ─── Icons ────────────────────────────────────────────────────────────────────

const CrossIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 2C11.4 2 10.9 2.5 10.9 3.1V9H5C4.4 9 4 9.4 4 10v4c0 .6.4 1 1 1h5.9v5.9c0 .6.5 1.1 1.1 1.1h4c.6 0 1-.5 1-1.1V15H19c.6 0 1-.4 1-1v-4c0-.6-.4-1-1-1h-5.1V3.1c0-.6-.5-1.1-1.1-1.1h-1.8z"
      fill="currentColor"
    />
  </svg>
);

const ShieldCheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 2L4 5v6c0 5.25 3.4 10.15 8 11.35C16.6 21.15 20 16.25 20 11V5l-8-3z"
      fill="currentColor"
      opacity={0.2}
    />
    <path
      d="M12 2L4 5v6c0 5.25 3.4 10.15 8 11.35C16.6 21.15 20 16.25 20 11V5l-8-3z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M9 12l2 2 4-4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HeartbeatIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 40 20" fill="none" aria-hidden="true">
    <polyline
      points="0,10 8,10 11,3 14,17 17,10 23,10 26,5 29,14 32,10 40,10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

// ─── Feature Badge ────────────────────────────────────────────────────────────

interface FeatureBadgeProps {
  icon: React.ReactNode;
  label: string;
  description: string;
}

const FeatureBadge: React.FC<FeatureBadgeProps> = ({ icon, label, description }) => (
  <div className="flex items-start gap-3">
    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white/90">
      {icon}
    </div>
    <div>
      <p className="text-white text-sm font-semibold">{label}</p>
      <p className="text-white/60 text-xs leading-relaxed">{description}</p>
    </div>
  </div>
);

// ─── Brand Panel ─────────────────────────────────────────────────────────────

const BrandPanel: React.FC = () => {
  return (
    <div className="hidden lg:flex brand-panel flex-col justify-between px-12 py-14 text-white relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute top-1/2 -right-10 w-40 h-40 rounded-full bg-teal-400/10 pointer-events-none" />

      {/* Logo + Wordmark */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
            <CrossIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-xl leading-tight tracking-tight">TriageFlow AI</p>
            <p className="text-white/50 text-xs font-light tracking-widest uppercase">Clinical Decision Support</p>
          </div>
        </div>

        {/* Hero copy */}
        <h1 className="text-4xl font-bold leading-snug tracking-tight text-white mb-4">
          AI-Assisted Triage<br />
          <span className="text-teal-300">for Rural Clinics</span>
        </h1>
        <p className="text-white/65 text-sm leading-relaxed max-w-xs">
          An offline-first clinical decision support system built for nurses, community health workers, and paramedics in resource-limited settings.
        </p>
      </div>

      {/* Heartbeat illustration */}
      <div className="relative z-10 my-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span className="text-white/50 text-xs font-medium tracking-wider uppercase">System Active</span>
        </div>
        <HeartbeatIcon className="w-full text-teal-400 opacity-70" />
        <div className="h-px bg-white/10 mt-3" />
      </div>

      {/* Feature list */}
      <div className="relative z-10 space-y-5">
        <FeatureBadge
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          label="Offline-First Architecture"
          description="Works without internet in remote and low-connectivity environments"
        />
        <FeatureBadge
          icon={<ShieldCheckIcon className="w-4 h-4" />}
          label="HIPAA-Aligned Security"
          description="Role-based access with end-to-end data protection"
        />
        <FeatureBadge
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
            </svg>
          }
          label="Intelligent Triage Engine"
          description="AI-driven symptom assessment supporting clinical decisions"
        />
      </div>

      {/* Bottom version badge */}
      <div className="relative z-10 mt-10">
        <span className="text-white/30 text-xs">Version 1.0.0 · Build 2026.02</span>
      </div>
    </div>
  );
};

export default BrandPanel;

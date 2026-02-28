import React from 'react';

interface LandingPageProps {
    onLoginClick: () => void;
}

// ─── Shared Icons ─────────────────────────────────────────────────────────────
const CloudOffIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ShieldCheckIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M12 2L4 5v6c0 5.25 3.4 10.15 8 11.35C16.6 21.15 20 16.25 20 11V5l-8-3z" strokeWidth="1.5" fill="none" />
        <path d="M9 12l2 2 4-4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const HeartbeatIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
);

const FlowchartIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
    </svg>
);

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
    return (
        <div className="font-sans text-slate-900 bg-white">
            {/* ── Navbar ── */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#1E3A8A] flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C11.4 2 10.9 2.5 10.9 3.1V9H5C4.4 9 4 9.4 4 10v4c0 .6.4 1 1 1h5.9v5.9c0 .6.5 1.1 1.1 1.1h4c.6 0 1-.5 1-1.1V15H19c.6 0 1-.4 1-1v-4c0-.6-.4-1-1-1h-5.1V3.1c0-.6-.5-1.1-1.1-1.1h-1.8z" />
                            </svg>
                        </div>
                        <span className="font-bold text-[#1E3A8A] text-lg tracking-tight">TriageFlow</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="hidden sm:block text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                            Request Demo
                        </button>
                        <button
                            onClick={onLoginClick}
                            className="text-sm font-medium border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── Hero Section ── */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden brand-panel">
                {/* Decorative elements matching login page */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-teal-400/10 blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/4" />

                <div className="relative max-w-7xl mx-auto px-5 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-teal-300 text-xs font-semibold mb-8 backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                        V1.0 LIVE: CLINICAL DECISION SUPPORT
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight max-w-4xl mx-auto">
                        Standardize Every Patient Assessment. <br />
                        <span className="text-teal-400">Even When You're Offline.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Empower your nurses and community health workers with AI-assisted clinical decision support. No doctors on-site? No internet connection? No problem.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-semibold text-base transition-colors shadow-lg shadow-teal-500/20 cursor-pointer">
                            Build Your First Protocol
                        </button>
                        <button className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-base backdrop-blur-sm transition-colors border border-white/10 cursor-pointer">
                            Try Interactive Demo
                        </button>
                    </div>

                    <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-white/50 font-medium">
                        <div className="flex items-center gap-2"><ShieldCheckIcon /> HIPAA-aligned</div>
                        <div className="flex items-center gap-2"><CloudOffIcon /> Works 100% offline</div>
                        <div className="flex items-center gap-2"><HeartbeatIcon /> Built for rural care networks</div>
                    </div>
                </div>
            </section>

            {/* ── Problem Section ── */}
            <section className="py-24 bg-white relative">
                <div className="max-w-4xl mx-auto px-5 text-center">
                    <p className="text-teal-600 font-bold uppercase tracking-widest text-sm mb-4">The Frontline Challenge</p>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                        Triage shouldn't rely on guesswork in under-resourced clinics.
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
                        When clinics are overcrowded and specialist doctors are miles away, frontline workers face immense pressure. Inconsistent questions lead to mis-triaged patients, increased liability, and delayed critical care. TriageFlow bridges this gap with deterministic workflows that standardize intake.
                    </p>
                </div>
            </section>

            {/* ── Solution Section: Deterministic Flows ── */}
            <section className="py-24 bg-slate-50 border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-5">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <p className="text-[#1E3A8A] font-bold uppercase tracking-widest text-sm mb-4">Deterministic Triage Flows</p>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                                You Define the Rules. <br />AI Streamlines the Flow.
                            </h2>
                            <p className="text-slate-600 mb-8 leading-relaxed text-lg">
                                TriageFlow AI isn't an unpredictable chatbot. It's a structured, deterministic decision tree that <em>you</em> control. Use our visual builder to create symptom pathways. The system intelligently classifies chief complaints and guides your nurses node-by-node to an accurate risk assessment.
                            </p>

                            <ul className="space-y-4 mb-8">
                                {[
                                    'Drag-and-drop clinical protocol builder',
                                    'Custom risk scoring and urgency thresholds',
                                    'Offline local AI text classification'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="text-slate-700 font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <button className="text-teal-600 font-semibold hover:text-teal-700 flex items-center gap-2 transition-colors cursor-pointer group">
                                See how the Builder works
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </div>

                        {/* Mockup visual */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#1E3A8A]/5 to-teal-400/5 rounded-3xl transform translate-x-4 translate-y-4" />
                            <div className="relative bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden">
                                <div className="h-12 bg-slate-50 border-b border-slate-100 flex items-center px-4 gap-2">
                                    <div className="w-3 h-3 rounded-full bg-rose-400" />
                                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                                    <div className="ml-4 px-3 py-1 bg-white rounded-md text-xs text-slate-400 font-mono border border-slate-200">Builder Mode</div>
                                </div>
                                <div className="p-6">
                                    {/* Mock node UI */}
                                    <div className="w-full h-48 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center flex-col gap-3 bg-slate-50/50">
                                        <div className="w-40 p-3 bg-white border border-slate-200 rounded-lg shadow-sm text-center">
                                            <p className="text-xs font-semibold text-slate-700">Chest Pain Protocol</p>
                                            <p className="text-[10px] text-slate-400 mt-1">Start Node</p>
                                        </div>
                                        <div className="w-px h-8 bg-slate-300" />
                                        <div className="w-48 p-3 bg-white border border-slate-200 rounded-lg shadow-sm text-center border-l-4 border-l-rose-500">
                                            <p className="text-xs font-semibold text-slate-700">Is pain radiating to arm?</p>
                                            <p className="text-[10px] text-slate-400 mt-1">Yes / No Input</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Core Benefits Grid ── */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-5">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Engineered for the Edge of Care.</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">Built from the ground up to solve the technical and clinical hurdles of rural medicine.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="p-8 rounded-2xl bg-[#F8FAFC] border border-slate-100 hover:shadow-lg hover:shadow-slate-200 transition-shadow">
                            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center mb-6">
                                <CloudOffIcon />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">True Offline Architecture</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Built on local SQLite and Ollama. When the internet goes down in your rural clinic, your patient triage doesn't stop. Syncs instantly when connection returns.
                            </p>
                        </div>
                        {/* Card 2 */}
                        <div className="p-8 rounded-2xl bg-[#F8FAFC] border border-slate-100 hover:shadow-lg hover:shadow-slate-200 transition-shadow">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                                <ShieldCheckIcon />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">HIPAA-Aligned Security</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Role-based access controls for Nurses, Paramedics, and Admins. Encrypted local storage ensures patient data never leaves the device without authorization.
                            </p>
                        </div>
                        {/* Card 3 */}
                        <div className="p-8 rounded-2xl bg-[#F8FAFC] border border-slate-100 hover:shadow-lg hover:shadow-slate-200 transition-shadow">
                            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6">
                                <FlowchartIcon />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Accelerated Intake</h3>
                            <p className="text-slate-600 leading-relaxed">
                                The Intelligent Engine helps select the next most relevant protocol based on chief complaint, cutting triage time while capturing standardized data.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA / Footer ── */}
            <section className="brand-panel text-white py-24 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl opacity-10 pointer-events-none">
                    <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
                        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" fill="none" />
                        <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="2" fill="none" />
                        <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                </div>

                <div className="relative max-w-3xl mx-auto px-5 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
                        Ready to standardize your clinic's triage?
                    </h2>
                    <p className="text-lg text-white/70 mb-10 leading-relaxed max-w-xl mx-auto">
                        Deploy offline-first protocols to your medical team today. Set up takes less than 15 minutes.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={onLoginClick}
                            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-[#1E3A8A] font-bold text-base hover:bg-slate-100 transition-colors cursor-pointer shadow-xl shadow-white/10"
                        >
                            Create Admin Account
                        </button>
                        <button className="w-full sm:w-auto px-8 py-4 rounded-xl border border-teal-400 text-teal-300 font-semibold text-base hover:bg-teal-400/10 transition-colors cursor-pointer">
                            Contact Sales for NGOs
                        </button>
                    </div>
                    <p className="mt-8 text-sm text-white/40">
                        No credit card required • Includes 3 pre-built WHO-standard protocols
                    </p>
                </div>
            </section>

            <footer className="bg-[#142966] py-8 text-center text-white/30 text-sm">
                <div className="max-w-7xl mx-auto px-5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p>© {new Date().getFullYear()} TriageFlow AI. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="hover:text-white/60 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white/60 transition-colors">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;

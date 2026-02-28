import React, { useState, useEffect } from 'react';

interface LandingPageProps {
    onLoginClick: () => void;
}

// Animated pulse line component
const PulseLine = () => {
    return (
        <svg className="w-full h-24 opacity-30" viewBox="0 0 800 100" preserveAspectRatio="none">
            <path
                d="M0,50 L200,50 L220,30 L240,70 L260,50 L280,50 L300,20 L320,80 L340,50 L800,50"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="animate-pulse-draw"
            />
        </svg>
    );
};

// Animated grid background
const ClinicalGrid = () => {
    return (
        <div className="absolute inset-0 overflow-hidden opacity-[0.06]">
            <div className="absolute inset-0" style={{
                backgroundImage: `
                    linear-gradient(to right, #10B981 1px, transparent 1px),
                    linear-gradient(to bottom, #10B981 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
            }} />
        </div>
    );
};

// Vital signs monitor mockup
const VitalSignsMockup = () => {
    const [reading, setReading] = useState(98);

    useEffect(() => {
        const interval = setInterval(() => {
            setReading(() => 95 + Math.random() * 6);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="font-mono text-sm space-y-1 text-emerald-600">
            <div className="flex justify-between">
                <span className="text-slate-400">HR</span>
                <span className="font-bold animate-pulse">{Math.round(reading)} bpm</span>
            </div>
            <div className="flex justify-between">
                <span className="text-slate-400">SpO₂</span>
                <span className="font-bold">{Math.round(reading)}%</span>
            </div>
            <div className="flex justify-between">
                <span className="text-slate-400">BP</span>
                <span className="font-bold">120/80</span>
            </div>
        </div>
    );
};

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="font-sans bg-[#F5F7F2] text-[#0F1C14] overflow-x-hidden">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
                
                * {
                    font-family: 'Outfit', -apple-system, sans-serif;
                }
                
                .font-display {
                    font-family: 'Outfit', sans-serif;
                    font-weight: 800;
                    letter-spacing: -0.03em;
                }
                
                .font-mono {
                    font-family: 'IBM Plex Mono', monospace;
                }
                
                @keyframes pulse-draw {
                    0%, 100% { stroke-dashoffset: 0; }
                    50% { stroke-dashoffset: 800; }
                }
                
                .animate-pulse-draw {
                    stroke-dasharray: 800;
                    animation: pulse-draw 3s ease-in-out infinite;
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                
                @keyframes slide-in {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-slide-in {
                    animation: slide-in 0.8s ease-out forwards;
                }
                
                .clinical-border {
                    border-left: 4px solid #10B981;
                    position: relative;
                }
                
                .clinical-border::before {
                    content: '';
                    position: absolute;
                    left: -4px;
                    top: 0;
                    height: 30%;
                    width: 4px;
                    background: #34D399;
                    animation: scan 2s ease-in-out infinite;
                }
                
                @keyframes scan {
                    0%, 100% { top: 0%; }
                    50% { top: 70%; }
                }
                
                .stat-card {
                    background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.04) 100%);
                    border: 1px solid rgba(16, 185, 129, 0.25);
                }
                
                .hero-gradient {
                    background: 
                        radial-gradient(circle at 20% 30%, rgba(16, 185, 129, 0.12) 0%, transparent 50%),
                        radial-gradient(circle at 80% 70%, rgba(6, 182, 212, 0.08) 0%, transparent 50%),
                        #F5F7F2;
                }
                
                .text-glow {
                    text-shadow: 0 0 40px rgba(16, 185, 129, 0.2);
                }
                
                .glass-card {
                    background: rgba(255, 255, 255, 0.75);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(16, 185, 129, 0.15);
                    box-shadow: 0 4px 24px rgba(15, 28, 20, 0.06), 0 1px 4px rgba(15, 28, 20, 0.04);
                }

                .nav-glass {
                    background: rgba(245, 247, 242, 0.85);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(16, 185, 129, 0.15);
                    box-shadow: 0 4px 24px rgba(15, 28, 20, 0.06);
                }

                .problem-section {
                    background: #0F1C14;
                }

                .solution-section {
                    background: linear-gradient(135deg, #F0F4EE 0%, #EAF2EC 50%, #F0F4EE 100%);
                }

                .trust-section {
                    background: #FFFFFF;
                }

                .cta-section {
                    background: linear-gradient(135deg, #0F1C14 0%, #1A3022 50%, #0F1C14 100%);
                }

                .feature-card {
                    background: #FFFFFF;
                    border: 1px solid rgba(16, 185, 129, 0.12);
                    box-shadow: 0 2px 16px rgba(15, 28, 20, 0.06);
                    transition: all 0.4s ease;
                }

                .feature-card:hover {
                    border-color: rgba(16, 185, 129, 0.35);
                    box-shadow: 0 8px 40px rgba(16, 185, 129, 0.12);
                    transform: translateY(-8px);
                }
            `}</style>

            {/* Floating navbar */}
            <nav className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${scrollY > 100 ? 'w-[95%] max-w-7xl' : 'w-[90%] max-w-6xl'
                }`}>
                <div className="nav-glass rounded-2xl px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center transform rotate-45">
                                <div className="transform -rotate-45 font-bold text-white text-lg">+</div>
                            </div>
                            <div className="absolute inset-0 rounded-xl bg-emerald-500 blur-lg opacity-30" />
                        </div>
                        <div>
                            <span className="font-display text-xl text-[#0F1C14]">TriageFlow</span>
                            <div className="font-mono text-[10px] text-emerald-600 tracking-wider">AI CLINICAL SUPPORT</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="hidden md:block text-sm font-medium text-slate-500 hover:text-[#0F1C14] transition-colors">
                            Documentation
                        </button>
                        <button className="hidden md:block text-sm font-medium text-slate-500 hover:text-[#0F1C14] transition-colors">
                            Case Studies
                        </button>
                        <button
                            onClick={onLoginClick}
                            className="px-6 py-2.5 rounded-xl bg-[#0F1C14] hover:bg-emerald-800 text-white border border-transparent font-semibold text-sm transition-all cursor-pointer shadow-sm"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen pt-32 pb-20 hero-gradient overflow-hidden">
                <ClinicalGrid />

                {/* Decorative floating elements */}
                <div className="absolute top-40 right-[10%] w-64 h-64 rounded-full bg-emerald-400/15 blur-3xl animate-float" />
                <div className="absolute bottom-40 left-[15%] w-96 h-96 rounded-full bg-cyan-400/10 blur-3xl animate-float" style={{ animationDelay: '1s' }} />

                <div className="max-w-7xl mx-auto px-6 relative">
                    <div className="grid lg:grid-cols-12 gap-12 items-center">
                        {/* Left Column - Main Content */}
                        <div className="lg:col-span-7 space-y-8 animate-slide-in">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/40 bg-emerald-50">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="font-mono text-xs text-emerald-700 font-semibold tracking-wider">
                                    PROTOCOL ENGINE v1.0 ACTIVE
                                </span>
                            </div>

                            <h1 className="font-display text-7xl md:text-8xl leading-[0.9] text-[#0F1C14]">
                                Clinical<br />
                                Decisions<br />
                                <span className="text-emerald-500">Without<br />Guesswork</span>
                            </h1>

                            <div className="clinical-border pl-6 space-y-4">
                                <p className="text-xl text-slate-600 font-light leading-relaxed">
                                    AI-powered triage protocols for frontline workers in resource-limited settings.
                                </p>
                                <p className="text-lg text-slate-500 font-light leading-relaxed">
                                    No doctors nearby? No internet? No problem. Deploy deterministic clinical pathways that work 100% offline.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-4 pt-4">
                                <button className="group px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold transition-all cursor-pointer shadow-xl shadow-emerald-500/25 relative overflow-hidden">
                                    <span className="relative z-10">Start Building Protocols</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                                <button className="px-8 py-4 rounded-xl border border-slate-200 hover:border-emerald-300 bg-white hover:bg-emerald-50 text-[#0F1C14] font-semibold transition-all cursor-pointer shadow-sm">
                                    Watch 3min Demo
                                </button>
                            </div>

                            {/* Stats Bar */}
                            <div className="grid grid-cols-3 gap-4 pt-8">
                                <div className="stat-card rounded-xl p-4">
                                    <div className="font-mono text-3xl font-bold text-emerald-600">100%</div>
                                    <div className="text-xs text-slate-500 mt-1">Offline Ready</div>
                                </div>
                                <div className="stat-card rounded-xl p-4">
                                    <div className="font-mono text-3xl font-bold text-emerald-600">500+</div>
                                    <div className="text-xs text-slate-500 mt-1">Active Clinics</div>
                                </div>
                                <div className="stat-card rounded-xl p-4">
                                    <div className="font-mono text-3xl font-bold text-emerald-600">50K+</div>
                                    <div className="text-xs text-slate-500 mt-1">Patients Triaged</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Visual Element */}
                        <div className="lg:col-span-5 animate-slide-in" style={{ animationDelay: '0.2s' }}>
                            <div className="relative">
                                {/* Main mockup card */}
                                <div className="glass-card rounded-2xl p-6 space-y-6 transform hover:scale-[1.02] transition-transform duration-500">
                                    {/* Header */}
                                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                        <div>
                                            <div className="font-mono text-xs text-emerald-600">ACTIVE PROTOCOL</div>
                                            <div className="font-bold text-lg mt-1 text-[#0F1C14]">Chest Pain Assessment</div>
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-200">
                                            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                                        </div>
                                    </div>

                                    {/* Vital signs */}
                                    <VitalSignsMockup />

                                    {/* Decision tree preview */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                                            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">1</div>
                                            <span className="text-sm text-[#0F1C14]">Pain radiating to arm or jaw?</span>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200 opacity-70">
                                            <div className="w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">2</div>
                                            <span className="text-sm text-slate-600">Chest pressure lasting &gt; 5min?</span>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 opacity-40">
                                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 text-xs font-bold text-slate-500">3</div>
                                            <span className="text-sm text-slate-500">History of heart disease?</span>
                                        </div>
                                    </div>

                                    {/* Risk indicator */}
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                        <span className="font-mono text-xs text-slate-400">RISK ASSESSMENT</span>
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-16 bg-slate-200 rounded-full overflow-hidden">
                                                <div className="h-full w-3/4 bg-gradient-to-r from-yellow-400 to-red-400" />
                                            </div>
                                            <span className="font-mono text-sm font-bold text-amber-600">MODERATE</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating pulse line */}
                                <div className="absolute -top-8 -right-8 text-emerald-400 opacity-40">
                                    <PulseLine />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Problem Statement - Dark on Light */}
            <section className="relative py-32 problem-section overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
                </div>
                <ClinicalGrid />

                <div className="max-w-6xl mx-auto px-6 relative">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-6">
                            <div className="font-mono text-emerald-400 text-sm tracking-wider font-semibold">
                                THE CHALLENGE
                            </div>
                            <h2 className="font-display text-5xl leading-tight text-white">
                                Inconsistent Triage<br />
                                <span className="text-red-400">Costs Lives</span>
                            </h2>
                        </div>

                        <div className="clinical-border pl-8 space-y-4">
                            <p className="text-lg text-slate-300 leading-relaxed">
                                In overcrowded rural clinics without specialist doctors, frontline workers face impossible pressure. One missed question can delay critical care.
                            </p>
                            <p className="text-base text-slate-400 leading-relaxed">
                                Manual protocols lead to variability. Paper checklists get lost. Experience gaps create risk. TriageFlow eliminates these failure points with deterministic AI pathways.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Solution Section */}
            <section className="relative py-32 solution-section">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Section Header */}
                    <div className="text-center mb-20">
                        <div className="font-mono text-emerald-600 text-sm tracking-wider font-semibold mb-4">
                            HOW IT WORKS
                        </div>
                        <h2 className="font-display text-6xl leading-tight text-center max-w-4xl mx-auto text-[#0F1C14]">
                            Build Protocols.<br />
                            Deploy Offline.<br />
                            <span className="text-emerald-500">Save Lives.</span>
                        </h2>
                    </div>

                    {/* Feature Cards Grid */}
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="feature-card rounded-2xl p-8">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 border border-emerald-200 group-hover:scale-110 transition-transform">
                                <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                                </svg>
                            </div>
                            <h3 className="font-display text-2xl mb-4 text-[#0F1C14]">Visual Protocol Builder</h3>
                            <p className="text-slate-500 leading-relaxed mb-4">
                                Drag-and-drop interface to create symptom pathways. No coding required. Build WHO-standard clinical decision trees in minutes.
                            </p>
                            <div className="font-mono text-xs text-emerald-600 tracking-wider font-semibold">
                                ADMIN ONLY
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="feature-card rounded-2xl p-8">
                            <div className="w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center mb-6 border border-cyan-200 transition-transform">
                                <svg className="w-8 h-8 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <h3 className="font-display text-2xl mb-4 text-[#0F1C14]">Intelligent Classification</h3>
                            <p className="text-slate-500 leading-relaxed mb-4">
                                Local AI analyzes chief complaints and automatically suggests relevant protocols. Reduces triage time by 60%.
                            </p>
                            <div className="font-mono text-xs text-cyan-600 tracking-wider font-semibold">
                                OLLAMA POWERED
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="feature-card rounded-2xl p-8">
                            <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mb-6 border border-purple-200 transition-transform">
                                <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="font-display text-2xl mb-4 text-[#0F1C14]">True Offline Mode</h3>
                            <p className="text-slate-500 leading-relaxed mb-4">
                                SQLite + local AI = zero internet dependency. Auto-syncs when connection returns. Patient data never leaves device.
                            </p>
                            <div className="font-mono text-xs text-purple-600 tracking-wider font-semibold">
                                HIPAA ALIGNED
                            </div>
                        </div>
                    </div>

                    {/* Technical Architecture Showcase */}
                    <div className="mt-20 bg-white rounded-2xl p-12 border border-slate-100 shadow-sm">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                                <h3 className="font-display text-4xl leading-tight text-[#0F1C14]">
                                    Built for the<br />
                                    <span className="text-emerald-500">Edge of Care</span>
                                </h3>
                                <p className="text-slate-500 leading-relaxed">
                                    Every technical decision optimized for resource-limited environments. From the database to the UI, designed for reliability when stakes are highest.
                                </p>
                                <ul className="space-y-3">
                                    {[
                                        'Role-based access (Admin/Nurse/Paramedic)',
                                        'Encrypted local storage with SQLite',
                                        'Conflict-free sync protocol',
                                        'Battery-optimized design',
                                        'Works on tablets and phones'
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-200">
                                                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className="text-slate-600">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="space-y-4">
                                {/* Tech stack display */}
                                <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                                    <div className="font-mono text-xs text-emerald-600 mb-4 tracking-wider font-semibold">TECHNOLOGY STACK</div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center p-4 rounded-lg bg-white border border-slate-100 shadow-sm">
                                            <div className="font-bold text-lg mb-1 text-[#0F1C14]">React</div>
                                            <div className="text-xs text-slate-400">Interface</div>
                                        </div>
                                        <div className="text-center p-4 rounded-lg bg-white border border-slate-100 shadow-sm">
                                            <div className="font-bold text-lg mb-1 text-[#0F1C14]">SQLite</div>
                                            <div className="text-xs text-slate-400">Database</div>
                                        </div>
                                        <div className="text-center p-4 rounded-lg bg-white border border-slate-100 shadow-sm">
                                            <div className="font-bold text-lg mb-1 text-[#0F1C14]">Ollama</div>
                                            <div className="text-xs text-slate-400">Local AI</div>
                                        </div>
                                        <div className="text-center p-4 rounded-lg bg-white border border-slate-100 shadow-sm">
                                            <div className="font-bold text-lg mb-1 text-[#0F1C14]">Electron</div>
                                            <div className="text-xs text-slate-400">Desktop</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof / Trust Section */}
            <section className="py-24 trust-section">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="font-mono text-emerald-600 text-sm tracking-wider font-semibold mb-4">
                            DEPLOYED GLOBALLY
                        </div>
                        <h2 className="font-display text-5xl leading-tight text-[#0F1C14]">
                            Trusted in Remote Clinics<br />
                            <span className="text-emerald-500">Across 12 Countries</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">
                        <div className="stat-card rounded-xl p-6 text-center">
                            <div className="font-display text-5xl text-emerald-600 mb-2">97%</div>
                            <div className="text-sm text-slate-500">Protocol Completion Rate</div>
                        </div>
                        <div className="stat-card rounded-xl p-6 text-center">
                            <div className="font-display text-5xl text-emerald-600 mb-2">60%</div>
                            <div className="text-sm text-slate-500">Faster Triage Time</div>
                        </div>
                        <div className="stat-card rounded-xl p-6 text-center">
                            <div className="font-display text-5xl text-emerald-600 mb-2">0</div>
                            <div className="text-sm text-slate-500">Internet Required</div>
                        </div>
                        <div className="stat-card rounded-xl p-6 text-center">
                            <div className="font-display text-5xl text-emerald-600 mb-2">24/7</div>
                            <div className="text-sm text-slate-500">Uptime Guarantee</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA - Dark on Light contrast */}
            <section className="relative py-32 overflow-hidden cta-section">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-transparent to-cyan-900/20" />
                <ClinicalGrid />

                <div className="relative max-w-5xl mx-auto px-6 text-center space-y-10">
                    <div>
                        <h2 className="font-display text-6xl md:text-7xl leading-tight text-white text-glow mb-6">
                            Deploy Clinical<br />
                            Intelligence Today
                        </h2>
                        <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                            Join 500+ healthcare facilities using TriageFlow to standardize patient assessment and reduce diagnostic errors.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <button
                            onClick={onLoginClick}
                            className="group relative px-10 py-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-lg transition-all cursor-pointer shadow-2xl shadow-emerald-500/30 overflow-hidden"
                        >
                            <span className="relative z-10">Create Admin Account</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                        <button className="px-10 py-5 rounded-xl border border-white/20 hover:border-white/40 hover:bg-white/5 text-white backdrop-blur-sm font-bold text-lg transition-all cursor-pointer">
                            Schedule Demo Call
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400 font-mono">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400" />
                            No credit card required
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400" />
                            3 free protocols included
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400" />
                            30-day money back
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-200 bg-white py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-8 mb-12">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center transform rotate-45">
                                    <div className="transform -rotate-45 font-bold text-white text-lg">+</div>
                                </div>
                                <span className="font-display text-xl text-[#0F1C14]">TriageFlow</span>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Clinical decision support for under-resourced healthcare settings.
                            </p>
                        </div>

                        <div>
                            <div className="font-mono text-xs text-emerald-600 tracking-wider mb-4 font-semibold">PRODUCT</div>
                            <ul className="space-y-2 text-sm text-slate-500">
                                <li><a href="#" className="hover:text-[#0F1C14] transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-[#0F1C14] transition-colors">Protocols</a></li>
                                <li><a href="#" className="hover:text-[#0F1C14] transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-[#0F1C14] transition-colors">Roadmap</a></li>
                            </ul>
                        </div>

                        <div>
                            <div className="font-mono text-xs text-emerald-600 tracking-wider mb-4 font-semibold">RESOURCES</div>
                            <ul className="space-y-2 text-sm text-slate-500">
                                <li><a href="#" className="hover:text-[#0F1C14] transition-colors">Documentation</a></li>
                                <li><a href="#" className="hover:text-[#0F1C14] transition-colors">API Reference</a></li>
                                <li><a href="#" className="hover:text-[#0F1C14] transition-colors">Case Studies</a></li>
                                <li><a href="#" className="hover:text-[#0F1C14] transition-colors">Support</a></li>
                            </ul>
                        </div>

                        <div>
                            <div className="font-mono text-xs text-emerald-600 tracking-wider mb-4 font-semibold">COMPANY</div>
                            <ul className="space-y-2 text-sm text-slate-500">
                                <li><a href="#" className="hover:text-[#0F1C14] transition-colors">About</a></li>
                                <li><a href="#" className="hover:text-[#0F1C14] transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-[#0F1C14] transition-colors">Contact</a></li>
                                <li><a href="#" className="hover:text-[#0F1C14] transition-colors">Partners</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-slate-400">
                            © {new Date().getFullYear()} TriageFlow AI. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6 text-sm text-slate-400">
                            <a href="#" className="hover:text-[#0F1C14] transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-[#0F1C14] transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-[#0F1C14] transition-colors">HIPAA Compliance</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
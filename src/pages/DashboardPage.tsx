import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/auth');
    };

    return (
        <div className="min-h-screen bg-[#0B0F19] text-slate-200 font-sans selection:bg-indigo-500/30 overflow-hidden relative">

            {/* ── Background Glow Effects ── */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>
            <div className="absolute bottom-[-20%] right-[-5%] w-[500px] h-[500px] bg-teal-600/20 blur-[100px] rounded-full pointer-events-none mix-blend-screen"></div>

            <div className="relative z-10 flex min-h-screen">
                {/* ── Sidebar ── */}
                <aside className="w-20 md:w-64 bg-white/5 border-r border-white/10 flex flex-col pt-6 pb-6 backdrop-blur-md">
                    <div className="px-6 mb-12 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-teal-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <span className="font-bold text-lg text-white tracking-tight hidden md:block">TriageFlow<span className="text-indigo-400">AI</span></span>
                    </div>

                    <nav className="flex-1 px-3 space-y-2">
                        <button className="w-full flex items-center gap-3 px-3 py-3 bg-indigo-500/10 text-indigo-300 rounded-xl border border-indigo-500/20 transition-all group">
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                            <span className="font-semibold text-sm hidden md:block group-hover:text-white transition-colors">Command Center</span>
                        </button>
                    </nav>

                    <div className="p-4 mt-auto">
                        <div className="mb-6 px-3 hidden md:block">
                            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-teal-500/10 border border-white/5 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-teal-400/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                <h4 className="text-xs font-bold text-white mb-1 uppercase tracking-wider">System Status</h4>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                                    <span className="text-[10px] font-medium text-emerald-400 uppercase tracking-widest">A.I. Model Active</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="w-full flex items-center justify-center md:justify-start gap-3 px-3 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl font-medium text-sm transition-all">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            <span className="hidden md:block">Disconnect</span>
                        </button>
                    </div>
                </aside>

                {/* ── Main Content Area ── */}
                <main className="flex-1 p-6 md:p-12 lg:p-16 flex flex-col relative z-10 overflow-y-auto custom-scrollbar">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-16">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-4">
                                <span className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)]"></span>
                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Nurse Authentication Verified</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-2">
                                Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-teal-400">TriageFlow</span>
                            </h1>
                            <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
                                The next-generation interactive diagnostic matrix. Start a new context-aware triage session to instantly map out clinical decisions.
                            </p>
                        </div>

                        <div className="hidden lg:block text-right">
                            <div className="text-5xl font-black text-white/5 hover:text-white/10 transition-colors cursor-default tracking-tighter">
                                {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Bento Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {/* Primary Action Card */}
                        <div
                            onClick={() => navigate('/builder')}
                            className="col-span-1 md:col-span-2 relative group cursor-pointer overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/20 hover:border-indigo-400/50 transition-all duration-300 shadow-2xl hover:shadow-indigo-500/20"
                        >
                            <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[80px] rounded-full group-hover:bg-indigo-400/30 transition-colors duration-500"></div>

                            <div className="relative p-10 flex flex-col h-full justify-center">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center mb-6 text-indigo-400 group-hover:scale-110 group-hover:text-indigo-300 transition-all duration-300">
                                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-indigo-100 transition-colors">Launch State Matrix Canvas</h2>
                                <p className="text-slate-400 text-sm mb-8 max-w-md group-hover:text-slate-300 transition-colors leading-relaxed">
                                    Enter a chief complaint and let the AI generate a dynamically branching, optimized triage protocol based on millions of clinical data points.
                                </p>

                                <div className="mt-auto flex items-center gap-2 text-indigo-400 font-bold text-sm tracking-wide uppercase group-hover:gap-4 transition-all duration-300">
                                    Initialize Flow <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </div>
                            </div>
                        </div>

                        {/* Recent Session / Settings Card */}
                        <div className="col-span-1 rounded-3xl bg-white/5 border border-white/10 p-8 flex flex-col hover:bg-white/10 transition-colors duration-300 group relative overflow-hidden">
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-500/10 blur-[50px] rounded-full group-hover:bg-teal-400/20 transition-colors duration-500"></div>

                            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 text-slate-300">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Resume Session</h3>
                            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                                A local session state is detected in your browser cache. Jump right back into your active chart.
                            </p>

                            <button
                                onClick={() => navigate('/builder')}
                                className="mt-auto w-full py-3.5 rounded-xl bg-slate-800 text-white text-sm font-bold border border-slate-700 hover:border-teal-500/50 hover:bg-slate-700 transition-all shadow-inner hover:shadow-[0_0_15px_rgba(20,184,166,0.15)] focus:ring-2 focus:ring-teal-500/30 outline-none"
                            >
                                Open Current Matrix
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardPage;

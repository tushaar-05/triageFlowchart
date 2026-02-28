import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
    const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        // Here you would typically clear any auth state/tokens
        navigate('/auth');
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pt-16 pl-0 md:pl-64">

            {/* ── Header ── */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-20">
                <div className="font-semibold text-lg text-slate-800 tracking-tight">
                    TriageFlow AI
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                        <span className="text-xs font-medium text-slate-500 tracking-wide uppercase">Offline</span>
                    </div>
                    <div className="hidden sm:block w-px h-4 bg-slate-200"></div>
                    <div className="px-2.5 py-1 bg-slate-100 rounded-md">
                        <span className="text-xs font-semibold text-slate-600 uppercase tracking-widest">Nurse Mode</span>
                    </div>
                </div>
            </header>

            {/* ── Sidebar ── */}
            <aside className="fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-slate-200 hidden md:flex flex-col pt-8 z-10">
                <nav className="flex-1 px-4 space-y-2">
                    {/* Active Menu Item */}
                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 bg-teal-50 text-teal-700 rounded-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="font-medium text-sm">Dashboard</span>
                    </a>
                    {/* Inactive Menu Items */}
                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span className="font-medium text-sm">Patients</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                        <span className="font-medium text-sm">Clinical Logs</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="font-medium text-sm">Settings</span>
                    </a>
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 mt-auto border-t border-slate-200">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium text-sm"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>

            {/* ── Main Content Area ── */}
            <main className="p-8 md:p-12 lg:p-16 max-w-5xl mx-auto flex flex-col h-full min-h-[calc(100vh-4rem)]">

                {/* Top Section */}
                <div className="mb-16 text-center md:text-left mt-4 md:mt-8">
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Welcome, Nurse</h1>
                    <p className="text-slate-500 mt-2 text-base max-w-lg mx-auto md:mx-0">
                        Ready to triage new patients. Start a new triage flow to begin generating protocols.
                    </p>
                </div>

                {/* Center Section: Primary Action */}
                <div className="flex justify-center md:justify-start mb-20">
                    <button
                        onClick={() => setIsAddPatientModalOpen(true)}
                        className="group flex items-center justify-center gap-3 bg-teal-600 text-white px-8 py-4 w-full sm:w-auto rounded-xl font-semibold text-lg shadow-md hover:bg-teal-700 transition-all focus:outline-none focus:ring-4 focus:ring-teal-600/30 active:scale-[0.98]"
                    >
                        <svg className="w-6 h-6 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Patient
                    </button>
                </div>

                {/* Bottom Section: Recent Cases */}
                <div className="max-w-2xl w-full mx-auto md:mx-0 mt-auto pb-12">
                    <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Recent Cases</h2>

                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                        <ul className="divide-y divide-slate-100">

                            {/* Case Item 1 */}
                            <li className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-medium text-sm">
                                        JD
                                    </div>
                                    <span className="font-medium text-sm text-slate-800">John Doe</span>
                                </div>
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-rose-50 text-rose-700 border border-rose-100">
                                    High Risk
                                </span>
                            </li>

                            {/* Case Item 2 */}
                            <li className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-medium text-sm">
                                        MS
                                    </div>
                                    <span className="font-medium text-sm text-slate-800">Maria Smith</span>
                                </div>
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                                    Medium Risk
                                </span>
                            </li>

                            {/* Case Item 3 */}
                            <li className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-medium text-sm">
                                        RJ
                                    </div>
                                    <span className="font-medium text-sm text-slate-800">Robert Jones</span>
                                </div>
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                                    Low Risk
                                </span>
                            </li>

                        </ul>
                    </div>
                </div>

            </main>

            {/* ── Add Patient Modal ── */}
            {isAddPatientModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsAddPatientModalOpen(false)}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 tracking-tight">Add New Patient</h3>
                                <p className="text-sm text-slate-500 mt-1">Enter patient details to begin triage</p>
                            </div>
                            <button
                                onClick={() => setIsAddPatientModalOpen(false)}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors outline-none focus:ring-2 focus:ring-slate-200"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body (Form) */}
                        <div className="p-6 space-y-5 flex-1 overflow-y-auto">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Patient Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none transition-all text-slate-800"
                                    placeholder="Enter full name"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Age</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none transition-all text-slate-800"
                                        placeholder="e.g. 45"
                                    />
                                </div>
                                <div className="relative">
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Gender</label>
                                    <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none transition-all text-slate-800 appearance-none">
                                        <option value="">Select gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                    {/* Select Icon */}
                                    <div className="absolute top-[34px] right-3 pointer-events-none text-slate-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Chief Complaint</label>
                                <textarea
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none transition-all text-slate-800 min-h-[100px] resize-none"
                                    placeholder="Briefly describe the main reason for the visit..."
                                ></textarea>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 rounded-b-2xl">
                            <button
                                onClick={() => setIsAddPatientModalOpen(false)}
                                className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
                            >
                                Cancel
                            </button>
                            <button
                                className="px-5 py-2.5 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 shadow-sm transition-colors focus:outline-none focus:ring-4 focus:ring-teal-600/30 active:scale-[0.98]"
                            >
                                Start Triage
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;


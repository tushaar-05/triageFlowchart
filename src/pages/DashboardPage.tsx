import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';

const DashboardPage: React.FC = () => {
    const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    // Form State
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [complaint, setComplaint] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const navigate = useNavigate();

    // Listen to network status
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Fetch offline-synced patients directly from IndexedDB
    const recentPatients = useLiveQuery(
        () => db.patients.orderBy('created_at').reverse().limit(5).toArray()
    );

    const handleLogout = () => {
        navigate('/auth');
    };

    const handleStartTriage = async () => {
        if (!name || !age || !gender || !complaint) {
            alert("Please fill out all fields (Name, Age, Gender, Chief Complaint) to start triage.");
            return;
        }
        setIsSaving(true);

        try {
            // 1. Instantly save to local offline DB (IndexedDB)
            await db.patients.add({
                staff_id: 'DEMO-ADMIN',
                name,
                age: Number(age),
                gender,
                phone: '',
                address: '',
                chief_complaint: complaint,
                created_at: new Date().toISOString(),
                synced: false // Default to false until successful network request
            });

            // If online, we could trigger a background sync here
            setIsAddPatientModalOpen(false);

            // Clear any previous patient's flowchart before navigating
            window.localStorage.removeItem('triageFlowState');

            // Navigate to builder
            navigate('/builder');
        } catch (error) {
            console.error('Failed to save to local DB:', error);
        } finally {
            setIsSaving(false);
        }
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
                        <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>
                        <span className={`text-xs font-medium tracking-wide uppercase ${isOnline ? 'text-emerald-600' : 'text-rose-500'}`}>
                            {isOnline ? 'Online (Synced)' : 'Offline Mode'}
                        </span>
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
                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 bg-teal-50 text-teal-700 rounded-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="font-medium text-sm">Dashboard</span>
                    </a>
                </nav>
                <div className="p-4 mt-auto border-t border-slate-200">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg font-medium text-sm">
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>

            {/* ── Main Content Area ── */}
            <main className="p-8 md:p-12 lg:p-16 max-w-5xl mx-auto flex flex-col h-full min-h-[calc(100vh-4rem)]">
                <div className="mb-16 text-center md:text-left mt-4 md:mt-8">
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Welcome, Nurse</h1>
                    <p className="text-slate-500 mt-2 text-base max-w-lg mx-auto md:mx-0">
                        Ready to triage new patients. Start a new triage flow to begin generating protocols. Data automatically syncs offline.
                    </p>
                </div>

                <div className="flex justify-center md:justify-start mb-20">
                    <button
                        onClick={() => setIsAddPatientModalOpen(true)}
                        className="flex items-center gap-3 bg-teal-600 text-white px-8 py-4 rounded-xl font-semibold shadow-md active:scale-[0.98]"
                    >
                        Add Patient
                    </button>
                </div>

                <div className="max-w-2xl w-full mx-auto md:mx-0 mt-auto pb-12">
                    <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Offline Records Engine</h2>

                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                        <ul className="divide-y divide-slate-100">
                            {recentPatients?.length === 0 && (
                                <li className="px-6 py-8 text-center text-slate-500 text-sm">No recent patients stored offline.</li>
                            )}

                            {recentPatients?.map((patient: any) => (
                                <li key={patient.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-3">
                                            <span className="font-medium text-sm text-slate-800">{patient.name}</span>
                                            <span className="text-xs text-slate-500">{patient.age}y / {patient.gender}</span>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1 truncate max-w-[200px]">{patient.chief_complaint}</p>
                                    </div>
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${patient.synced
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                        : 'bg-amber-50 text-amber-700 border border-amber-100'
                                        }`}>
                                        {patient.synced ? 'Synced' : 'Pending Cloud Sync'}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </main>

            {/* ── Add Patient Modal ── */}
            {isAddPatientModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsAddPatientModalOpen(false)}></div>
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col">
                        <div className="px-6 py-5 border-b border-slate-100"><h3 className="text-xl font-bold">Add New Patient</h3></div>
                        <div className="p-6 space-y-4">
                            <input value={name} onChange={e => setName(e.target.value)} type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none" placeholder="Full Name" />
                            <div className="grid grid-cols-2 gap-4">
                                <input value={age} onChange={e => setAge(e.target.value)} type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="Age" />
                                <select value={gender} onChange={e => setGender(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm appearance-none">
                                    <option value="">Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                            <textarea value={complaint} onChange={e => setComplaint(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm min-h-[100px] resize-none" placeholder="Chief Complaint"></textarea>
                        </div>
                        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
                            <button onClick={() => setIsAddPatientModalOpen(false)} className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg">Cancel</button>
                            <button onClick={handleStartTriage} disabled={isSaving} className="px-5 py-2.5 text-sm font-semibold text-white bg-teal-600 rounded-lg flex items-center gap-2">
                                {isSaving ? 'Saving...' : 'Start Triage'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default DashboardPage;

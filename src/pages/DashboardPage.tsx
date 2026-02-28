import React from 'react';

/**
 * Dashboard UI Skeleton
 * Structural layout for the Admin/Supervisor dashboard.
 * No business logic, no functional routing, just UI hierarchy and component placement.
 */
const DashboardPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex overflow-hidden font-sans text-slate-900">

            {/* ── Sidebar (Navigation) ── */}
            <aside className="w-64 bg-[#1E3A8A] text-white flex flex-col flex-shrink-0 hidden md:flex">
                {/* Sidebar Header / Logo */}
                <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
                    <div className="w-6 h-6 rounded bg-white/20 mr-3 flex-shrink-0"></div>
                    <span className="font-bold tracking-tight">TriageFlow Admin</span>
                </div>

                {/* Sidebar Links */}
                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                    {/* Active Link Item */}
                    <div className="flex items-center gap-3 px-3 py-2.5 bg-white/10 rounded-lg cursor-pointer">
                        <div className="w-5 h-5 bg-white/20 rounded flex-shrink-0"></div>
                        <span className="font-medium text-sm">Dashboard Overview</span>
                    </div>

                    {/* Inactive Link Items */}
                    <div className="flex items-center gap-3 px-3 py-2.5 text-white/60 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer">
                        <div className="w-5 h-5 border border-white/20 rounded flex-shrink-0"></div>
                        <span className="font-medium text-sm">Protocol Builder</span>
                    </div>
                    <div className="flex items-center gap-3 px-3 py-2.5 text-white/60 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer">
                        <div className="w-5 h-5 border border-white/20 rounded flex-shrink-0"></div>
                        <span className="font-medium text-sm">Clinical Logs</span>
                    </div>
                    <div className="flex items-center gap-3 px-3 py-2.5 text-white/60 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer">
                        <div className="w-5 h-5 border border-white/20 rounded flex-shrink-0"></div>
                        <span className="font-medium text-sm">Staff Management</span>
                    </div>
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 px-3 py-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer">
                        <div className="w-5 h-5 border border-white/20 rounded flex-shrink-0"></div>
                        <span className="font-medium text-sm">System Settings</span>
                    </div>
                </div>
            </aside>

            {/* ── Main Content Area ── */}
            <main className="flex-1 flex flex-col min-w-0">

                {/* Top Navbar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-4">
                        {/* Mobile menu toggle placeholder */}
                        <div className="w-6 h-6 bg-slate-200 rounded md:hidden"></div>
                        <h1 className="text-xl font-semibold text-slate-800">Dashboard Area</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Offline Status Badge */}
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <span className="text-xs font-semibold uppercase tracking-wider">System Online</span>
                        </div>

                        {/* Profile Dropdown Placeholder */}
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 cursor-pointer">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-slate-700">Admin User</p>
                                <p className="text-xs text-slate-400">Chief Medical Officer</p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-slate-200 border border-slate-300"></div>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content Container */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8">

                    {/* Multi-Section Wrapper */}
                    <div className="max-w-6xl mx-auto space-y-8">

                        {/* Sub-Header & Global CTA */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Overview</h2>
                                <p className="text-slate-500 text-sm mt-1">High-level metrics and recent triage activity.</p>
                            </div>
                            <div className="flex gap-3">
                                <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50">
                                    Secondary Action
                                </button>
                                <button className="px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 shadow-sm shadow-teal-600/20">
                                    Primary Action (e.g., New Protocol)
                                </button>
                            </div>
                        </div>

                        {/* KPI Cards Grid */}
                        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Card 1 */}
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                <div className="w-8 h-8 rounded bg-slate-100 mb-3"></div>
                                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Total Protocols</p>
                                <h3 className="text-2xl font-bold mt-1">--</h3>
                            </div>
                            {/* Card 2 */}
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                <div className="w-8 h-8 rounded bg-slate-100 mb-3"></div>
                                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Active Clinics</p>
                                <h3 className="text-2xl font-bold mt-1">--</h3>
                            </div>
                            {/* Card 3 */}
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                <div className="w-8 h-8 rounded bg-slate-100 mb-3"></div>
                                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Cases This Week</p>
                                <h3 className="text-2xl font-bold mt-1">--</h3>
                            </div>
                            {/* Card 4 */}
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                <div className="w-8 h-8 rounded bg-slate-100 mb-3"></div>
                                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">High Risk Alerts</p>
                                <h3 className="text-2xl font-bold mt-1 text-rose-600">--</h3>
                            </div>
                        </section>

                        {/* Main Split Area: Main Data Grid + Right Sidebar Panel */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* Main Data Section (e.g., Active Protocols / Logs Table) */}
                            <section className="lg:col-span-2 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-slate-800">Primary Data View</h3>
                                    <button className="text-sm font-semibold text-teal-600 hover:text-teal-700">View All →</button>
                                </div>

                                {/* Table/List Placeholder Container */}
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

                                    {/* Table Header Row */}
                                    <div className="grid grid-cols-4 gap-4 px-6 py-3 border-b border-slate-100 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        <div className="col-span-2">Column Header 1</div>
                                        <div>Column Header 2</div>
                                        <div className="text-right">Action Header</div>
                                    </div>

                                    {/* Table Rows Placeholder */}
                                    <div className="divide-y divide-slate-100">
                                        {[1, 2, 3, 4].map((item) => (
                                            <div key={item} className="grid grid-cols-4 gap-4 px-6 py-4 items-center hover:bg-slate-50">
                                                <div className="col-span-2 flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100"></div>
                                                    <div>
                                                        <div className="h-4 w-32 bg-slate-200 rounded"></div>
                                                        <div className="h-3 w-20 bg-slate-100 rounded mt-1.5"></div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="h-5 w-16 bg-slate-100 rounded-full"></div>
                                                </div>
                                                <div className="flex justify-end">
                                                    <div className="w-8 h-8 rounded bg-slate-100"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                </div>
                            </section>

                            {/* Secondary Information Panel / Analytics */}
                            <section className="space-y-4">
                                <h3 className="text-lg font-bold text-slate-800">Secondary Panel</h3>

                                {/* Panel Container */}
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-5">

                                    {/* List Item Skeleton */}
                                    {[1, 2, 3].map((item) => (
                                        <div key={item} className="flex gap-3">
                                            <div className="w-2 h-2 rounded-full bg-slate-300 mt-2"></div>
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 w-full bg-slate-200 rounded"></div>
                                                <div className="h-3 w-2/3 bg-slate-100 rounded"></div>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="pt-4 border-t border-slate-100">
                                        <button className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg">
                                            Panel Call to Action
                                        </button>
                                    </div>
                                </div>
                            </section>

                        </div>
                    </div>
                </div>
            </main>

        </div>
    );
};

export default DashboardPage;

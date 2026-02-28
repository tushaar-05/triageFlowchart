import React, { useState, useCallback } from 'react';
import {
    ReactFlow,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Position,
    Handle
} from '@xyflow/react';
import type { Connection, Edge, Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface ProtocolBuilderPageProps {
    onBack?: () => void;
}

// ── Custom Node ──
const ProtocolNode = ({ data, selected }: any) => {
    return (
        <div className={`bg-white rounded-xl border-2 transition-all ${selected ? 'border-teal-500 shadow-md ring-4 ring-teal-500/10' : 'border-slate-200 shadow-sm'} w-64`}>
            {/* Header Badge */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50 rounded-t-xl">
                <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">{data.id || 'NODE-ID'}</span>
                {data.riskWeight && (
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${data.riskWeight === 'High Risk' ? 'bg-rose-100 text-rose-700' :
                        data.riskWeight === 'Medium Risk' ? 'bg-amber-100 text-amber-700' :
                            'bg-emerald-100 text-emerald-700'
                        }`}>
                        {data.riskWeight}
                    </span>
                )}
            </div>

            {/* Body */}
            <div className="p-4">
                <p className="text-sm font-semibold text-slate-800 leading-snug">
                    {data.label}
                </p>

                {/* Input Type Badge */}
                <div className="mt-4 inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                    <span className="text-[11px] font-semibold tracking-wide">{data.inputType}</span>
                </div>
            </div>

            <Handle type="target" position={Position.Top} className="w-3 h-3 bg-slate-200 border-2 border-white shadow-sm" />
            <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-teal-500 border-2 border-white shadow-sm" />
        </div>
    );
};

const nodeTypes = {
    protocol: ProtocolNode,
};

const initialNodes: Node[] = [
    {
        id: 'node-1',
        type: 'protocol',
        position: { x: 250, y: 100 },
        data: {
            id: 'START',
            label: 'Is the patient experiencing severe chest pain?',
            inputType: 'Yes / No',
            riskWeight: 'High Risk'
        }
    },
    {
        id: 'node-2',
        type: 'protocol',
        position: { x: 100, y: 350 },
        data: {
            id: 'Q-2',
            label: 'Is the pain radiating to arm or jaw?',
            inputType: 'Yes / No',
            riskWeight: 'High Risk'
        }
    },
    {
        id: 'node-3',
        type: 'protocol',
        position: { x: 400, y: 350 },
        data: {
            id: 'Q-3',
            label: 'Does the patient have a history of heart conditions?',
            inputType: 'Yes / No',
            riskWeight: 'Medium Risk'
        }
    }
];

const initialEdges: Edge[] = [
    { id: 'e1-2', source: 'node-1', target: 'node-2', label: 'Yes', animated: true, style: { stroke: '#94a3b8', strokeWidth: 2 } },
    { id: 'e1-3', source: 'node-1', target: 'node-3', label: 'No', style: { stroke: '#94a3b8', strokeWidth: 2 } }
];

const ProtocolBuilderPage: React.FC<ProtocolBuilderPageProps> = ({ onBack }) => {
    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);

    const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge({ ...params, style: { stroke: '#94a3b8', strokeWidth: 2 } }, eds)), [setEdges]);

    const onNodeClick = (_: React.MouseEvent, node: Node) => {
        setSelectedNode(node);
    };

    const handlePaneClick = () => {
        setSelectedNode(null);
    };

    return (
        <div className="h-screen bg-slate-50 font-sans text-slate-900 pt-16 pl-0 md:pl-64 flex flex-col overflow-hidden">

            {/* ── Fixed Header ── */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-30">
                <div className="font-semibold text-lg text-slate-800 tracking-tight flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="p-1.5 -ml-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                        title="Back to Dashboard"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <div className="h-4 w-px bg-slate-200"></div>
                    TriageFlow AI
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-2.5 py-1 bg-indigo-50 rounded-md">
                        <span className="text-xs font-semibold text-indigo-700 uppercase tracking-widest">Builder Mode</span>
                    </div>
                </div>
            </header>

            {/* ── Fixed Sidebar (Re-used for consistency) ── */}
            <aside className="fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-slate-200 hidden md:flex flex-col pt-8 z-20">
                <nav className="flex-1 px-4 space-y-2">
                    {/* Inactive Menu Item */}
                    <a href="#" onClick={(e) => { e.preventDefault(); if (onBack) onBack(); }} className="flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="font-medium text-sm">Dashboard</span>
                    </a>
                    {/* Active Menu Item */}
                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 bg-indigo-50 text-indigo-700 rounded-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        <span className="font-medium text-sm">Protocol Builder</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span className="font-medium text-sm">Patients</span>
                    </a>
                </nav>
            </aside>

            {/* ── Main Workspace ── */}
            <main className="flex-1 flex flex-col h-full relative">

                {/* Workspace Toolbar */}
                <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
                    <div className="flex items-center gap-3">
                        <h2 className="text-sm font-bold text-slate-800">Adult Chest Pain Protocol</h2>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-500 border border-slate-200">Draft v1.2</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Node
                        </button>
                        <button className="px-4 py-1.5 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 shadow-sm transition-colors focus:ring-2 focus:ring-indigo-600/30">
                            Save Protocol
                        </button>
                    </div>
                </div>

                {/* Canvas & Right Panel Area */}
                <div className="flex-1 flex relative h-[calc(100vh-7.5rem)]">

                    {/* React Flow Canvas */}
                    <div className="flex-1 bg-[#F8FAFC]">
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            onNodeClick={onNodeClick}
                            onPaneClick={handlePaneClick}
                            nodeTypes={nodeTypes}
                            fitView
                            className="bg-slate-50"
                        >
                            <Background color="#cbd5e1" gap={20} size={1} />
                            <Controls className="fill-slate-600 shadow-sm border-slate-200" showInteractive={false} />
                        </ReactFlow>
                    </div>

                    {/* Right Right Panel - Node Configuration */}
                    {selectedNode && (
                        <div className="w-80 bg-white border-l border-slate-200 flex flex-col h-full shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-10 transform transition-transform">
                            {/* Panel Header */}
                            <div className="h-14 flex items-center justify-between px-5 border-b border-slate-100 bg-slate-50 shrink-0">
                                <h3 className="text-sm font-bold text-slate-800">Node Configuration</h3>
                                <button
                                    onClick={() => setSelectedNode(null)}
                                    className="p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Panel Body */}
                            <div className="flex-1 overflow-y-auto p-5 space-y-6">

                                {/* Info Row */}
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Node ID</span>
                                    <span className="text-xs font-bold text-slate-800 font-mono bg-white px-2 py-1 rounded border border-slate-200 shadow-sm">
                                        {selectedNode.data.id as string}
                                    </span>
                                </div>

                                {/* Form Fields */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Question Text</label>
                                    <textarea
                                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all text-sm text-slate-800 min-h-[80px] resize-none shadow-sm"
                                        defaultValue={selectedNode.data.label as string}
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Input Type</label>
                                    <div className="relative">
                                        <select
                                            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all text-sm text-slate-800 appearance-none shadow-sm"
                                            defaultValue={selectedNode.data.inputType as string}
                                        >
                                            <option value="Yes / No">Yes / No</option>
                                            <option value="Multiple Choice">Multiple Choice</option>
                                            <option value="Numeric">Numeric Input</option>
                                        </select>
                                        <div className="absolute top-[11px] right-3 pointer-events-none text-slate-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Risk Weight</label>
                                    <div className="relative">
                                        <select
                                            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all text-sm text-slate-800 appearance-none shadow-sm"
                                            defaultValue={selectedNode.data.riskWeight as string || 'Low Risk'}
                                        >
                                            <option value="Low Risk">Low Risk</option>
                                            <option value="Medium Risk">Medium Risk</option>
                                            <option value="High Risk">High Risk</option>
                                            <option value="Critical">Critical</option>
                                        </select>
                                        <div className="absolute top-[11px] right-3 pointer-events-none text-slate-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Branching Context */}
                                <div className="pt-4 border-t border-slate-100">
                                    <label className="flex items-center justify-between text-xs font-bold text-slate-700 mb-3 uppercase tracking-wide">
                                        <span>Branch Mapping</span>
                                        <button className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-[10px] hover:bg-indigo-100 transition-colors">+ Add</button>
                                    </label>

                                    <div className="space-y-3">
                                        {/* Mocked mapped paths */}
                                        <div className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded flex-wrap">
                                            <span className="text-xs font-semibold px-2 py-1 bg-white border border-slate-200 rounded">Yes</span>
                                            <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                            <span className="text-xs font-mono font-bold text-slate-600 bg-white px-2 py-1 border border-slate-200 rounded">Q-2</span>
                                        </div>
                                        <div className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded flex-wrap">
                                            <span className="text-xs font-semibold px-2 py-1 bg-white border border-slate-200 rounded">No</span>
                                            <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                            <span className="text-xs font-mono font-bold text-slate-600 bg-white px-2 py-1 border border-slate-200 rounded">Q-3</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Panel Footer */}
                            <div className="p-4 border-t border-slate-200 bg-slate-50 shrink-0">
                                <button className="w-full py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 shadow-sm transition-colors focus:ring-2 focus:ring-indigo-600/30">
                                    Apply Changes
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ProtocolBuilderPage;

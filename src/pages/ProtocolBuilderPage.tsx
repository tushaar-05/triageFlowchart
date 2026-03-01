import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
    ReactFlow,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    Position,
    Handle,
    ReactFlowProvider,
    useReactFlow
} from '@xyflow/react';
import type { Connection, Edge, Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { callAI } from '../ai/triageEngine';

interface ProtocolBuilderPageProps {
    onBack?: () => void;
}

// ── Custom Nodes ──

const RootNode = ({ data }: any) => {
    return (
        <div className="bg-indigo-900/40 border border-indigo-500/30 rounded-2xl max-w-[280px] w-72 shadow-[0_0_20px_rgba(99,102,241,0.15)] overflow-hidden backdrop-blur-md">
            <div className="bg-indigo-950/50 px-4 py-3 flex items-center gap-2 border-b border-indigo-500/20">
                <div className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)] animate-pulse"></div>
                <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Patient Complaint</span>
            </div>
            <div className="p-5">
                <p className="text-sm font-medium text-slate-200 italic leading-relaxed">
                    "{data.complaint}"
                </p>
            </div>
            <Handle type="source" position={Position.Bottom} className="w-3.5 h-3.5 bg-indigo-500 border-none shadow-sm opacity-0" />
        </div>
    );
};

const LevelZoneNode = ({ data }: any) => {
    const nodeCount = data.nodeCount || 1;
    const zoneMinHeight = Math.max(320, nodeCount * 60 + 240);
    const isCompleted = data.allAnswered;

    return (
        <div
            className={`border border-dashed rounded-3xl flex flex-col items-center justify-start relative transition-all duration-700 backdrop-blur-sm ${isCompleted
                ? 'border-teal-500/30 bg-teal-500/5'
                : 'border-white/10 bg-white/5 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]'
                }`}
            style={{ width: Math.max(900, data.width || 900), minHeight: zoneMinHeight }}
        >
            {/* Soft Connector Top */}
            <Handle type="target" position={Position.Top} className="opacity-0" />

            <div className={`w-full border-b py-3 px-6 rounded-t-3xl flex items-center justify-between transition-colors duration-500 ${isCompleted ? 'border-teal-500/20 bg-teal-500/10' : 'border-white/10 bg-white/5'
                }`}>
                <span className={`text-xs font-bold uppercase tracking-widest ${isCompleted ? 'text-teal-400' : 'text-slate-400'
                    }`}>
                    {isCompleted ? '✓ ' : ''}Layer {data.level} — Diagnostic Matrix
                </span>
                {isCompleted && (
                    <span className="text-[10px] font-bold bg-teal-500/10 text-teal-400 px-2.5 py-1 rounded-full border border-teal-500/20 uppercase tracking-widest flex items-center gap-1 shadow-[0_0_10px_rgba(45,212,191,0.2)]">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        Layer Completed
                    </span>
                )}
            </div>

            <div className="flex-1 w-full bg-transparent flex items-center justify-center pointer-events-none">
                {(!data.hasNodes) && (
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-6 h-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
                        <span className="text-indigo-400 font-bold text-xs uppercase tracking-widest animate-pulse">Generating Matrix...</span>
                    </div>
                )}
            </div>

            {/* Soft Connector Bottom */}
            <Handle type="source" position={Position.Bottom} className="opacity-0" />
        </div>
    );
};

const QuestionNode = ({ data, id }: any) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(data.selectedOption || null);
    const [subjectiveNote, setSubjectiveNote] = useState<string>(data.subjectiveInput || '');
    const isLocked = data.answered || false;
    const isFinalDecision = data.type === 'FINAL DECISION';

    const handleSelect = (opt: string) => {
        if (isLocked) return;
        setSelectedOption(opt);
        window.dispatchEvent(new CustomEvent('triage-option-selected', { detail: { option: opt, subjectiveInput: subjectiveNote, nodeId: id, level: data.level } }));
    };

    const handleSendNote = (e?: React.MouseEvent | React.KeyboardEvent) => {
        if (isLocked) return;
        if (e) { e.preventDefault(); e.stopPropagation(); }
        if (!subjectiveNote.trim() && !selectedOption) return;
        const opt = selectedOption || 'Other';
        setSelectedOption(opt);
        window.dispatchEvent(new CustomEvent('triage-option-selected', { detail: { option: opt, subjectiveInput: subjectiveNote, nodeId: id, level: data.level } }));
    };

    // ── FINAL DECISION special card ──
    if (isFinalDecision) {
        const lines = data.question?.split('\n') || [];
        const titleLine = lines[0] || '';
        const actionLine = lines[1] || '';
        const reasonLine = lines[2] || '';
        const riskLevel = titleLine.includes('HIGH') ? 'HIGH' : titleLine.includes('MEDIUM') ? 'MEDIUM' : 'LOW';
        const riskColor = riskLevel === 'HIGH' ? 'red' : riskLevel === 'MEDIUM' ? 'amber' : 'emerald';
        const colorMap: Record<string, { bg: string, border: string, text: string, badge: string, badgeText: string, glow: string }> = {
            red: { bg: 'bg-rose-950/40', border: 'border-rose-500/30', text: 'text-rose-300', badge: 'bg-rose-500/10 border-rose-500/20', badgeText: 'text-rose-400', glow: 'shadow-[0_0_20px_rgba(244,63,94,0.15)]' },
            amber: { bg: 'bg-amber-950/40', border: 'border-amber-500/30', text: 'text-amber-300', badge: 'bg-amber-500/10 border-amber-500/20', badgeText: 'text-amber-400', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]' },
            emerald: { bg: 'bg-emerald-950/40', border: 'border-emerald-500/30', text: 'text-emerald-300', badge: 'bg-emerald-500/10 border-emerald-500/20', badgeText: 'text-emerald-400', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]' },
        };
        const c = colorMap[riskColor];
        return (
            <div className={`${c.bg} border ${c.border} rounded-2xl w-[380px] overflow-hidden backdrop-blur-md ${c.glow}`}>
                <div className={`px-5 py-3 border-b ${c.border} flex items-center justify-between bg-black/20`}>
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Final Decision
                    </span>
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border uppercase tracking-widest ${c.badge} ${c.badgeText}`}>{riskLevel} RISK</span>
                </div>
                <div className="p-5 flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recommended Action</span>
                        <p className={`text-sm font-bold ${c.text} leading-snug`}>{actionLine.replace('Action: ', '')}</p>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Clinical Reason</span>
                        <p className="text-xs text-slate-400 leading-relaxed">{reasonLine.replace('Reason: ', '')}</p>
                    </div>
                    <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSelect('Complete Triage'); }}
                        className={`nodrag mt-2 w-full py-2.5 rounded-xl text-sm font-bold transition-all border ${isLocked
                            ? 'bg-teal-500/10 border-teal-500/20 text-teal-400 cursor-default'
                            : 'bg-transparent border-white/20 text-white hover:bg-white/5 active:scale-[0.98]'
                            }`}
                    >
                        {isLocked ? '✓ Triage Flow Finalized' : 'Finalize Flow'}
                    </button>
                </div>
                <Handle type="target" position={Position.Top} className="opacity-0 w-0 h-0" />
                <Handle type="source" position={Position.Bottom} className="opacity-0 w-0 h-0" />
            </div >
        );
    }

    return (
        <div className={`bg-[#131A2A]/90 backdrop-blur-md border rounded-2xl w-[300px] flex flex-col transition-all duration-300 ${isLocked
            ? 'border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.1)] opacity-95 ring-1 ring-indigo-500/20'
            : 'border-white/10 shadow-xl hover:border-indigo-400/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)]'
            }`}>
            <div className={`p-4 border-b rounded-t-2xl ${isLocked ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-white/5 border-white/10'
                }`}>
                <div className="flex justify-between items-start mb-2">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        AI Question
                    </span>
                    <div className="flex items-center gap-2">
                        {isLocked && (
                            <span className="text-[10px] font-bold text-teal-400 flex items-center gap-1 uppercase tracking-wider">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                Answered
                            </span>
                        )}
                        <span className="text-[9px] font-bold bg-white/5 border border-white/10 text-slate-400 px-2 py-0.5 rounded uppercase tracking-wider">{data.type}</span>
                    </div>
                </div>
                <div className="text-[13px] font-bold text-slate-200 leading-snug">{data.question}</div>
            </div>

            <div className={`p-4 flex flex-col gap-3 ${isLocked ? 'pointer-events-none' : ''}`}>
                <div className="flex gap-2 flex-wrap">
                    {data.options?.map((opt: string) => (
                        <button
                            type="button"
                            key={opt}
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSelect(opt); }}
                            className={`nodrag flex-1 py-1.5 px-2.5 border rounded-lg text-xs font-bold transition-all focus:outline-none ${selectedOption === opt
                                ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 ring-1 ring-indigo-400/30'
                                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
                                }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>

                <div className="pt-3 border-t border-white/5">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Subjective Notes</label>
                    <textarea
                        className="nodrag w-full text-xs p-3 border border-white/10 rounded-xl bg-black/20 resize-none outline-none focus:bg-black/40 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all text-slate-200 placeholder:text-slate-600"
                        placeholder="Type an answer or context here..."
                        rows={2}
                        value={subjectiveNote}
                        onChange={(e) => setSubjectiveNote(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) handleSendNote(e); }}
                        disabled={isLocked}
                    />
                    {!isLocked && !selectedOption && (
                        <div className="flex justify-end mt-2 nodrag">
                            <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSendNote(); }}
                                disabled={!subjectiveNote.trim()}
                                className="px-3 py-1.5 bg-indigo-500/20 text-indigo-300 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-indigo-500/30 transition-colors disabled:opacity-40 flex items-center gap-1 border border-indigo-500/30"
                            >
                                Submit
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <Handle type="target" position={Position.Top} className="opacity-0 w-0 h-0" />
            <Handle type="source" position={Position.Bottom} className="opacity-0 w-0 h-0" />
        </div>
    );
};

const nodeTypes = {
    rootNode: RootNode,
    questionNode: QuestionNode,
    levelZone: LevelZoneNode
};

// ── Mock Data ──

const LEVEL_1_SUGGESTIONS = [
    { id: 'sq-1', question: 'Does the pain radiate to the jaw, neck, or arm?', type: 'Binary', options: ['Yes', 'No'] },
    { id: 'sq-2', question: 'How would you rate the pain?', type: 'Numeric', options: ['1-3 (Mild)', '4-7 (Mod)', '8-10 (Sev)'] },
    { id: 'sq-3', question: 'Are you experiencing shortness of breath?', type: 'Binary', options: ['Yes', 'No'] },
    { id: 'sq-4', question: 'How long has the pain been present?', type: 'Multiple Choice', options: ['< 1 hour', '1-24 hours', '> 24 hours'] },
];

const LEVEL_2_SUGGESTIONS = [
    { id: 'sq-f1', question: 'Have you taken any recent medications for the pain?', type: 'Binary', options: ['Yes', 'No'] },
    { id: 'sq-f2', question: 'Are you feeling lightheaded, dizzy, or nauseous?', type: 'Binary', options: ['Yes', 'No'] },
    { id: 'sq-f3', question: 'Do you have a history of heart conditions?', type: 'Binary', options: ['Yes', 'No', 'Unsure'] },
];

const LEVEL_3_SUGGESTIONS = [
    { id: 'sq-t1', question: 'Is the pain worsened by breathing deeply?', type: 'Binary', options: ['Yes', 'No'] },
    { id: 'sq-t2', question: 'Have you had a fever recently?', type: 'Binary', options: ['Yes', 'No'] },
];

// ── Main Component ──

const getInitialState = () => {
    try {
        const item = window.localStorage.getItem('triageFlowState');
        return item ? JSON.parse(item) : null;
    } catch { return null; }
};

const FlowCanvas = () => {
    const initialState = React.useMemo(() => getInitialState(), []);

    // Canvas State
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialState?.nodes || []);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialState?.edges || []);
    const { screenToFlowPosition, getNodes, fitView } = useReactFlow();

    // No-op connect handler – this canvas is layered not branched
    const onConnect = useCallback((_params: Connection) => { }, []);

    // Triage App State
    const [complaint, setComplaint] = useState(initialState?.complaint || '');
    const [hasStarted, setHasStarted] = useState(initialState?.hasStarted || false);
    // suggestions state kept minimal — tray removed, nodes auto-place on canvas
    const setSuggestions = (_: any[]) => { }; // no-op, kept for call-site compatibility
    const [isAiThinking, setIsAiThinking] = useState(false);

    // Level tracking
    const [currentLevel, setCurrentLevel] = useState(initialState?.currentLevel || 1);
    const reactFlowWrapper = useRef<HTMLDivElement>(null);

    // Persist state to localStorage
    useEffect(() => {
        window.localStorage.setItem('triageFlowState', JSON.stringify({
            nodes,
            edges,
            complaint,
            hasStarted,
            currentLevel
        }));
    }, [nodes, edges, complaint, hasStarted, currentLevel]);

    // Dynamic layer generation talking to Ollama API!
    const generateNextLayer = useCallback(async (nextLevel: number) => {
        setIsAiThinking(true);
        setSuggestions([]);

        let fetchedSuggestions = [];
        try {
            // Dynamically build the history from nodes that have been dragged and answered
            const allNodes = getNodes();
            const answeredHistory = allNodes
                .filter(n => n.type === 'questionNode' && n.data.answered)
                .sort((a, b) => (Number(a.data.level) || 0) - (Number(b.data.level) || 0))
                .map(n => `AI Question: ${n.data.question} -> Patient: ${n.data.selectedOption} ${n.data.subjectiveInput ? `(Notes: ${n.data.subjectiveInput})` : ''}`);

            const response = await callAI(complaint, answeredHistory);

            // Force a final result on the frontend if:
            // 1. AI returned a result, OR
            // 2. We've already done 2+ layers of Q&A (to prevent infinite loops)
            const shouldForceResult = response.type === 'result' || answeredHistory.length >= 8;

            if (shouldForceResult) {
                const riskLevel = response.risk_level || 'MEDIUM';
                const action = response.action || 'Consult attending physician for further assessment';
                const reason = response.reason || 'Sufficient data gathered from multi-layer triage.';
                fetchedSuggestions = [{
                    id: `result-${Date.now()}`,
                    type: 'FINAL DECISION',
                    question: `Triage Result: ${riskLevel} Risk\nAction: ${action}\nReason: ${reason}`,
                    options: ['Complete Triage']
                }];
            } else if (response.follow_up_questions) {
                fetchedSuggestions = response.follow_up_questions.map((q: any, i: number) => ({
                    id: `sq-l${nextLevel}-${Date.now()}-${i}`,
                    type: `${q.priority} PRIORITY`,
                    question: q.question,
                    options: q.expected_answers || []
                }));
            }
        } catch (error) {
            console.error("Falling back to standard mock arrays due to error:", error);
            const nextSugs = nextLevel === 1 ? LEVEL_1_SUGGESTIONS : (nextLevel === 2 ? LEVEL_2_SUGGESTIONS : LEVEL_3_SUGGESTIONS);
            fetchedSuggestions = nextSugs.map(s => ({ ...s, id: `sq-l${nextLevel}-${s.id}-${Date.now()}` }));
        }

        // Nodes are auto-placed directly into the canvas zone below — clear the tray
        setSuggestions([]);
        setCurrentLevel(nextLevel);
        setIsAiThinking(false);

        // Zone sizing — use actual estimated card heights
        const nodeCount = fetchedSuggestions.length;
        const isFinalLayer = nodeCount === 1 && fetchedSuggestions[0]?.type === 'FINAL DECISION';
        const NODE_WIDTH = 310;       // card width
        const CARD_HEIGHT = isFinalLayer ? 280 : 460;  // estimated card height (Final Decision is shorter)
        const GAP = 30;               // horizontal gap between cards
        const ZONE_HEADER_H = 60;     // zone header bar height
        const ZONE_PADDING_BOTTOM = 40;
        const zoneHeight = ZONE_HEADER_H + CARD_HEIGHT + ZONE_PADDING_BOTTOM;
        const totalContentWidth = nodeCount * NODE_WIDTH + (nodeCount - 1) * GAP;
        const totalWidth = Math.max(900, totalContentWidth + 100); // 50px padding each side

        // Zone position — centered on screen, stacked with consistent spacing
        const newZoneY = nextLevel === 1 ? 300 : 300 + (nextLevel - 1) * (zoneHeight + 160);
        const newZoneId = `zone-level-${nextLevel}`;
        const zoneX = window.innerWidth / 2 - totalWidth / 2 - 50;

        // Center nodes horizontally within the zone
        const nodeStartX = zoneX + (totalWidth - totalContentWidth) / 2;

        const newQuestionNodes: Node[] = fetchedSuggestions.map((s: any, i: number) => ({
            id: `node-q-${nextLevel}-${i}-${Date.now()}`,
            type: 'questionNode',
            position: {
                x: nodeStartX + i * (NODE_WIDTH + GAP),
                y: newZoneY + ZONE_HEADER_H + 10
            },
            data: { ...s, level: nextLevel, answered: false },
            draggable: false,
            zIndex: 10
        }));

        setNodes((nds) => {
            if (nds.some(n => n.id === newZoneId)) return nds; // Already exists
            const zoneNode: Node = {
                id: newZoneId,
                type: 'levelZone',
                position: { x: zoneX, y: newZoneY },
                data: { level: nextLevel, hasNodes: nodeCount > 0, allAnswered: false, nodeCount, width: totalWidth },
                style: { width: totalWidth, minHeight: zoneHeight },
                draggable: false,
                selectable: false,
                zIndex: -1
            };
            return [...nds, zoneNode, ...newQuestionNodes];
        });

        // Add Soft structural edge representing "Context Progressed"
        if (nextLevel > 1) {
            setEdges((eds) => {
                const prevNodeId = `zone-level-${nextLevel - 1}`;
                if (eds.some(e => e.id === `e-progression-${nextLevel}`)) return eds;
                return [...eds, {
                    id: `e-progression-${nextLevel}`,
                    source: prevNodeId,
                    target: newZoneId,
                    type: 'straight',
                    style: { stroke: '#cbd5e1', strokeWidth: 4, strokeDasharray: '5,5' },
                    animated: true
                }];
            });
        }

        setTimeout(() => {
            fitView({ duration: 800, padding: 0.2 });
        }, 100);

    }, [complaint, setNodes, setEdges, fitView, getNodes]);

    const handleStartFlow = async () => {
        if (!complaint.trim()) return;
        setHasStarted(true);
        setCurrentLevel(1);

        // Make root node
        const rootId = `root-${Date.now()}`;
        setNodes([{
            id: rootId,
            type: 'rootNode',
            position: { x: window.innerWidth / 2 - 140, y: 50 },
            data: { complaint },
            draggable: false
        }]);
        setEdges([]);

        // Initiate AI call
        generateNextLayer(1);
    };

    const handleExportJSON = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
            nodes,
            edges,
            complaint,
            currentLevel
        }, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `triage_flow_${Date.now()}.json`);
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    // Tracking answered questions to trigger next layer intelligently
    useEffect(() => {
        const handleOptionEvent = (e: any) => {
            const { nodeId, level } = e.detail;

            // Mark node internally as answered
            setNodes((nds) => {
                return nds.map((n) => {
                    if (n.id === nodeId) {
                        return { ...n, data: { ...n.data, answered: true, selectedOption: e.detail.option, subjectiveInput: e.detail.subjectiveInput } };
                    }
                    return n;
                });
            });

            // Check if all nodes *in this specific level* are answered
            setTimeout(() => {
                const allCurrentNodes = getNodes();
                const nodesInLevel = allCurrentNodes.filter(n => n.type === 'questionNode' && n.data.level === level);
                const allAnswered = nodesInLevel.every(n => n.data.answered);
                const hasFinalDecision = nodesInLevel.some(n => n.data.type === 'FINAL DECISION');

                if (nodesInLevel.length > 0 && allAnswered && level === currentLevel) {

                    // Mark the zone as fully completed visually and LOCK all nodes in this level
                    setNodes((nds) => nds.map(n => {
                        if (n.id === `zone-level-${level}`) return { ...n, data: { ...n.data, allAnswered: true } };
                        // Lock answered nodes so they can't be moved
                        if (n.type === 'questionNode' && n.data.level === level) {
                            return { ...n, draggable: false, selectable: false, data: { ...n.data, answered: true } };
                        }
                        return n;
                    }));

                    // Progress to the next layer of questions, but only if:
                    // 1. Not yet reached the final decision
                    // 2. Under the hard cap of 3 rounds of questions before a forced result
                    if (!hasFinalDecision && level < 3) {
                        generateNextLayer(level + 1);
                    } else if (!hasFinalDecision && level >= 3) {
                        // Level 3+ = force the final AI assessment (answeredHistory >= 8 will trigger forceResult)
                        generateNextLayer(level + 1);
                    }
                }
            }, 50);
        };

        window.addEventListener('triage-option-selected', handleOptionEvent);
        return () => window.removeEventListener('triage-option-selected', handleOptionEvent);
    }, [currentLevel, generateNextLayer, getNodes, setNodes]);


    // ── Drag & Drop Logic for Layer Container Alignment ──

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();
            if (!reactFlowWrapper.current) return;

            const suggestionDataStr = event.dataTransfer.getData('application/reactflow');
            if (!suggestionDataStr) return;

            const suggestionData = JSON.parse(suggestionDataStr);
            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();

            // Raw drop pos
            const position = screenToFlowPosition({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });

            // Find which zone they dropped it into (or default to current active level)
            const targetZoneId = `zone-level-${currentLevel}`;

            // Calculate auto-layout purely horizontally inside the container
            const currentGraphNodes = getNodes();
            const existingNodesInZone = currentGraphNodes.filter(n => n.type === 'questionNode' && n.data.level === currentLevel);
            const zoneNode = currentGraphNodes.find(n => n.id === targetZoneId);

            if (!zoneNode) return;

            // Simple horizontal layout calculation centering items in the container
            const spacing = 360;
            const nodeCount = existingNodesInZone.length + 1;
            const containerCenterX = zoneNode.position.x + (zoneNode.style?.width ? Number(zoneNode.style.width) / 2 : 400);

            let startX = containerCenterX - ((nodeCount - 1) * spacing) / 2;

            // Create new node object
            const newNodeId = `node-q-${Date.now()}`;
            const newNode: Node = {
                id: newNodeId,
                type: 'questionNode',
                // Temporarily place it where they dropped it, we will reposition it + brothers instantly
                position: { x: position.x, y: zoneNode.position.y + 60 },
                data: { ...suggestionData, level: currentLevel, answered: false },
                zIndex: 10 // above box
            };

            setNodes((nds) => {
                // Update hasNodes state of the zone
                const mappedNds = nds.map(n => {
                    if (n.id === targetZoneId) return { ...n, data: { ...n.data, hasNodes: true } };

                    // Re-layout horizontal siblings in the same level uniformly
                    if (n.type === 'questionNode' && n.data.level === currentLevel) {
                        const updated = { ...n, position: { ...n.position, x: startX } };
                        startX += spacing;
                        return updated;
                    }
                    return n;
                });

                // Add the actual new node laid out correctly as the final sibling
                newNode.position.x = startX;

                return [...mappedNds, newNode];
            });

            // Tray removed — nodes auto-placed, nothing to remove here
        },
        [screenToFlowPosition, getNodes, setNodes, currentLevel]
    );

    return (
        <div className="flex-1 flex flex-col h-full bg-[#0B0F19] relative overflow-hidden">

            {/* 1. Root Input Section */}
            <div className="p-6 border-b border-white/10 bg-[#0B0F19]/80 backdrop-blur-xl shrink-0 shadow-sm z-30 relative">
                <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                            What is the patient saying?
                        </label>
                        <input
                            type="text"
                            className={`w-full px-5 py-3.5 bg-black/20 border border-white/10 rounded-xl outline-none text-white font-medium transition-all shadow-inner placeholder:text-slate-600 ${hasStarted ? 'opacity-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50'}`}
                            placeholder="e.g., I have severe chest pain that started an hour ago..."
                            value={complaint}
                            onChange={(e) => setComplaint(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !hasStarted && handleStartFlow()}
                            disabled={hasStarted}
                        />
                    </div>
                    <div className="flex items-end">
                        {!hasStarted ? (
                            <button
                                onClick={handleStartFlow}
                                disabled={!complaint.trim()}
                                className="w-full sm:w-auto px-8 py-3.5 bg-teal-500/20 text-teal-300 border border-teal-500/50 font-bold rounded-xl hover:bg-teal-500/30 transition-all flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(20,184,166,0.15)] focus:ring-2 focus:ring-teal-500/50"
                            >
                                Start Triage
                            </button>
                        ) : (
                            <div className="flex gap-2 w-full sm:w-auto">
                                <button
                                    onClick={() => {
                                        window.localStorage.removeItem('triageFlowState');
                                        setHasStarted(false); setNodes([]); setEdges([]); setComplaint('');
                                    }}
                                    className="px-4 py-3.5 bg-white/5 border border-white/10 text-slate-400 font-bold rounded-xl hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 transition-all shadow-sm flex-shrink-0"
                                    title="Reset Matrix"
                                >
                                    <svg className="w-5 h-5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                </button>
                                <button
                                    onClick={handleExportJSON}
                                    className="w-full sm:w-auto px-6 py-3.5 bg-indigo-500/20 border border-indigo-500/50 text-indigo-300 font-bold rounded-xl hover:bg-indigo-500/30 transition-all shadow-[0_0_15px_rgba(99,102,241,0.15)] flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                    Export JSON
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 2. AI Thinking Status Bar — only visible while AI is generating */}
            {hasStarted && isAiThinking && (
                <div className="bg-indigo-500/10 backdrop-blur-md border-b border-white/10 px-6 py-3 shrink-0 z-20 flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin shrink-0"></div>
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                        DeepSeek Reasoning Model: Generating Matrix Layer {currentLevel}...
                    </span>
                </div>
            )}

            {/* 3. Interactive Component Flow Canvas */}
            <div className="flex-1 relative z-10" ref={reactFlowWrapper}>
                {hasStarted ? (
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        nodeTypes={nodeTypes}
                        className="bg-transparent"
                        fitView
                        minZoom={0.2}
                        maxZoom={1.5}
                        proOptions={{ hideAttribution: true }}
                    >
                        <Background color="#ffffff20" gap={20} size={1.5} />
                        <Controls className="fill-slate-300 shadow-sm border-white/10 bg-[#131A2A]/50 backdrop-blur-sm rounded-lg overflow-hidden" showInteractive={false} />
                    </ReactFlow>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-transparent pointer-events-none p-6 z-0">
                        {/* ── Background Glow Effects ── */}
                        <div className="absolute top-[20%] left-[20%] w-[300px] h-[300px] bg-indigo-600/10 blur-[100px] rounded-full mix-blend-screen"></div>
                        <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-teal-600/10 blur-[120px] rounded-full mix-blend-screen"></div>

                        <div className="w-24 h-24 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(45,212,191,0.1)]">
                            <svg className="w-10 h-10 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tight mb-2">A.I. Diagnostic Matrix Ready</h2>
                        <p className="text-slate-400 max-w-sm text-center font-medium">
                            Awaiting initial symptom manifestation. Enter chief complaint to map structural pathways.
                        </p>
                    </div>
                )}
            </div>

        </div>
    );
};

// ── Wrapper Page ──

const TriageCanvasPage: React.FC<ProtocolBuilderPageProps> = ({ onBack }) => {
    return (
        <div className="h-screen bg-[#0B0F19] text-slate-200 font-sans pt-16 pl-0 md:pl-64 flex flex-col overflow-hidden selection:bg-indigo-500/30">
            {/* Nav Headers */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-white/5 border-b border-white/10 flex items-center justify-between px-6 z-40 backdrop-blur-md shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 p-1.5 -ml-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors group focus:outline-none focus:ring-2 focus:ring-slate-500/50"
                        title="Back to Dashboard"
                    >
                        <svg className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span className="font-bold text-sm hidden sm:inline">Command Center</span>
                    </button>
                    <div className="h-5 w-px bg-white/10"></div>
                    <span className="font-bold text-lg text-white tracking-tight flex items-center gap-2">
                        TriageFlow<span className="text-indigo-400">AI</span>
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg shadow-[0_0_10px_rgba(99,102,241,0.1)]">
                        <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            Active State Model
                        </span>
                    </div>
                </div>
            </header>

            <aside className="fixed top-16 left-0 bottom-0 w-64 bg-white/5 border-r border-white/10 hidden md:flex flex-col pt-8 z-30 backdrop-blur-md">
                <nav className="flex-1 px-4 space-y-2">
                    <a href="#" onClick={(e) => { e.preventDefault(); if (onBack) onBack(); }} className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="font-medium text-sm">Command Center</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 bg-indigo-500/10 text-indigo-300 rounded-lg border border-indigo-500/20">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="font-bold text-sm">State Matrix Canvas</span>
                    </a>
                </nav>
            </aside>

            {/* Injected React Flow Context Wrapper required for hooks */}
            <ReactFlowProvider>
                <FlowCanvas />
            </ReactFlowProvider>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { height: 8px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; border: 2px solid #0B0F19; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
            `}} />
        </div>
    );
};

export default TriageCanvasPage;

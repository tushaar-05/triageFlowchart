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
        <div className="bg-slate-800 border-2 border-slate-900 rounded-2xl max-w-[280px] w-72 shadow-lg overflow-hidden">
            <div className="bg-slate-900/50 px-4 py-3 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"></div>
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Patient Complaint (Root)</span>
            </div>
            <div className="p-5">
                <p className="text-sm font-medium text-slate-100 italic leading-relaxed">
                    "{data.complaint}"
                </p>
            </div>
            <Handle type="source" position={Position.Bottom} className="w-3.5 h-3.5 bg-slate-800 border-2 border-slate-300 shadow-sm opacity-0" />
        </div>
    );
};

const LevelZoneNode = ({ data }: any) => {
    const nodeCount = data.nodeCount || 1;
    const zoneMinHeight = Math.max(320, nodeCount * 60 + 240);
    const isCompleted = data.allAnswered;

    return (
        <div
            className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-start relative transition-all duration-500 ${isCompleted
                ? 'border-emerald-300 bg-emerald-50/30'
                : 'border-slate-300 bg-slate-50/50'
                }`}
            style={{ width: Math.max(900, data.width || 900), minHeight: zoneMinHeight }}
        >
            {/* Soft Connector Top */}
            <Handle type="target" position={Position.Top} className="opacity-0" />

            <div className={`w-full border-b py-3 px-6 rounded-t-2xl flex items-center justify-between ${isCompleted ? 'border-emerald-200/60 bg-emerald-50/50' : 'border-slate-200/60 bg-white/50'
                }`}>
                <span className={`text-xs font-bold uppercase tracking-widest ${isCompleted ? 'text-emerald-600' : 'text-slate-500'
                    }`}>
                    {isCompleted ? '✓ ' : ''}Layer {data.level} — Questions
                </span>
                {isCompleted && (
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200 uppercase tracking-widest flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        Layer Completed
                    </span>
                )}
            </div>

            <div className="flex-1 w-full bg-transparent flex items-center justify-center pointer-events-none">
                {(!data.hasNodes) && (
                    <span className="text-slate-400 font-medium text-sm">Loading questions...</span>
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
        const colorMap: Record<string, { bg: string, border: string, text: string, badge: string, badgeText: string }> = {
            red: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-800', badge: 'bg-red-100 border-red-200', badgeText: 'text-red-700' },
            amber: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-800', badge: 'bg-amber-100 border-amber-200', badgeText: 'text-amber-700' },
            emerald: { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-800', badge: 'bg-emerald-100 border-emerald-200', badgeText: 'text-emerald-700' },
        };
        const c = colorMap[riskColor];
        return (
            <div className={`${c.bg} border-2 ${c.border} rounded-2xl w-[380px] shadow-lg overflow-hidden`}>
                <div className={`px-5 py-3 border-b ${c.border} flex items-center justify-between`}>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
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
                        <p className="text-xs text-slate-600 leading-relaxed">{reasonLine.replace('Reason: ', '')}</p>
                    </div>
                    <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSelect('Complete Triage'); }}
                        className={`nodrag mt-2 w-full py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${isLocked
                            ? 'bg-emerald-100 border-emerald-300 text-emerald-700 cursor-default'
                            : `${c.bg} ${c.border} ${c.text} hover:opacity-80 active:scale-[0.98]`
                            }`}
                    >
                        {isLocked ? '✓ Triage Completed' : 'Complete Triage'}
                    </button>
                </div>
                <Handle type="target" position={Position.Top} className="opacity-0 w-0 h-0" />
                <Handle type="source" position={Position.Bottom} className="opacity-0 w-0 h-0" />
            </div>
        );
    }

    return (
        <div className={`bg-white border-2 rounded-2xl w-[300px] flex flex-col transition-all ${isLocked
            ? 'border-indigo-300 shadow-sm ring-2 ring-indigo-100 opacity-90'
            : 'border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300'
            }`}>
            <div className={`p-3.5 border-b rounded-t-2xl ${isLocked ? 'bg-indigo-50/60 border-indigo-100' : 'bg-gradient-to-b from-slate-50 to-white border-slate-100'
                }`}>
                <div className="flex justify-between items-start mb-2">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        AI Question
                    </span>
                    <div className="flex items-center gap-2">
                        {isLocked && (
                            <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 uppercase tracking-wider">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                Answered
                            </span>
                        )}
                        <span className="text-[10px] font-bold bg-slate-100 border border-slate-200 text-slate-500 px-2 py-0.5 rounded uppercase tracking-wider">{data.type}</span>
                    </div>
                </div>
                <div className="text-[13px] font-bold text-slate-800 leading-snug">{data.question}</div>
            </div>

            <div className={`p-3.5 flex flex-col gap-3 ${isLocked ? 'pointer-events-none' : ''}`}>
                <div className="flex gap-2 flex-wrap">
                    {data.options?.map((opt: string) => (
                        <button
                            type="button"
                            key={opt}
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSelect(opt); }}
                            className={`nodrag flex-1 py-1.5 px-2.5 border rounded-lg text-xs font-bold transition-all focus:outline-none ${selectedOption === opt
                                ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-2 ring-indigo-500/20'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                                }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>

                <div className="pt-2 border-t border-slate-100">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Subjective Notes</label>
                    <textarea
                        className="nodrag w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-slate-50 resize-none outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-700 placeholder:text-slate-400"
                        placeholder="Type an answer or context here..."
                        rows={2}
                        value={subjectiveNote}
                        onChange={(e) => setSubjectiveNote(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) handleSendNote(e); }}
                        disabled={isLocked}
                    />
                    {!isLocked && !selectedOption && (
                        <div className="flex justify-end mt-1.5 nodrag">
                            <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSendNote(); }}
                                disabled={!subjectiveNote.trim()}
                                className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-md text-[10px] font-bold uppercase tracking-wider hover:bg-indigo-100 transition-colors disabled:opacity-40 flex items-center gap-1 border border-indigo-200"
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

const FlowCanvas = () => {
    // Canvas State
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const { screenToFlowPosition, getNodes, fitView } = useReactFlow();

    // No-op connect handler – this canvas is layered not branched
    const onConnect = useCallback((_params: Connection) => { }, []);

    // Triage App State
    const [complaint, setComplaint] = useState('');
    const [hasStarted, setHasStarted] = useState(false);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isAiThinking, setIsAiThinking] = useState(false);

    // Level tracking
    const [currentLevel, setCurrentLevel] = useState(1);
    const reactFlowWrapper = useRef<HTMLDivElement>(null);

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

        setSuggestions(fetchedSuggestions);
        setCurrentLevel(nextLevel);
        setIsAiThinking(false);

        // Zone sizing — each node is ~380px tall, add 120px for zone header + padding
        const nodeCount = fetchedSuggestions.length;
        const zoneHeight = Math.max(380, nodeCount * 60 + 280);

        // Add the new Zone structurally — spacing = 600px between zones
        const newZoneY = nextLevel === 1 ? 300 : 300 + (nextLevel - 1) * 620;
        const newZoneId = `zone-level-${nextLevel}`;

        // Horizontal layout: center nodes inside the zone
        const NODE_SPACING = 340;
        const totalWidth = Math.max(900, nodeCount * NODE_SPACING + 80);

        const newQuestionNodes: Node[] = fetchedSuggestions.map((s: any, i: number) => ({
            id: `node-q-${nextLevel}-${i}-${Date.now()}`,
            type: 'questionNode',
            position: { x: (window.innerWidth / 2 - 450) + (i * NODE_SPACING) + (totalWidth / 2 - (nodeCount * NODE_SPACING) / 2), y: newZoneY + 80 },
            data: { ...s, level: nextLevel, answered: false },
            draggable: false,
            zIndex: 10
        }));

        setNodes((nds) => {
            if (nds.some(n => n.id === newZoneId)) return nds; // Already exists
            const zoneNode: Node = {
                id: newZoneId,
                type: 'levelZone',
                position: { x: window.innerWidth / 2 - totalWidth / 2 - 50, y: newZoneY },
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

        // Setup initial structure: Root
        const rootNode = {
            id: 'root-complaint',
            type: 'rootNode',
            position: { x: window.innerWidth / 2 - 140, y: 50 },
            data: { complaint },
            draggable: false,
        };

        setNodes([rootNode]);

        // Kick off the AI Request for Level 1 questions!
        await generateNextLayer(1);

        // Structural downward link to level 1 generated inside generateNextLayer
        setEdges([{
            id: 'e-progression-1',
            source: 'root-complaint',
            target: 'zone-level-1',
            type: 'straight',
            style: { stroke: '#cbd5e1', strokeWidth: 4, strokeDasharray: '5,5' },
            animated: true
        }]);

        setTimeout(() => fitView({ duration: 800, padding: 0.2 }), 50);
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

            // Remove from graphical UI Tray
            setSuggestions((sugs) => sugs.filter(s => s.id !== suggestionData.id));
        },
        [screenToFlowPosition, getNodes, setNodes, currentLevel]
    );

    return (
        <div className="flex-1 flex flex-col h-full bg-[#FAFAFA] relative overflow-hidden">

            {/* 1. Root Input Section */}
            <div className="p-6 border-b border-slate-200 bg-white shrink-0 shadow-sm z-30 relative">
                <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                            What is the patient saying?
                        </label>
                        <input
                            type="text"
                            className={`w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 font-medium transition-all shadow-inner ${hasStarted ? 'opacity-60 bg-slate-100 cursor-not-allowed text-slate-500' : 'focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600'}`}
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
                                className="w-full sm:w-auto px-8 py-3.5 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-md focus:ring-4 focus:ring-teal-600/30"
                            >
                                Start Triage
                            </button>
                        ) : (
                            <button
                                onClick={() => { setHasStarted(false); setNodes([]); setEdges([]); setComplaint(''); }}
                                className="w-full sm:w-auto px-6 py-3.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition shadow-sm"
                            >
                                Reset Model
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* 2. AI Question Suggestion Container */}
            {hasStarted && (
                <div className={`bg-slate-100 border-b border-slate-200 p-4 shrink-0 shadow-inner z-20 relative h-[210px] transition-all duration-500 ${isAiThinking ? 'bg-indigo-50/50' : ''}`}>
                    <div className="flex items-center gap-2 mb-3 px-2 max-w-7xl mx-auto">
                        {isAiThinking ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
                                <h3 className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Compiling Level {currentLevel} Matrix...</h3>
                            </div>
                        ) : (
                            <>
                                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>
                                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Next Suggested Questions <span className="text-slate-400 font-normal">(Based on Layer {currentLevel - 1 > 0 ? currentLevel - 1 : 'Root'} State)</span></h3>
                            </>
                        )}
                    </div>

                    {/* Scrollable container for cards */}
                    <div className="flex gap-4 overflow-x-auto pb-4 pt-1 px-2 snap-x max-w-7xl mx-auto custom-scrollbar">
                        {!isAiThinking && suggestions.map(sug => (
                            <div
                                key={sug.id}
                                draggable
                                onDragStart={(e) => {
                                    e.dataTransfer.setData('application/reactflow', JSON.stringify(sug));
                                    e.dataTransfer.effectAllowed = 'move';
                                }}
                                className="shrink-0 w-72 bg-white border-2 border-slate-200 rounded-xl p-4 cursor-grab active:cursor-grabbing hover:border-indigo-400 hover:shadow-lg transition-all snap-start flex flex-col group"
                            >
                                <div className="flex justify-between items-start mb-2.5">
                                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-500 transition-colors uppercase tracking-wider">{sug.type}</span>
                                </div>
                                <p className="text-sm font-bold text-slate-800 leading-snug mb-4 flex-1">{sug.question}</p>
                                <div className="flex gap-1.5 flex-wrap">
                                    {sug.options.slice(0, 3).map((opt: string) => (
                                        <span key={opt} className="px-2 py-1 bg-slate-50 border border-slate-100 rounded text-[10px] font-bold text-slate-500">{opt}</span>
                                    ))}
                                    {sug.options.length > 3 && <span className="px-2 py-1 bg-slate-50 rounded text-[10px] font-bold text-slate-400">+{sug.options.length - 3}</span>}
                                </div>
                            </div>
                        ))}

                        {!isAiThinking && suggestions.length === 0 && (
                            <div className="w-full flex justify-center items-center py-6">
                                <div className="flex flex-col items-center gap-2">
                                    <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm font-bold text-slate-400">Layer staging complete. Answer canvas items to proceed.</span>
                                </div>
                            </div>
                        )}
                    </div>
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
                        <Background color="#cbd5e1" gap={20} size={1.5} />
                        <Controls className="fill-slate-600 shadow-sm border-slate-200 rounded-lg overflow-hidden" showInteractive={false} />
                    </ReactFlow>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-transparent pointer-events-none p-6">
                        <div className="w-24 h-24 rounded-full bg-teal-50 flex items-center justify-center mb-6">
                            <svg className="w-10 h-10 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-700 tracking-tight">AI-Assisted Assessment Ready</h2>
                        <p className="text-slate-500 mt-2 max-w-sm text-center">
                            Awaiting root symptom declaration above to map triage layer structure.
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
        <div className="h-screen bg-slate-50 font-sans text-slate-900 pt-16 pl-0 md:pl-64 flex flex-col overflow-hidden">
            {/* Nav Headers (Remains the Same) */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-40 shadow-sm shadow-slate-200/50">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 p-1.5 -ml-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors group focus:outline-none focus:ring-2 focus:ring-slate-200"
                        title="Back to Dashboard"
                    >
                        <svg className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span className="font-bold text-sm hidden sm:inline">Back</span>
                    </button>
                    <div className="h-5 w-px bg-slate-200"></div>
                    <span className="font-bold text-lg text-slate-800 tracking-tight flex items-center gap-2">
                        TriageFlow AI
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg">
                        <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-widest flex items-center gap-1.5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            Active State Model
                        </span>
                    </div>
                </div>
            </header>

            <aside className="fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-slate-200 hidden md:flex flex-col pt-8 z-30">
                <nav className="flex-1 px-4 space-y-2">
                    <a href="#" onClick={(e) => { e.preventDefault(); if (onBack) onBack(); }} className="flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="font-medium text-sm">Dashboard</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100">
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
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; border: 2px solid #f1f5f9; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
            `}} />
        </div>
    );
};

export default TriageCanvasPage;

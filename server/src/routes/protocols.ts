/**
 * routes/protocols.ts
 * GET  /api/protocols           — list active protocols
 * GET  /api/protocols/:id       — get protocol with its full node tree
 * POST /api/protocols           — create a new protocol (Builder Mode)
 * POST /api/protocols/:id/nodes — add a node to an existing protocol
 */
import { Router, Request, Response } from 'express';
import pool from '../db/connection';

const router = Router();

// ── List protocols ────────────────────────────────────────────────────────────
router.get('/', async (_req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.id, p.name, p.description, p.category, p.start_node_key,
              p.thresholds, p.is_active, p.created_at,
              s.name AS created_by_name
       FROM protocols p
       LEFT JOIN staff s ON s.id = p.created_by
       WHERE p.is_active = TRUE
       ORDER BY p.created_at DESC`
    ) as any[];

    return res.json({ success: true, data: rows });
  } catch (err: any) {
    console.error('[protocols/list]', err.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch protocols.' });
  }
});

// ── Get protocol + all nodes ──────────────────────────────────────────────────
router.get('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid protocol id.' });

  try {
    const [[protocol]] = await pool.query(
      `SELECT id, name, description, category, start_node_key, thresholds, is_active, created_at
       FROM protocols WHERE id = ?`,
      [id]
    ) as any[];

    if (!protocol) return res.status(404).json({ success: false, message: 'Protocol not found.' });

    const [nodes] = await pool.query(
      `SELECT id, node_key, question, input_type, options,
              is_terminal, is_ai_assist, node_order
       FROM nodes
       WHERE protocol_id = ?
       ORDER BY node_order ASC`,
      [id]
    ) as any[];

    return res.json({ success: true, data: { ...protocol, nodes } });
  } catch (err: any) {
    console.error('[protocols/get]', err.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch protocol.' });
  }
});

// ── Create protocol ───────────────────────────────────────────────────────────
router.post('/', async (req: Request, res: Response) => {
  const { name, description, category, start_node_key, thresholds, created_by } = req.body as {
    name?: string; description?: string; category?: string;
    start_node_key?: string; thresholds?: object; created_by?: number;
  };

  if (!name || !category || !start_node_key || !thresholds) {
    return res.status(400).json({
      success: false,
      message: 'name, category, start_node_key, and thresholds are required.',
    });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO protocols (name, description, category, start_node_key, thresholds, created_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        description?.trim() ?? null,
        category.trim(),
        start_node_key.trim(),
        JSON.stringify(thresholds),
        created_by ?? null,
      ]
    ) as any[];

    return res.status(201).json({ success: true, protocolId: result.insertId });
  } catch (err: any) {
    console.error('[protocols/create]', err.message);
    return res.status(500).json({ success: false, message: 'Failed to create protocol.' });
  }
});

// ── Add node to protocol ──────────────────────────────────────────────────────
router.post('/:id/nodes', async (req: Request, res: Response) => {
  const protocol_id = Number(req.params.id);
  if (isNaN(protocol_id)) return res.status(400).json({ success: false, message: 'Invalid protocol id.' });

  const { node_key, question, input_type, options, is_terminal, is_ai_assist, node_order } = req.body as {
    node_key?: string; question?: string;
    input_type?: 'yes_no' | 'mcq' | 'numeric';
    options?: object[]; is_terminal?: boolean;
    is_ai_assist?: boolean; node_order?: number;
  };

  if (!node_key || !question || !input_type || !options) {
    return res.status(400).json({
      success: false,
      message: 'node_key, question, input_type, and options are required.',
    });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO nodes
         (protocol_id, node_key, question, input_type, options, is_terminal, is_ai_assist, node_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        protocol_id,
        node_key.trim(),
        question.trim(),
        input_type,
        JSON.stringify(options),
        is_terminal ?? false,
        is_ai_assist ?? false,
        node_order ?? 0,
      ]
    ) as any[];

    return res.status(201).json({ success: true, nodeId: result.insertId });
  } catch (err: any) {
    console.error('[protocols/addNode]', err.message);
    return res.status(500).json({ success: false, message: 'Failed to add node.' });
  }
});

export default router;

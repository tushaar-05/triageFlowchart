/**
 * routes/patients.ts
 * GET  /api/patients           — list all patients (paginated)
 * GET  /api/patients/:id       — get one patient + their case history
 * POST /api/patients           — register a new patient
 */
import { Router, Request, Response } from 'express';
import pool from '../db/connection';

const router = Router();

// ── List patients ─────────────────────────────────────────────────────────────
router.get('/', async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
  const offset = (page - 1) * limit;

  try {
    const [rows] = await pool.query(
      `SELECT id, name, age, gender, weight_kg, contact, created_at
       FROM patients
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    ) as any[];

    const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM patients') as any[];

    return res.json({ success: true, data: rows, total, page, limit });
  } catch (err: any) {
    console.error('[patients/list]', err.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch patients.' });
  }
});

// ── Get one patient ───────────────────────────────────────────────────────────
router.get('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid patient id.' });

  try {
    const [[patient]] = await pool.query(
      'SELECT id, name, age, gender, weight_kg, contact, created_at FROM patients WHERE id = ?',
      [id]
    ) as any[];

    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found.' });

    // Attach case history
    const [cases] = await pool.query(
      `SELECT c.id, c.chief_complaint, c.risk_level, c.total_risk_score,
              c.recommendation, c.status, c.created_at,
              p.name AS protocol_name,
              s.name AS attended_by_name
       FROM cases c
       JOIN protocols p ON p.id = c.protocol_id
       LEFT JOIN staff s ON s.id = c.attended_by
       WHERE c.patient_id = ?
       ORDER BY c.created_at DESC`,
      [id]
    ) as any[];

    return res.json({ success: true, data: { ...patient, cases } });
  } catch (err: any) {
    console.error('[patients/get]', err.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch patient.' });
  }
});

// ── Register new patient ──────────────────────────────────────────────────────
router.post('/', async (req: Request, res: Response) => {
  const { name, age, gender, weight_kg, contact } = req.body as {
    name?: string; age?: number; gender?: string; weight_kg?: number; contact?: string;
  };

  if (!name || !age || !gender) {
    return res.status(400).json({ success: false, message: 'name, age, and gender are required.' });
  }

  if (!['male', 'female', 'other'].includes(gender)) {
    return res.status(400).json({ success: false, message: 'gender must be male | female | other.' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO patients (name, age, gender, weight_kg, contact)
       VALUES (?, ?, ?, ?, ?)`,
      [name.trim(), age, gender, weight_kg ?? null, contact?.trim() ?? null]
    ) as any[];

    return res.status(201).json({ success: true, patientId: result.insertId });
  } catch (err: any) {
    console.error('[patients/create]', err.message);
    return res.status(500).json({ success: false, message: 'Failed to register patient.' });
  }
});

export default router;

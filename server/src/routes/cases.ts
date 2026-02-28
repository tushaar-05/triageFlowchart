/**
 * routes/cases.ts
 * POST /api/cases               — save a completed triage case
 * GET  /api/cases               — list cases (paginated, filterable by risk_level)
 * GET  /api/cases/:id           — get one case with full answer audit trail
 */
import { Router, Request, Response } from 'express';
import pool from '../db/connection';

const router = Router();

// ── Save completed case ───────────────────────────────────────────────────────
router.post('/', async (req: Request, res: Response) => {
  const {
    patient_id, protocol_id, attended_by,
    chief_complaint, ai_classification,
    total_risk_score, risk_level, recommendation, status,
    // vitals
    bp_systolic, bp_diastolic, heart_rate, temperature_c, spo2_pct,
    // answers array
    answers,
  } = req.body as {
    patient_id?: number; protocol_id?: number; attended_by?: number;
    chief_complaint?: string; ai_classification?: string;
    total_risk_score?: number; risk_level?: 'LOW' | 'MODERATE' | 'HIGH';
    recommendation?: string; status?: string;
    bp_systolic?: number; bp_diastolic?: number; heart_rate?: number;
    temperature_c?: number; spo2_pct?: number;
    answers?: Array<{
      node_key: string;
      question_snapshot: string;
      answer_given: string;
      risk_weight_applied: number;
    }>;
  };

  if (!patient_id || !protocol_id || !chief_complaint || !risk_level) {
    return res.status(400).json({
      success: false,
      message: 'patient_id, protocol_id, chief_complaint, and risk_level are required.',
    });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Insert case
    const [caseResult] = await conn.query(
      `INSERT INTO cases
         (patient_id, protocol_id, attended_by, chief_complaint, ai_classification,
          total_risk_score, risk_level, recommendation, status,
          bp_systolic, bp_diastolic, heart_rate, temperature_c, spo2_pct)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        patient_id, protocol_id, attended_by ?? null,
        chief_complaint, ai_classification ?? null,
        total_risk_score ?? 0, risk_level, recommendation ?? null,
        status ?? 'completed',
        bp_systolic ?? null, bp_diastolic ?? null,
        heart_rate ?? null, temperature_c ?? null, spo2_pct ?? null,
      ]
    ) as any[];

    const caseId = caseResult.insertId;

    // 2. Insert audit trail
    if (answers && answers.length > 0) {
      const answerRows = answers.map((a) => [
        caseId, a.node_key, a.question_snapshot, a.answer_given, a.risk_weight_applied,
      ]);

      await conn.query(
        `INSERT INTO case_answers
           (case_id, node_key, question_snapshot, answer_given, risk_weight_applied)
         VALUES ?`,
        [answerRows]
      );
    }

    await conn.commit();
    return res.status(201).json({ success: true, caseId });
  } catch (err: any) {
    await conn.rollback();
    console.error('[cases/create]', err.message);
    return res.status(500).json({ success: false, message: 'Failed to save case.' });
  } finally {
    conn.release();
  }
});

// ── List cases ────────────────────────────────────────────────────────────────
router.get('/', async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
  const offset = (page - 1) * limit;
  const riskFilter = req.query.risk_level as string | undefined;

  try {
    const where = riskFilter ? 'WHERE c.risk_level = ?' : '';
    const queryArgs: any[] = riskFilter ? [riskFilter, limit, offset] : [limit, offset];

    const [rows] = await pool.query(
      `SELECT c.id, c.chief_complaint, c.risk_level, c.total_risk_score,
              c.recommendation, c.status, c.created_at,
              pat.name  AS patient_name,
              pro.name  AS protocol_name,
              s.name    AS attended_by_name
       FROM cases c
       JOIN patients   pat ON pat.id = c.patient_id
       JOIN protocols  pro ON pro.id = c.protocol_id
       LEFT JOIN staff s   ON s.id   = c.attended_by
       ${where}
       ORDER BY c.created_at DESC
       LIMIT ? OFFSET ?`,
      queryArgs
    ) as any[];

    const countArgs: any[] = riskFilter ? [riskFilter] : [];
    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM cases c ${where}`,
      countArgs
    ) as any[];

    return res.json({ success: true, data: rows, total, page, limit });
  } catch (err: any) {
    console.error('[cases/list]', err.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch cases.' });
  }
});

// ── Get one case with answers ─────────────────────────────────────────────────
router.get('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid case id.' });

  try {
    const [[caseRow]] = await pool.query(
      `SELECT c.*,
              pat.name   AS patient_name,  pat.age, pat.gender,
              pro.name   AS protocol_name, pro.category,
              s.name     AS attended_by_name, s.staff_id AS attended_by_staff_id
       FROM cases c
       JOIN patients  pat ON pat.id = c.patient_id
       JOIN protocols pro ON pro.id = c.protocol_id
       LEFT JOIN staff s  ON s.id   = c.attended_by
       WHERE c.id = ?`,
      [id]
    ) as any[];

    if (!caseRow) return res.status(404).json({ success: false, message: 'Case not found.' });

    const [answers] = await pool.query(
      `SELECT node_key, question_snapshot, answer_given, risk_weight_applied, answered_at
       FROM case_answers WHERE case_id = ? ORDER BY answered_at ASC`,
      [id]
    ) as any[];

    return res.json({ success: true, data: { ...caseRow, answers } });
  } catch (err: any) {
    console.error('[cases/get]', err.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch case.' });
  }
});

export default router;

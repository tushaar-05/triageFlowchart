/**
 * routes/auth.ts
 * POST /api/auth/login  — verify staff_id + password, return staff record
 *
 * No JWT / session logic yet — pure UI-layer auth.
 */
import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import pool from '../db/connection';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  const { staff_id, password } = req.body as { staff_id?: string; password?: string };

  if (!staff_id || !password) {
    return res.status(400).json({ success: false, message: 'staff_id and password are required.' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT id, staff_id, name, role, password_hash, is_active FROM staff WHERE staff_id = ?',
      [staff_id.trim()]
    ) as any[];

    if (!rows.length) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const staff = rows[0];

    if (!staff.is_active) {
      return res.status(403).json({ success: false, message: 'Account is inactive. Contact administrator.' });
    }

    const passwordMatch = await bcrypt.compare(password, staff.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    // Return safe subset — never send password_hash
    return res.json({
      success: true,
      staff: {
        id: staff.id,
        staff_id: staff.staff_id,
        name: staff.name,
        role: staff.role,
      },
    });
  } catch (err: any) {
    console.error('[auth/login]', err.message);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

export default router;

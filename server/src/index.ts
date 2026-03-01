import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import patientRoutes from './routes/patients';
import protocolRoutes from './routes/protocols';
import caseRoutes from './routes/cases';
import aiRoutes from './routes/ai';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
// Root endpoint so Render health checks and browser testing don't say "Cannot GET /"
app.get('/', (_req, res) => {
  res.send('TriageFlow API is live and running. Use /api/* endpoints.');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/protocols', protocolRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Fallback error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Unhandled Error]', err);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

app.listen(port, () => {
  console.log(`🚀 TriageFlow Server running at http://localhost:${port}`);
});

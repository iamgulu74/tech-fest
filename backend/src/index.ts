import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import trialRoutes from './routes/trial.routes.js';
import authRoutes from './routes/auth.routes.js';
import hospitalRoutes from './routes/hospital.routes.js';
import symptomRoutes from './routes/symptom.routes.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Main Routes
app.use('/api/trial', trialRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/symptoms', symptomRoutes);

// Root Ping
app.get('/api/ping', (req, res) => {
    res.json({ status: 'ok', service: 'Healthcare Education Hub Backend', version: '1.0' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('SERVER ERROR:', err.stack);
    res.status(500).json({ error: 'Critical system failure/Internal error.' });
});

const PORT = Number(process.env.PORT) || 5001;

httpServer.listen(PORT, () => {
    console.log(`🚀 [BACKEND] Healthcare Platform Core now running on port ${PORT}`);
    console.log('🔗 [API] Health Check: http://localhost:' + PORT + '/api/ping');
});

export default app;

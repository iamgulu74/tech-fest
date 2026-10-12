import express from 'express';
import { trialController } from '../controllers/trialController.js';

const router = express.Router();

// POST /api/trial/start
router.post('/start', (req, res) => trialController.startTrial(req, res));

// GET /api/trial/status/:userId
router.get('/status/:userId', (req, res) => trialController.getStatus(req, res));

export default router;

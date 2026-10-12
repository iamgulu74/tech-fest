import express from 'express';
import { symptomController } from '../controllers/symptomController.js';

const router = express.Router();

// POST /api/symptoms/check
router.post('/check', (req, res) => symptomController.checkSymptoms(req, res));

export default router;

import express from 'express';
import { hospitalController } from '../controllers/hospitalController.js';

const router = express.Router();

// GET /api/hospitals
router.get('/', (req, res) => hospitalController.getAllHospitals(req, res));

// GET /api/hospitals/:id
router.get('/:id', (req, res) => hospitalController.getHospitalById(req, res));

export default router;

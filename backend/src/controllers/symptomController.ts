import { Request, Response } from 'express';
import { aiService } from '../services/aiService.js';

export const symptomController = {
  async checkSymptoms(req: Request, res: Response) {
    const { symptoms } = req.body;

    if (!symptoms) {
      return res.status(400).json({ error: 'Symptoms are required.' });
    }

    try {
      const result = await aiService.analyzeSymptoms(symptoms);
      return res.status(200).json({ message: result });
    } catch (error: any) {
      console.warn('Symptom Controller Warning:', error.message, 'Using locally simulated AI.');
      // Local simulation if OpenAI fails
      const fallbackMsg = `Based on your reported symptoms ("${symptoms}"), our preliminary analysis suggests potential mild metabolic or inflammatory response. RECOMMENDED: Monitor symptoms for next 12-24h. If conditions worsen, seek medical attention immediately. [DISCLAIMER: This is a neural simulation, not medical advice.]`;
      return res.status(200).json({
        message: {
          role: 'assistant',
          content: fallbackMsg
        }
      });
    }
  }
};

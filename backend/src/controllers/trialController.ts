import { Request, Response } from 'express';
import { trialService } from '../services/trialService.js';

export class TrialController {
  /**
   * Start a new trial for a user
   */
  async startTrial(req: Request, res: Response) {
    const { userId, paymentMethodToken, email, name, paymentType } = req.body;

    if (!userId || !paymentMethodToken || !email) {
      return res.status(400).json({ error: 'Missing required fields for starting trial.' });
    }

    try {
      const result = await trialService.startTrial(userId, paymentMethodToken, {
        email,
        name,
        paymentType,
        signup_source: 'web_portal'
      });

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Trial Controller Error:', error.message);
      return res.status(500).json({ error: 'Internal server error while starting trial.' });
    }
  }

  /**
   * Get trial status for a user
   */
  async getStatus(req: Request, res: Response) {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    // This would typically involve fetching from Firestore
    // For now, returning a static success or placeholder
    return res.status(200).json({ status: 'fetching_integrated' });
  }
}

export const trialController = new TrialController();

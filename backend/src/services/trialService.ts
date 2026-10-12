import { firestore, FieldValue, Timestamp } from '../config/firebase.config.js';
import { razorpay } from '../config/razorpay.config.js';
// Simple email service mock as we haven't implemented it yet
import { emailService } from './emailService.js';
import { v4 as uuidv4 } from 'uuid';

export class TrialService {

  /**
   * Start a 7-day free trial for a user
   */
  async startTrial(userId: string, paymentMethodToken: string, metadata?: any) {
    const trialId = uuidv4();
    const startDate = Timestamp.now();
    const endDate = new Timestamp(startDate.seconds + (7 * 24 * 60 * 60), 0); // 7 days later

    try {
      // Create trial record
      const trial = {
        trial_id: trialId,
        user_id: userId,
        email: metadata.email,
        status: 'active',
        dates: {
          started_at: startDate,
          expires_at: endDate
        },
        payment_method_added: true,
        payment_method: {
          type: metadata.paymentType || 'card',
          token: paymentMethodToken
        },
        engagement: {
          topics_read: 0,
          videos_watched: 0,
          ai_questions: 0,
          pdfs_downloaded: 0,
          days_active: 1,
          last_active: startDate
        },
        email_sequence: {
          day_1_sent: false,
          day_2_sent: false,
          day_4_sent: false,
          day_5_sent: false,
          day_6_sent: false,
          day_7_sent: false
        },
        conversion: {
          converted: false
        },
        metadata: metadata || {},
        created_at: startDate,
        updated_at: startDate
      };

      // Save to Firestore
      await firestore.collection('trials').doc(trialId).set(trial);

      // Update user document
      await firestore.collection('users').doc(userId).update({
        'trial.status': 'active',
        'trial.start_date': startDate,
        'trial.end_date': endDate,
        'trial.converted_to_paid': false,
        updated_at: startDate
      });

      // Schedule email sequence
      await this.scheduleTrialEmails(userId, trialId, metadata.email);

      // Send welcome email (Day 1)
      await emailService.sendTrialWelcomeEmail(metadata.email, {
        name: metadata.name,
        trial_end_date: endDate.toDate()
      });

      return {
        success: true,
        trial_id: trialId,
        expires_at: endDate.toDate()
      };

    } catch (error) {
      console.error('Error starting trial:', error);
      throw new Error('Failed to start trial');
    }
  }

  /**
   * Schedule trial email sequence
   */
  private async scheduleTrialEmails(userId: string, trialId: string, email: string) {
    const startDate = Timestamp.now();

    const emailSchedule = [
      { template: 'trial_day_1', days: 0 },   // Immediate
      { template: 'trial_day_2', days: 2 },
      { template: 'trial_day_4', days: 4 },
      { template: 'trial_day_5', days: 5 },
      { template: 'trial_day_6', days: 6 },
      { template: 'trial_day_7', days: 7 }
    ];

    const batch = firestore.batch();

    emailSchedule.forEach(schedule => {
      const emailId = uuidv4();
      const scheduledTime = new Timestamp(
        startDate.seconds + (schedule.days * 24 * 60 * 60),
        0
      );

      const emailDoc = firestore.collection('email_queue').doc(emailId);
      batch.set(emailDoc, {
        email_id: emailId,
        user_id: userId,
        email: email,
        template: schedule.template,
        scheduled_for: scheduledTime,
        status: 'pending',
        variables: { trial_id: trialId },
        created_at: startDate
      });
    });

    await batch.commit();
  }

  /**
   * Convert trial to paid subscription
   */
  async convertTrialToSubscription(
    userId: string,
    trialId: string,
    plan: 'individual' | 'family' | 'plus',
    billingCycle: 'monthly' | 'annual'
  ) {
      // Logic for conversion after 7 days or user manually upgrades early
      // Placeholder for now as specified in core specification next steps.
      console.log('Converting trial for user:', userId);
      return { success: true };
  }
}

export const trialService = new TrialService();

import dotenv from 'dotenv';

dotenv.config();

export class EmailService {
  /**
   * Send a trial welcome email (Day 1)
   */
  async sendTrialWelcomeEmail(email: string, data: { name: string; trial_end_date: Date }) {
    console.log(`📧 Sending Trial Welcome Email to ${email} (Expires: ${data.trial_end_date.toDateString()})`);
    // Mocking the actual SendGrid/Twilio email send logic
    return { success: true };
  }

  /**
   * Generic send email method
   */
  async sendEmail(to: string, subject: string, text: string) {
    console.log(`📧 Sending Email to ${to}: [${subject}]`);
    return { success: true };
  }
}

export const emailService = new EmailService();

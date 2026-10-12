import { Timestamp } from 'firebase-admin/firestore';

export interface User {
  user_id: string;                    // Firebase Auth UID
  email: string;
  phone?: string;

  profile: {
    full_name: string;
    date_of_birth?: string;
    gender?: 'male' | 'female' | 'other';
    avatar_url?: string;
  };

  // Trial & Subscription Status
  trial: {
    status: 'not_started' | 'active' | 'expired' | 'converted';
    start_date?: Timestamp;
    end_date?: Timestamp;              // 7 days from start
    converted_to_paid: boolean;
    conversion_date?: Timestamp;
  };

  subscription: {
    status: 'none' | 'active' | 'paused' | 'cancelled' | 'expired';
    plan: 'individual' | 'family' | 'plus';
    billing_cycle: 'monthly' | 'annual';
    price: number;                     // ₹149, ₹249, ₹499

    current_period_start: Timestamp;
    current_period_end: Timestamp;
    next_billing_date: Timestamp;

    razorpay_subscription_id?: string;
    razorpay_customer_id?: string;

    pause: {
      is_paused: boolean;
      paused_at?: Timestamp;
      resume_at?: Timestamp;
    };

    cancellation: {
      is_cancelled: boolean;
      cancelled_at?: Timestamp;
      cancellation_reason?: string;
      access_until: Timestamp;         // End of current period
    };
  };

  payment_method: {
    type?: 'card' | 'upi' | 'netbanking' | 'wallet';
    last_4_digits?: string;
    upi_id?: string;
    is_default: boolean;
  };

  usage_stats: {
    topics_read: number;
    videos_watched: number;
    ai_questions_asked: number;
    pdfs_downloaded: number;
    total_time_spent_minutes: number;
    last_active: Timestamp;
    login_count: number;
  };

  preferences: {
    language: 'en' | 'hi' | 'ta' | 'te';
    email_notifications: boolean;
    push_notifications: boolean;
    sms_notifications: boolean;
  };

  referral: {
    referral_code: string;             // Unique code for this user
    referred_by?: string;              // Code of referrer
    referral_credits: number;          // ₹ credits earned
    total_referrals: number;
  };

  created_at: Timestamp;
  updated_at: Timestamp;
  last_login: Timestamp;
}

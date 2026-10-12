import { Timestamp } from 'firebase-admin/firestore';

export interface Subscription {
  subscription_id: string;             // Our internal ID
  user_id: string;

  razorpay_subscription_id: string;
  razorpay_customer_id: string;

  plan: {
    name: 'individual' | 'family' | 'plus';
    billing_cycle: 'monthly' | 'annual';
    price: number;
    currency: 'INR';
  };

  status: 'created' | 'active' | 'paused' | 'cancelled' | 'expired';

  dates: {
    created_at: Timestamp;
    activated_at?: Timestamp;
    current_period_start: Timestamp;
    current_period_end: Timestamp;
    next_billing_date: Timestamp;
    cancelled_at?: Timestamp;
    expired_at?: Timestamp;
  };

  trial_info: {
    had_trial: boolean;
    trial_start: Timestamp;
    trial_end: Timestamp;
    converted_from_trial: boolean;
  };

  payment_history: string[];           // Array of payment_ids

  metadata: {
    signup_source: 'web' | 'mobile' | 'referral';
    promo_code?: string;
    discount_applied?: number;
  };

  updated_at: Timestamp;
}

export interface Trial {
  trial_id: string;
  user_id: string;
  email: string;

  status: 'active' | 'converted' | 'expired' | 'cancelled';

  dates: {
    started_at: Timestamp;
    expires_at: Timestamp;              // 7 days from start
    converted_at?: Timestamp;
    cancelled_at?: Timestamp;
  };

  payment_method_added: boolean;        // Required for trial
  payment_method: {
    type: 'card' | 'upi' | 'netbanking';
    token?: string;                     // Razorpay token
  };

  engagement: {
    topics_read: number;
    videos_watched: number;
    ai_questions: number;
    pdfs_downloaded: number;
    days_active: number;                // How many days user logged in
    last_active: Timestamp;
  };

  email_sequence: {
    day_1_sent: boolean;
    day_2_sent: boolean;
    day_4_sent: boolean;
    day_5_sent: boolean;
    day_6_sent: boolean;
    day_7_sent: boolean;
  };

  conversion: {
    converted: boolean;
    subscription_id?: string;
    conversion_offer?: string;          // "special_99" if discount applied
  };

  metadata: {
    signup_source: 'homepage' | 'content_gate' | 'ai_chat_limit' | 'video_unlock';
    referral_code?: string;
    utm_source?: string;
    utm_campaign?: string;
  };

  created_at: Timestamp;
  updated_at: Timestamp;
}

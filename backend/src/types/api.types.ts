import { Timestamp } from 'firebase-admin/firestore';

export interface Payment {
  payment_id: string;                  // Our internal ID
  user_id: string;
  subscription_id?: string;

  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;

  amount: number;
  currency: 'INR';
  status: 'created' | 'pending' | 'authorized' | 'captured' | 'failed' | 'refunded';

  payment_method: {
    type: 'card' | 'upi' | 'netbanking' | 'wallet';
    card_network?: string;              // Visa, Mastercard, etc.
    bank?: string;
    wallet?: string;
    upi_id?: string;
  };

  purpose: 'subscription_creation' | 'subscription_renewal' | 'trial_conversion' | 'upgrade';

  billing_period: {
    start: Timestamp;
    end: Timestamp;
  };

  refund?: {
    refund_id: string;
    amount: number;
    reason: string;
    refunded_at: Timestamp;
  };

  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface Content {
  content_id: string;
  type: 'topic' | 'video' | 'pdf' | 'infographic';

  title: string;
  slug: string;                        // URL-friendly
  description: string;

  category: 'diseases' | 'treatments' | 'wellness' | 'first_aid';
  subcategory: string;
  tags: string[];

  access_level: 'free' | 'premium';    // Free or premium content

  content: {
    markdown?: string;                 // For topics
    video_url?: string;                // For videos
    pdf_url?: string;                  // For PDFs
    thumbnail_url?: string;
    duration_minutes?: number;
  };

  seo: {
    meta_title: string;
    meta_description: string;
    keywords: string[];
  };

  analytics: {
    views: number;
    unique_views: number;
    avg_time_spent: number;
    completion_rate: number;           // % who finished
    rating: number;
    rating_count: number;
  };

  related_content: string[];           // Array of content_ids

  author: {
    name: string;
    credentials: string;
    verified: boolean;
  };

  published: boolean;
  published_at?: Timestamp;
  created_at: Timestamp;
  updated_at: Timestamp;
}

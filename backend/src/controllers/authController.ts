import { Request, Response } from 'express';
import { auth, firestore, admin } from '../config/firebase.config.js';
import { User } from '../types/user.types.js';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role, hospitalId, hospitalName } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user already exists in Firebase Auth
    let userRecord;
    try {
      userRecord = await auth.createUser({
        email,
        password,
        displayName: name,
      });
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        return res.status(400).json({ error: 'Email already in use' });
      }
      throw error;
    }

    const userData: Partial<User> = {
      user_id: userRecord.uid,
      email,
      profile: {
        full_name: name,
      },
      trial: {
        status: 'not_started',
        converted_to_paid: false,
      },
      subscription: {
        status: 'none',
        plan: 'individual',
        billing_cycle: 'monthly',
        price: 0,
        current_period_start: admin.firestore.Timestamp.now(),
        current_period_end: admin.firestore.Timestamp.now(),
        next_billing_date: admin.firestore.Timestamp.now(),
        pause: { is_paused: false },
        cancellation: {
          is_cancelled: false,
          access_until: admin.firestore.Timestamp.now(),
        },
      },
      usage_stats: {
        topics_read: 0,
        videos_watched: 0,
        ai_questions_asked: 0,
        pdfs_downloaded: 0,
        total_time_spent_minutes: 0,
        last_active: admin.firestore.Timestamp.now(),
        login_count: 1,
      },
      preferences: {
        language: 'en',
        email_notifications: true,
        push_notifications: true,
        sms_notifications: true,
      },
      referral: {
        referral_code: Math.random().toString(36).substring(2, 8).toUpperCase(),
        total_referrals: 0,
        referral_credits: 0,
      },
      created_at: admin.firestore.Timestamp.now(),
      updated_at: admin.firestore.Timestamp.now(),
      last_login: admin.firestore.Timestamp.now(),
    };

    // If admin, add hospital info
    if (role === 'admin') {
      (userData as any).admin_info = {
        role: 'hospital_admin',
        hospital_id: hospitalId,
        hospital_name: hospitalName,
      };
    } else {
        (userData as any).role = 'patient';
    }

    await firestore.collection('users').doc(userRecord.uid).set(userData);

    res.status(201).json({
      message: 'User registered successfully',
      uid: userRecord.uid,
      role: role
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { idToken, role } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'ID Token required' });
    }

    // Verify the token
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Get user data from Firestore
    const userDoc = await firestore.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found in database' });
    }

    const userData = userDoc.data();
    const actualRole = userData.role || (userData.admin_info ? 'admin' : 'patient');

    // Verify role matches requested platform
    if (role && actualRole !== role) {
      return res.status(403).json({ error: `Unauthorized. This account is registered as a ${actualRole}.` });
    }

    // Update last login
    await firestore.collection('users').doc(uid).update({
      last_login: admin.firestore.Timestamp.now(),
      'usage_stats.login_count': admin.firestore.FieldValue.increment(1)
    });

    res.json({
      uid,
      email: decodedToken.email,
      name: userData.profile?.full_name || decodedToken.name,
      role: actualRole,
      hospitalId: userData.admin_info?.hospital_id,
      hospitalName: userData.admin_info?.hospital_name
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

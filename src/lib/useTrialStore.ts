/**
 * useTrialStore – localStorage-backed hook for managing trial / subscription state.
 * No backend required; all state lives in the browser.
 */
import { useState, useEffect, useCallback } from 'react';

export type SubscriptionPlan = 'individual' | 'family' | 'plus';
export type UserStatus = 'free' | 'trial' | 'paid' | 'expired';

export interface TrialState {
    status: UserStatus;
    plan: SubscriptionPlan | null;
    trialStartDate: string | null;   // ISO string
    trialEndDate: string | null;     // ISO string
    paidSince: string | null;        // ISO string
    aiQuestionsUsed: number;         // For free (non-trial) users – max 2
    userEmail: string | null;
    userName: string | null;
}

const STORAGE_KEY = 'medq_learn_trial';
const FREE_AI_LIMIT = 2;
const TRIAL_DAYS = 7;

function loadState(): TrialState {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw) as TrialState;
    } catch { /* ignore */ }
    return {
        status: 'free',
        plan: null,
        trialStartDate: null,
        trialEndDate: null,
        paidSince: null,
        aiQuestionsUsed: 0,
        userEmail: null,
        userName: null,
    };
}

function saveState(state: TrialState) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/** Returns days remaining in trial (0 if expired/not in trial) */
export function getTrialDaysRemaining(trialEndDate: string | null): number {
    if (!trialEndDate) return 0;
    const end = new Date(trialEndDate).getTime();
    const now = Date.now();
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
}

export function useTrialStore() {
    const [state, setState] = useState<TrialState>(loadState);

    // Resolve trial expiry on mount / state change
    useEffect(() => {
        if (state.status === 'trial' && state.trialEndDate) {
            const isExpired = new Date(state.trialEndDate).getTime() < Date.now();
            if (isExpired) {
                const next = { ...state, status: 'expired' as UserStatus };
                saveState(next);
                setState(next);
            }
        }
    }, [state]);

    const update = useCallback((patch: Partial<TrialState>) => {
        setState(prev => {
            const next = { ...prev, ...patch };
            saveState(next);
            return next;
        });
    }, []);

    /** Activate a 7-day trial for the given user. */
    const startTrial = useCallback((email: string, name: string, plan: SubscriptionPlan = 'individual') => {
        const now = new Date();
        const end = new Date(now.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000);
        update({
            status: 'trial',
            plan,
            trialStartDate: now.toISOString(),
            trialEndDate: end.toISOString(),
            paidSince: null,
            aiQuestionsUsed: 0,
            userEmail: email,
            userName: name,
        });
    }, [update]);

    /** Convert current trial/user to a paid subscriber. */
    const subscribe = useCallback((plan: SubscriptionPlan = 'individual') => {
        update({
            status: 'paid',
            plan,
            paidSince: new Date().toISOString(),
        });
    }, [update]);

    /** Cancel and reset to free (simulate cancellation). */
    const cancelSubscription = useCallback(() => {
        const next: TrialState = {
            status: 'free',
            plan: null,
            trialStartDate: null,
            trialEndDate: null,
            paidSince: null,
            aiQuestionsUsed: 0,
            userEmail: null,
            userName: null,
        };
        saveState(next);
        setState(next);
    }, []);

    /** Increment AI chatbot use for free users; returns false if limit reached. */
    const useAiQuestion = useCallback((): boolean => {
        if (state.status !== 'free') return true; // unlimited for trial/paid
        if (state.aiQuestionsUsed >= FREE_AI_LIMIT) return false;
        update({ aiQuestionsUsed: state.aiQuestionsUsed + 1 });
        return true;
    }, [state, update]);

    const isPremium = state.status === 'trial' || state.status === 'paid';
    const trialDaysLeft = getTrialDaysRemaining(state.trialEndDate);
    const aiQuestionsLeft = state.status === 'free' ? Math.max(0, FREE_AI_LIMIT - state.aiQuestionsUsed) : Infinity;

    return {
        state,
        isPremium,
        trialDaysLeft,
        aiQuestionsLeft,
        FREE_AI_LIMIT,
        startTrial,
        subscribe,
        cancelSubscription,
        useAiQuestion,
        update,
    };
}

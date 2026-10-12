import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../components/ProtectedRoute';

type SubscriptionStatus = 'none' | 'trial' | 'active' | 'expired';
type SubscriptionPlan = 'individual' | 'family' | 'plus';

interface SubscriptionData {
    status: SubscriptionStatus;
    plan: SubscriptionPlan;
    trialStartDate?: string;
    trialEndDate?: string;
    nextBillingDate?: string;
}

interface SubscriptionContextType {
    subscription: SubscriptionData;
    startTrial: (plan: SubscriptionPlan) => void;
    upgradePlan: (plan: SubscriptionPlan) => void;
    cancelSubscription: () => void;
    isPremium: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isLoggedIn, user } = useAuth();
    const [subscription, setSubscription] = useState<SubscriptionData>({
        status: 'none',
        plan: 'individual'
    });

    useEffect(() => {
        if (isLoggedIn && user?.email) {
            const savedSubscription = localStorage.getItem(`sub_${user.email}`);
            if (savedSubscription) {
                try {
                    setSubscription(JSON.parse(savedSubscription));
                } catch {
                    localStorage.removeItem(`sub_${user.email}`);
                }
            } else {
                // Check if user should have a trial (strategy says everyone starts with 7-day trial after signup)
                // For now, we'll let them manually start it or auto-start on first premium action
            }
        }
    }, [isLoggedIn, user?.email]);

    const startTrial = (plan: SubscriptionPlan) => {
        const now = new Date();
        const end = new Date();
        end.setDate(now.getDate() + 7);

        const newSub: SubscriptionData = {
            status: 'trial',
            plan,
            trialStartDate: now.toISOString(),
            trialEndDate: end.toISOString(),
            nextBillingDate: end.toISOString()
        };

        setSubscription(newSub);
        if (user?.email) {
            localStorage.setItem(`sub_${user.email}`, JSON.stringify(newSub));
        }
    };

    const upgradePlan = (plan: SubscriptionPlan) => {
        const newSub = { ...subscription, plan, status: 'active' as SubscriptionStatus };
        setSubscription(newSub);
        if (user?.email) {
            localStorage.setItem(`sub_${user.email}`, JSON.stringify(newSub));
        }
    };

    const cancelSubscription = () => {
        const newSub = { ...subscription, status: 'expired' as SubscriptionStatus };
        setSubscription(newSub);
        if (user?.email) {
            localStorage.setItem(`sub_${user.email}`, JSON.stringify(newSub));
        }
    };

    const isPremium = subscription.status === 'trial' || subscription.status === 'active';

    return (
        <SubscriptionContext.Provider value={{ subscription, startTrial, upgradePlan, cancelSubscription, isPremium }}>
            {children}
        </SubscriptionContext.Provider>
    );
};

export const useSubscription = () => {
    const context = useContext(SubscriptionContext);
    if (context === undefined) {
        throw new Error('useSubscription must be used within a SubscriptionProvider');
    }
    return context;
};

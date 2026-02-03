import * as React from 'react';
import { createContext, useContext, useCallback } from 'react';
import { router, usePage } from '@inertiajs/react';
import { OnboardingState, SharedData } from '@/types';

type OnboardingPage = keyof OnboardingState;

interface OnboardingContextType {
    showOnboarding: boolean;
    onboardingState: OnboardingState;
    hasSeenPage: (page: OnboardingPage) => boolean;
    markPageAsSeen: (page: OnboardingPage) => void;
    skipAll: () => void;
    resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function useOnboarding() {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error('useOnboarding must be used within an OnboardingProvider');
    }
    return context;
}

interface OnboardingProviderProps {
    children: React.ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
    const { show_onboarding, onboarding_state } = usePage<SharedData>().props;

    const hasSeenPage = useCallback((page: OnboardingPage): boolean => {
        return onboarding_state?.[page] === true;
    }, [onboarding_state]);

    const markPageAsSeen = useCallback((page: OnboardingPage) => {
        router.post(route('onboarding.mark-page-seen'), { page }, {
            preserveScroll: true,
            preserveState: true,
        });
    }, []);

    const skipAll = useCallback(() => {
        router.post(route('onboarding.skip-all'), {}, {
            preserveScroll: true,
            preserveState: true,
        });
    }, []);

    const resetOnboarding = useCallback(() => {
        router.post(route('onboarding.reset'), {}, {
            preserveScroll: true,
            preserveState: true,
        });
    }, []);

    return (
        <OnboardingContext.Provider
            value={{
                showOnboarding: show_onboarding,
                onboardingState: onboarding_state ?? {},
                hasSeenPage,
                markPageAsSeen,
                skipAll,
                resetOnboarding,
            }}
        >
            {children}
        </OnboardingContext.Provider>
    );
}

export type { OnboardingPage };

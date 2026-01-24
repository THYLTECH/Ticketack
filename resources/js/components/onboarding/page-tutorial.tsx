import * as React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { OnboardingPage, useOnboarding } from './onboarding-provider';
import { OnboardingCard } from './onboarding-card';
import { OnboardingSpotlight } from './onboarding-spotlight';

export interface OnboardingStep {
    id: string;
    title: string;
    description: React.ReactNode;
    targetSelector?: string;
    position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
    onNext?: () => void;
    onPrev?: () => void;
    onEnter?: () => void;
    disableScroll?: boolean;
}

interface PageTutorialProps {
    page: OnboardingPage;
    steps?: OnboardingStep[];
    startTrigger?: boolean;
    onActiveChange?: (isActive: boolean) => void;
}

interface SpotlightRect {
    top: number;
    left: number;
    width: number;
    height: number;
}

import { useTutorials } from '@/config/tutorials';

export function PageTutorial({ page, steps: propSteps, startTrigger = true, onActiveChange }: PageTutorialProps) {
    const { showOnboarding, hasSeenPage, markPageAsSeen } = useOnboarding();
    const tutorials = useTutorials();

    const steps = React.useMemo(() => {
        return propSteps || tutorials[page] || [];
    }, [propSteps, tutorials, page]);

    const [currentStep, setCurrentStep] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [spotlightRect, setSpotlightRect] = useState<SpotlightRect | null>(null);

    const rafRef = useRef<number | null>(null);
    const lastRectRef = useRef<string>('');
    const currentStepRef = useRef(currentStep);

    const isFirstTime = !hasSeenPage(page);
    const hasSeenWelcome = hasSeenPage('welcome');

    useEffect(() => {
        currentStepRef.current = currentStep;
        lastRectRef.current = '';
    }, [currentStep]);

    useEffect(() => {
        onActiveChange?.(isActive);
    }, [isActive, onActiveChange]);

    useEffect(() => {
        if (!hasSeenWelcome && page !== 'welcome') return;

        if (showOnboarding && isFirstTime && startTrigger && !isActive) {
            const timer = setTimeout(() => setIsActive(true), 800);
            return () => clearTimeout(timer);
        }
    }, [showOnboarding, isFirstTime, startTrigger, isActive, hasSeenWelcome, page]);

    const updateSpotlight = useCallback((isInitial = false) => {
        if (!isActive) return;

        const step = steps[currentStepRef.current];
        if (!step?.targetSelector) {
            setSpotlightRect(null);
            return;
        }

        const performUpdate = () => {
            const element = document.querySelector(step.targetSelector!);

            if (element) {
                const rect = element.getBoundingClientRect();
                const rectKey = `${currentStepRef.current}-${Math.round(rect.top)},${Math.round(rect.left)},${Math.round(rect.width)},${Math.round(rect.height)}`;

                if (lastRectRef.current !== rectKey || isInitial) {
                    setSpotlightRect({
                        top: rect.top,
                        left: rect.left,
                        width: rect.width,
                        height: rect.height,
                    });
                    lastRectRef.current = rectKey;
                }

                if (isInitial && !step.disableScroll) {
                    const isInViewport = (
                        rect.top >= 0 &&
                        rect.left >= 0 &&
                        rect.bottom <= window.innerHeight &&
                        rect.right <= window.innerWidth
                    );

                    if (!isInViewport) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
                    }
                }
            } else if (isInitial) {
                setSpotlightRect(null);
            }
        };

        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
        }
        rafRef.current = requestAnimationFrame(performUpdate);
    }, [isActive, steps]);

    useEffect(() => {
        if (!isActive) return;

        const step = steps[currentStep];
        if (!step?.targetSelector) {
            setSpotlightRect(null);
            return;
        }

        let attempts = 0;
        const maxAttempts = 15;
        let timeoutId: NodeJS.Timeout;

        const findLoop = () => {
            const element = document.querySelector(step.targetSelector!);
            if (element) {
                updateSpotlight(true);
            } else if (attempts < maxAttempts) {
                attempts++;
                timeoutId = setTimeout(findLoop, 200);
            } else {
                setSpotlightRect(null);
            }
        };

        findLoop();

        return () => {
            clearTimeout(timeoutId);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [isActive, currentStep, steps, updateSpotlight]);

    useEffect(() => {
        if (!isActive) return;

        const handler = () => updateSpotlight(false);

        window.addEventListener('resize', handler);
        window.addEventListener('scroll', handler, true);

        return () => {
            window.removeEventListener('resize', handler);
            window.removeEventListener('scroll', handler, true);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [isActive, updateSpotlight]);

    useEffect(() => {
        if (isActive && steps[currentStep]?.onEnter) {
            steps[currentStep].onEnter();
        }
    }, [isActive, currentStep, steps]);

    const handleNext = () => {
        steps[currentStep]?.onNext?.();
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleComplete();
        }
    };

    const handlePrev = () => {
        steps[currentStep]?.onPrev?.();
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleComplete = () => {
        setIsActive(false);
        markPageAsSeen(page);
    };

    if (!isActive || !steps[currentStep]) return null;

    return (
        <>
            <OnboardingSpotlight
                isActive={isActive}
                rect={spotlightRect}
                onBackdropClick={handleComplete}
            />
            <OnboardingCard
                step={steps[currentStep]}
                currentStepIndex={currentStep}
                totalSteps={steps.length}
                spotlightRect={spotlightRect}
                onNext={handleNext}
                onPrev={handlePrev}
                onSkip={handleComplete}
            />
        </>
    );
}

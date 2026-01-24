import * as React from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { useTrans } from '@/lib/translation';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { OnboardingStep } from './page-tutorial';

interface SpotlightRect {
    top: number;
    left: number;
    width: number;
    height: number;
}

interface OnboardingCardProps {
    step: OnboardingStep;
    currentStepIndex: number;
    totalSteps: number;
    spotlightRect: SpotlightRect | null;
    onNext: () => void;
    onPrev: () => void;
    onSkip: () => void;
}

export function OnboardingCard({
    step,
    currentStepIndex,
    totalSteps,
    spotlightRect,
    onNext,
    onPrev,
    onSkip,
}: OnboardingCardProps) {
    const __ = useTrans();
    const isFirstStep = currentStepIndex === 0;
    const isLastStep = currentStepIndex === totalSteps - 1;
    const [cardPosition, setCardPosition] = React.useState<React.CSSProperties>({});

    React.useEffect(() => {
        const updatePosition = () => {
            if (!spotlightRect) {
                setCardPosition({
                    top: '50%',
                    left: '50%',
                    position: 'fixed',
                    transform: 'translate(-50%, -50%)',
                });
                return;
            }

            const gap = 16;
            const cardWidth = 320;
            const cardHeight = 160;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const preferred = step.position || 'bottom';

            const checkFit = (pos: string): { fits: boolean; top: number; left: number; transform: string } => {
                let t = 0, l = 0, tr = '';

                switch (pos) {
                    case 'top':
                        t = spotlightRect.top - gap;
                        l = spotlightRect.left + spotlightRect.width / 2;
                        tr = 'translate(-50%, -100%)';
                        break;
                    case 'bottom':
                        t = spotlightRect.top + spotlightRect.height + gap;
                        l = spotlightRect.left + spotlightRect.width / 2;
                        tr = 'translate(-50%, 0)';
                        break;
                    case 'left':
                        t = spotlightRect.top + spotlightRect.height / 2;
                        l = spotlightRect.left - gap;
                        tr = 'translate(-100%, -50%)';
                        break;
                    case 'right':
                        t = spotlightRect.top + spotlightRect.height / 2;
                        l = spotlightRect.left + spotlightRect.width + gap;
                        tr = 'translate(0, -50%)';
                        break;
                    default:
                        return { fits: true, top: viewportHeight / 2, left: viewportWidth / 2, transform: 'translate(-50%, -50%)' };
                }

                const topEdge = pos === 'top' ? t - cardHeight : (pos === 'bottom' ? t : t - cardHeight / 2);
                const bottomEdge = pos === 'bottom' ? t + cardHeight : (pos === 'top' ? t : t + cardHeight / 2);
                const leftEdge = pos === 'left' ? l - cardWidth : (pos === 'right' ? l : l - cardWidth / 2);
                const rightEdge = pos === 'right' ? l + cardWidth : (pos === 'left' ? l : l + cardWidth / 2);

                const fits = topEdge >= 10 && bottomEdge <= viewportHeight - 10 && leftEdge >= 10 && rightEdge <= viewportWidth - 10;
                return { fits, top: t, left: l, transform: tr };
            };

            let result = checkFit(preferred);
            if (!result.fits) {
                for (const p of ['bottom', 'top', 'right', 'left']) {
                    if (p === preferred) continue;
                    const attempt = checkFit(p);
                    if (attempt.fits) {
                        result = attempt;
                        break;
                    }
                }
            }

            if (!result.fits) {
                result = { fits: true, top: viewportHeight / 2, left: viewportWidth / 2, transform: 'translate(-50%, -50%)' };
            }

            let finalLeft = result.left;
            if (result.transform.includes('translate(-50%')) {
                if (finalLeft - cardWidth / 2 < 10) finalLeft = cardWidth / 2 + 10;
                if (finalLeft + cardWidth / 2 > viewportWidth - 10) finalLeft = viewportWidth - cardWidth / 2 - 10;
            }

            setCardPosition({
                top: result.top,
                left: finalLeft,
                position: 'fixed',
                transform: result.transform,
            });
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition);

        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition);
        };
    }, [spotlightRect, step.position]);

    const cardContent = (
        <div
            className={cn(
                'z-[100005] w-[320px] max-w-[90vw] pointer-events-auto',
                'animate-in fade-in zoom-in-95 duration-200'
            )}
            style={cardPosition}
        >
            <div className="rounded-lg border bg-card text-card-foreground shadow-lg">
                <div className="flex items-start justify-between p-4 pb-2">
                    <div className="space-y-1">
                        <h4 className="text-sm font-semibold leading-none">
                            {step.title}
                        </h4>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 -mt-1 -mr-1"
                        onClick={onSkip}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="px-4 pb-4">
                    <p className="text-sm text-muted-foreground">
                        {step.description}
                    </p>
                </div>

                <div className="flex items-center justify-between border-t px-4 py-3">
                    <div className="flex gap-1">
                        {Array.from({ length: totalSteps }).map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    'h-1.5 w-1.5 rounded-full',
                                    i === currentStepIndex ? 'bg-primary' : 'bg-muted'
                                )}
                            />
                        ))}
                    </div>

                    <div className="flex gap-2">
                        {!isFirstStep && (
                            <Button variant="ghost" size="sm" onClick={onPrev}>
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                {__('onboarding.actions.previous')}
                            </Button>
                        )}
                        <Button size="sm" onClick={onNext}>
                            {isLastStep ? __('onboarding.actions.finish') : __('onboarding.actions.next')}
                            {!isLastStep && <ChevronRight className="h-4 w-4 ml-1" />}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(cardContent, document.body);
}

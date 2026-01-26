import * as React from 'react';
import { createPortal } from 'react-dom';

interface OnboardingSpotlightProps {
    isActive: boolean;
    rect: {
        top: number;
        left: number;
        width: number;
        height: number;
    } | null;
    onBackdropClick: () => void;
}

export function OnboardingSpotlight({ isActive, rect, onBackdropClick }: OnboardingSpotlightProps) {
    if (!isActive) return null;

    const padding = 4;
    const paddedRect = rect ? {
        top: rect.top - padding,
        left: rect.left - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
    } : null;

    const large = 100000;
    const overlayPath = `M-${large},-${large}H${large}V${large}H-${large}Z ${paddedRect
            ? `M${paddedRect.left},${paddedRect.top}h${paddedRect.width}v${paddedRect.height}h-${paddedRect.width}Z`
            : ''
        }`;

    const overlayContent = (
        <div className="fixed inset-0 z-[100000] pointer-events-none">
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <path
                    d={overlayPath}
                    fill="rgba(0, 0, 0, 0.5)"
                    fillRule="evenodd"
                    onClick={onBackdropClick}
                    className="pointer-events-auto cursor-pointer"
                />
            </svg>

            {paddedRect && (
                <div
                    className="absolute rounded-lg ring-2 ring-primary pointer-events-none transition-all duration-300"
                    style={{
                        top: paddedRect.top,
                        left: paddedRect.left,
                        width: paddedRect.width,
                        height: paddedRect.height,
                    }}
                />
            )}
        </div>
    );

    return createPortal(overlayContent, document.body);
}

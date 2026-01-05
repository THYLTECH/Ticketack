import { Asset, TicketCategory, TicketPriority, TicketStatus } from '@/types';
import type { LucideIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { ReactNode } from 'react';

export function getIcon(
    icon: string,
    props?: Record<string, unknown>,
): React.JSX.Element | null {
    const normalized = icon
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');

    const icons = LucideIcons as unknown as Record<string, LucideIcon>;
    const Icon = icons[normalized];

    if (!Icon) return null;

    return <Icon {...props} />;
}

export function renderAsset(
    asset: Asset | null | undefined,
    show_indentation?: boolean,
): ReactNode {
    if (!asset) {
        return <span className="text-muted-foreground">-</span>;
    }

    const renderOption = (currentAsset: Asset, indent: boolean) => {
        if (!indent) {
            return currentAsset.title;
        }

        const depthLevel = currentAsset.depth_level || 0;
        const indentation = '\u00A0'.repeat(depthLevel * 4);

        return `${indentation}${currentAsset.title}`;
    };

    return (
        <span className="flex items-center gap-2">
            {asset.icon &&
                getIcon(asset.icon, {
                    className: 'text-muted-foreground',
                    size: 16,
                })}
            {renderOption(asset, show_indentation ?? true)}
        </span>
    );
}

export function renderTicketPriority(priority: TicketPriority): ReactNode {
    return (
        <span className="flex items-center gap-2">
            <LucideIcons.Flag color={priority.color} size={16} />
            {priority.title}
        </span>
    );
}

export function renderTicketStatus(status: TicketStatus): ReactNode {
    const size = 16;
    const strokeWidth = 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - status.progress / 100);

    return (
        <span className="flex items-center gap-2">
            <svg width={size} height={size} className="rotate-[-90deg]">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="var(--accent)"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={status.color}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                />
            </svg>
            {status.title}
        </span>
    );
}

export function renderTicketCategory(category: TicketCategory): ReactNode {
    return (
        <span className="flex items-center gap-2">
            {category.icon &&
                getIcon(category.icon, { color: category.color, size: 16 })}
            {category.title}
        </span>
    );
}

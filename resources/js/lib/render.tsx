import { Asset, TicketCategory, TicketPriority, TicketStatus } from '@/types';
import type { LucideIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { ReactNode } from 'react';

export function getIcon(
    icon: string,
    props?: Record<string, unknown>,
): React.JSX.Element | null {
    // 👈 CHANGER LE TYPE DE RETOUR
    const normalized = icon
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');

    const icons = LucideIcons as unknown as Record<string, LucideIcon>;

    const Icon = icons[normalized];

    if (!Icon) return null;

    // 👈 CORRECTION : Retourner l'élément JSX en utilisant la syntaxe <Icon />
    return <Icon {...props} />;
}

// ---------------------------------------
//  Asset Utils
// ---------------------------------------

export function renderAsset(asset: Asset, show_indentation?: boolean): ReactNode {

    const renderOption = (asset: Asset, show_indentation: boolean) => {
        if(show_indentation === false) {
            return asset.title;
        }

        const depthLevel = asset.depth_level || 0;
        const indentation = '\u00A0'.repeat(depthLevel * 4);

        return `${indentation}${asset.title}`;
    };

    return (
        <span className="flex items-center gap-2">
            {asset.icon && getIcon(asset.icon, { className: 'text-muted-foreground', size: 16 })}
            {renderOption(asset, show_indentation ?? true)}
        </span>
    );
}

// ---------------------------------------
//  Ticket Utils
// ---------------------------------------

// DONE
export function renderTicketPriority(priority: TicketPriority): ReactNode {
    return (
        <span className="flex items-center gap-2">
            <LucideIcons.Flag color={priority.color} size={16} />
            {priority.title}
        </span>
    );
}

// DOING - Faire le cercle
export function renderTicketStatus(status: TicketStatus): ReactNode {
    function getProgressCircle(progress: number, color: string) {
        const size = 16;
        const strokeWidth = 2;
        const radius = (size - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference * (1 - progress / 100);

        return (
            <svg width={size} height={size} className="rotate-[-90deg]">
                {/* Cercle de fond */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="var(--accent)"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                {/* Cercle de progression */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                />
            </svg>
        );
    }

    return (
        <span className="flex items-center gap-2">
            {getProgressCircle(status.progress, status.color)}
            {status.title}
        </span>
    );
}

// DONE
export function renderTicketCategory(category: TicketCategory): ReactNode {
    return (
        <span className="flex items-center gap-2">
            {category.icon &&
                getIcon(category.icon, { color: category.color, size: 16 })}
            {category.title}
        </span>
    );
}

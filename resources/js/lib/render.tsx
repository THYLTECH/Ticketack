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
export function renderAsset(asset: Asset): ReactNode {
    const renderOption = (asset: Asset) => {
        const depthLevel = asset.depth_level || 0;
        const indentation = '\u00A0'.repeat(depthLevel * 4);

        return `${indentation}${asset.title}`;
    };

    return (
        <>
            {asset.icon && getIcon(asset.icon)}
            {renderOption(asset)}
        </>
    );
}

// ---------------------------------------
//  Ticket Utils
// ---------------------------------------

// DONE
export function renderTicketPriority(priority: TicketPriority): ReactNode {
    return (
        <span className='flex items-center gap-2'>
            <LucideIcons.Flag color={priority.color} size={16}/>
            {priority.title}
        </span>
    );
}

// DOING - Faire le cercle
export function renderTicketStatus(status: TicketStatus): ReactNode {
    return (
        <span className='flex items-center gap-1'>
            {status.icon ? (
                <>{getIcon(status.icon, { color: status.color })}</>
            ) : (
                <LucideIcons.Circle color={status.color} />
            )}
            {status.title}
        </span>
    );
}

// DONE
export function renderTicketCategory(category: TicketCategory): ReactNode {
    return (
        <>
            {category.icon && getIcon(category.icon, { color: category.color })}
            {category.title}
        </>
    );
}

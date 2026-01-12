import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface MobileCardProps {
    onClick?: () => void;
    children: ReactNode;
    className?: string;
}

/**
 * Reusable mobile card component with hover effects for ticket-like items
 */
export function MobileCard({ onClick, children, className }: MobileCardProps) {
    return (
        <Card
            className={cn(
                'group relative overflow-hidden transition-all duration-300',
                'hover:shadow-lg hover:-translate-y-0.5 border-border/60',
                'bg-linear-to-br from-card to-card/80',
                onClick && 'cursor-pointer',
                className,
            )}
            onClick={onClick}
        >
            <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="relative p-4 space-y-3">
                {children}
            </CardContent>
        </Card>
    );
}

interface MobileCardHeaderProps {
    left: ReactNode;
    right?: ReactNode;
}

/**
 * Header row for mobile card with left/right content
 */
export function MobileCardHeader({ left, right }: MobileCardHeaderProps) {
    return (
        <div className="flex items-start justify-between gap-3">
            {left}
            {right}
        </div>
    );
}

interface MobileCardIdBadgeProps {
    id: number | string;
    icon?: ReactNode;
}

/**
 * ID badge component for mobile cards
 */
export function MobileCardIdBadge({ id, icon }: MobileCardIdBadgeProps) {
    return (
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-muted/40 group-hover:bg-muted/60 transition-colors min-w-0">
            {icon}
            <span className="font-mono text-xs font-semibold text-foreground truncate">
                {id}
            </span>
        </div>
    );
}

interface MobileCardTitleProps {
    children: ReactNode;
}

/**
 * Title component for mobile cards
 */
export function MobileCardTitle({ children }: MobileCardTitleProps) {
    return (
        <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {children}
        </h3>
    );
}

interface MobileCardMetaProps {
    children: ReactNode;
}

/**
 * Meta info row for mobile cards
 */
export function MobileCardMeta({ children }: MobileCardMetaProps) {
    return (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
            {children}
        </div>
    );
}

interface MobileCardMetaItemProps {
    icon: ReactNode;
    children: ReactNode;
}

/**
 * Individual meta item with icon
 */
export function MobileCardMetaItem({ icon, children }: MobileCardMetaItemProps) {
    return (
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/40">
            {icon}
            <span className="font-medium">{children}</span>
        </div>
    );
}

interface MobileCardActionsProps {
    children: ReactNode;
}

/**
 * Actions row for mobile cards (with click propagation stopped)
 */
export function MobileCardActions({ children }: MobileCardActionsProps) {
    return (
        <div
            className="flex gap-2 pt-2 border-t border-border/50"
            onClick={(e) => e.stopPropagation()}
        >
            {children}
        </div>
    );
}


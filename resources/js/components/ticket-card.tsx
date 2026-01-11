import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface TicketCardProps {
    onClick?: () => void;
    className?: string;
    header?: ReactNode;
    badge?: ReactNode;
    title: string;
    metadata?: ReactNode[];
    content?: ReactNode;
    footerLeft?: ReactNode;
    footerRight?: ReactNode;
}

export function TicketCard({
    onClick,
    className,
    header,
    badge,
    title,
    metadata = [],
    content,
    footerLeft,
    footerRight,
}: TicketCardProps) {
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
                {(header || badge) && (
                    <div className="flex items-start justify-between gap-2">
                        {header && <div className="flex-1">{header}</div>}
                        {badge && <div className="shrink-0">{badge}</div>}
                    </div>
                )}

                <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                    {title}
                </h3>

                {metadata.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {metadata.map((item, index) => (
                            <div key={index}>{item}</div>
                        ))}
                    </div>
                )}

                {content && <div>{content}</div>}

                {/* Footer */}
                {(footerLeft || footerRight) && (
                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                        {footerLeft && <div className="flex-1">{footerLeft}</div>}
                        {footerRight && <div className="shrink-0" onClick={(e) => e.stopPropagation()}>{footerRight}</div>}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

/**
 * Header badge component (for ID, date, etc.)
 */
export function CardHeaderBadge({ icon, children, className }: { icon?: ReactNode; children: ReactNode; className?: string }) {
    return (
        <div className={cn(
            'flex items-center gap-2 px-2.5 py-1 rounded-md',
            'bg-muted/40 group-hover:bg-muted/60 transition-colors',
            className
        )}>
            {icon}
            {children}
        </div>
    );
}

/**
 * Footer info component (for author, date, etc.)
 */
export function CardFooterInfo({ icon, children, className }: { icon?: ReactNode; children: ReactNode; className?: string }) {
    return (
        <div className={cn(
            'flex items-center gap-1.5 px-2 py-1 rounded-md',
            'bg-muted/40 text-xs text-muted-foreground',
            className
        )}>
            {icon}
            <span className="font-medium">{children}</span>
        </div>
    );
}


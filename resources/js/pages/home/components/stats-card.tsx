import { cn } from '@/lib/utils';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface StatsCardProps {
    title: string;
    value: number | string;
    icon: LucideIcon;
    description?: string;
    tooltip?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    colorClass?: string;
    onClick?: () => void;
}

export function StatsCard({
    title,
    value,
    icon: Icon,
    description,
    tooltip,
    trend,
    colorClass = 'text-primary',
    onClick,
}: StatsCardProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div
                    onClick={onClick}
                    className={cn(
                        'group relative overflow-hidden rounded-2xl border border-border/50 p-4 sm:p-6 transition-all duration-300',
                        'bg-background/50 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60',
                        'dark:bg-muted/10 dark:border-white/5 dark:hover:bg-muted/20',
                        'hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20',
                        onClick && 'cursor-pointer active:scale-[0.98]'
                    )}
                >
                    <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/20 to-transparent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-40" />

                    <div className="relative flex items-start justify-between gap-3 sm:gap-0">
                        <div className="space-y-2 sm:space-y-4 min-w-0">
                            <div className="space-y-1">
                                <p className="text-xs sm:text-sm font-medium text-muted-foreground/80 truncate">{title}</p>
                                <div className="flex flex-wrap items-baseline gap-2">
                                    <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{value}</p>
                                    {trend && (
                                        <div className={cn(
                                            'flex items-center gap-0.5 text-[10px] sm:text-xs font-medium rounded-full px-1.5 py-0.5',
                                            trend.isPositive
                                                ? 'text-emerald-500 bg-emerald-500/10'
                                                : 'text-rose-500 bg-rose-500/10'
                                        )}>
                                            {trend.isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                            {trend.value}%
                                        </div>
                                    )}
                                </div>
                            </div>

                            {description && (
                                <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1">
                                    {description}
                                </p>
                            )}
                        </div>

                        <div className={cn(
                            'relative flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300',
                            'bg-muted/50 group-hover:bg-primary/10 dark:bg-white/5',
                            'ring-1 ring-white/10 dark:ring-white/5',
                            colorClass
                        )}>
                            <Icon className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                        </div>
                    </div>
                </div>
            </TooltipTrigger>
            {(tooltip || description) && (
                <TooltipContent side="bottom" className="text-xs max-w-[250px] text-center">
                    <p>{tooltip || description}</p>
                </TooltipContent>
            )}
        </Tooltip>
    );
}

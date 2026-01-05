import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useTrans } from '@/lib/translation';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle2,
    FileIcon,
    FileImage,
    FileText,
    Sparkles,
    Ticket,
    Trophy,
} from 'lucide-react';
import { SearchResult } from '../types';

const TypeIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'pdf':
            return <FileText className="h-4 w-4 text-red-500" />;
        case 'image':
            return <FileImage className="h-4 w-4 text-blue-500" />;
        case 'ticket':
            return <Ticket className="h-4 w-4 text-emerald-500" />;
        default:
            return <FileIcon className="h-4 w-4 text-gray-500" />;
    }
};

const ScoreBadge = ({
    score,
    isFeatured,
}: {
    score: number;
    isFeatured: boolean;
}) => {
    const trans = useTrans();
    const __ = (key: string): string => trans(key) as string;

    const percentage = Math.round(score * 100);

    let colorClass = 'bg-muted text-muted-foreground border-border';
    let iconClass = 'text-muted-foreground';

    if (isFeatured) {
        colorClass =
            'bg-amber-50 text-amber-700 border-amber-500/60 shadow-sm dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-500/50';
        iconClass = 'text-amber-500 fill-amber-500/20';
    } else {
        colorClass =
            'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400';
        iconClass = 'text-emerald-600 dark:text-emerald-400';
    }


    return (
        <span
            className={cn(
                'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition-colors',
                colorClass,
            )}
        >
            <Sparkles className={cn('h-3 w-3', iconClass)} />
            {percentage}% {__('knowledge.results.relevance')}
        </span>
    );
};

interface Props {
    result: SearchResult & { solution?: string; has_solution?: boolean };
    isFeatured?: boolean;
}

export function ResultCard({ result, isFeatured = false }: Props) {
    const trans = useTrans();
    const __ = (key: string): string => trans(key) as string;

    const hasSolution = Boolean(result.solution || result.has_solution);

    if (isFeatured) {
        return (
            <Card className="group relative col-span-1 flex flex-col overflow-hidden border-emerald-500/50 bg-gradient-to-br from-emerald-50/50 via-background to-background shadow-[0_0_40px_-10px_rgba(16,185,129,0.2)] transition-all hover:border-emerald-500 hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.3)] md:col-span-2 dark:from-emerald-950/20 dark:via-background dark:to-background">
                <Link
                    href={route('tickets.show', result.ticket_id)}
                    className="absolute inset-0 z-10"
                >
                    <span className="sr-only">
                        {__('knowledge.buttons.view_ticket')}
                    </span>
                </Link>

                <div className="absolute top-0 right-0 p-4">
                    <Badge className="gap-1.5 border-none bg-emerald-600 text-white shadow-sm hover:bg-emerald-700">
                        <Trophy className="h-3.5 w-3.5" />
                        {__('knowledge.results.best_match')}
                    </Badge>
                </div>

                <div className="flex flex-col p-6 sm:p-8">
                    <div className="mb-4 flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-100/50 text-emerald-600 dark:border-emerald-800 dark:bg-emerald-900/30">
                            <TypeIcon type={result.type} />
                        </div>
                        <div className="min-w-0 flex-1 pt-1">
                            <h3 className="line-clamp-1 text-xl font-bold text-foreground transition-colors group-hover:text-emerald-700">
                                {result.title}
                            </h3>
                            <div className="mt-1.5 flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="font-medium text-foreground">
                                    {result.author.name}
                                </span>
                                <span>•</span>
                                <span>
                                    {new Date(
                                        result.created_at,
                                    ).toLocaleDateString('fr-FR', {
                                        dateStyle: 'long',
                                    })}
                                </span>
                                <span>•</span>
                                <ScoreBadge
                                    score={result.score}
                                    isFeatured={true}
                                />
                            </div>
                        </div>
                    </div>

                    <div
                        className={cn(
                            'grid gap-6',
                            hasSolution ? 'md:grid-cols-2' : 'grid-cols-1',
                        )}
                    >
                        <div className="relative overflow-hidden rounded-lg border border-border/50 bg-background/50 p-4">
                            <p
                                className="line-clamp-4 text-sm leading-relaxed text-muted-foreground"
                                dangerouslySetInnerHTML={{
                                    __html: result.snippet,
                                }}
                            />
                        </div>

                        {hasSolution && (
                            <div className="relative overflow-hidden rounded-lg border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-800/50 dark:bg-emerald-950/20">
                                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                                    <CheckCircle2 className="h-4 w-4" />
                                    {__('knowledge.results.solution_available')}
                                </div>
                                <p className="line-clamp-3 text-sm text-muted-foreground italic">
                                    {result.solution ||
                                        __(
                                            'knowledge.results.solution_preview_text',
                                        )}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex items-center justify-end">
                        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 decoration-2 underline-offset-4 group-hover:underline dark:text-emerald-400">
                            {__('knowledge.buttons.view_details')}
                            <ArrowRight className="h-4 w-4" />
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card className="group relative flex flex-col overflow-hidden border-border/60 bg-card transition-all duration-300 hover:border-emerald-500/40 hover:shadow-lg dark:hover:border-emerald-500/30">
            <Link
                href={route('tickets.show', result.ticket_id)}
                className="absolute inset-0 z-10"
            >
                <span className="sr-only">
                    {__('knowledge.buttons.view_ticket')}
                </span>
            </Link>

            <div className="flex h-full flex-col p-5">
                <div className="mb-3 flex items-start justify-between gap-4">
                    <div className="flex min-w-0 flex-1 gap-3">
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border bg-muted/40 transition-colors group-hover:bg-emerald-50 group-hover:text-emerald-600 dark:group-hover:bg-emerald-950/30">
                            <TypeIcon type={result.type} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="truncate text-base font-semibold text-foreground transition-colors group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                                {result.title}
                            </h3>
                            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="truncate">
                                    {result.author.name}
                                </span>
                                <span>•</span>
                                <span>
                                    {new Date(
                                        result.created_at,
                                    ).toLocaleDateString('fr-FR')}
                                </span>
                            </div>
                        </div>
                    </div>
                    <ScoreBadge score={result.score} isFeatured={false} />
                </div>

                <div className="relative mb-auto overflow-hidden rounded-md bg-muted/30 p-3 text-sm text-muted-foreground transition-colors group-hover:bg-muted/50">
                    <div className="absolute top-0 left-0 h-full w-[3px] bg-emerald-500/40 opacity-0 transition-opacity group-hover:opacity-100"></div>
                    <p
                        className="line-clamp-3 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: result.snippet }}
                    />
                </div>

                {hasSolution && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-500">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {__('knowledge.results.solution_available')}
                    </div>
                )}

                <div className="mt-4 flex items-center justify-end border-t border-border/40 pt-3">
                    <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        {__('knowledge.buttons.view_source')}
                        <ArrowRight className="h-3 w-3" />
                    </div>
                </div>
            </div>
        </Card>
    );
}

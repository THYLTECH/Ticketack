import { Card } from '@/components/ui/card';
import { useTrans } from '@/lib/translation';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    FileIcon,
    FileImage,
    FileText,
    Sparkles,
    Ticket,
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

const ScoreBadge = ({ score }: { score: number }) => {
    const percentage = Math.round(score * 100);
    let colorClass = 'bg-muted text-muted-foreground border-border';
    if (score >= 0.9)
        colorClass =
            'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400';
    else if (score >= 0.7)
        colorClass =
            'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400';

    return (
        <span
            className={cn(
                'inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold',
                colorClass,
            )}
        >
            <Sparkles className="h-3 w-3" />
            {percentage}%
        </span>
    );
};

export function ResultCard({ result }: { result: SearchResult }) {
    const trans = useTrans();
    const __ = (key: string): string => trans(key) as string;

    return (
        <Card className="group relative flex flex-col overflow-hidden border-border/60 bg-card transition-all duration-300 hover:border-emerald-500/40 hover:shadow-lg dark:hover:border-emerald-500/30 dark:hover:shadow-emerald-900/10">
            <Link
                href={route('tickets.show', result.ticket_id)}
                className="absolute inset-0 z-10"
            >
                <span className="sr-only">Voir le ticket</span>
            </Link>
            <div className="flex h-full flex-col p-5">
                <div className="mb-3 flex items-start justify-between gap-4">
                    <div className="flex min-w-0 flex-1 gap-3">
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border bg-muted/40 transition-colors group-hover:bg-emerald-50 group-hover:text-emerald-600">
                            <TypeIcon type={result.type} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="truncate text-base font-semibold text-foreground group-hover:text-emerald-700">
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
                    <ScoreBadge score={result.score} />
                </div>
                <div className="relative mb-auto overflow-hidden rounded-md bg-muted/30 p-3 text-sm text-muted-foreground transition-colors group-hover:bg-muted/50">
                    <div className="absolute top-0 left-0 h-full w-[3px] bg-emerald-500/40 opacity-0 transition-opacity group-hover:opacity-100"></div>
                    <p
                        className="line-clamp-3 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: result.snippet }}
                    />
                </div>
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

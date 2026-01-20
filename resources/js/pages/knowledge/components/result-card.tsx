import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useInitials } from '@/hooks/use-initials';
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
import { MarkdownViewer } from '@/components/markdown/markdown-viewer';

const TypeIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'pdf':
            return <FileText className="h-4 w-4 text-red-500" />;
        case 'image':
            return <FileImage className="h-4 w-4 text-blue-500" />;
        case 'ticket':
            return <Ticket className="h-4 w-4 text-primary" />;
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
            'bg-primary/10 text-primary border-primary/20 shadow-sm';
        iconClass = 'text-primary';
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
    const getInitials = useInitials();
    const __ = (key: string): string => trans(key) as string;

    const hasSolution = Boolean(result.solution || result.has_solution);

    const AuthorAvatar = ({ className }: { className?: string }) => (
        <Avatar
            className={cn('shrink-0 overflow-hidden rounded-full', className)}
        >
            <AvatarImage
                src={result.author.avatar ?? undefined}
                alt={result.author.name}
                className="h-full w-full object-cover"
            />
            <AvatarFallback className="flex h-full w-full items-center justify-center bg-neutral-200 text-[9px] font-medium text-black dark:bg-neutral-700 dark:text-white">
                {getInitials(result.author.name)}
            </AvatarFallback>
        </Avatar>
    );

    if (isFeatured) {
        return (
            <Card className="group relative col-span-1 flex flex-col overflow-hidden border-primary/50 bg-gradient-to-br from-primary/5 via-background to-background shadow-[0_0_40px_-10px_hsl(var(--primary)/0.2)] transition-all hover:border-primary hover:shadow-[0_0_60px_-15px_hsl(var(--primary)/0.3)] md:col-span-2">
                <Link
                    href={route('tickets.show', result.ticket_id)}
                    className="absolute inset-0 z-10"
                >
                    <span className="sr-only">
                        {__('knowledge.buttons.view_ticket')}
                    </span>
                </Link>

                <div className="flex flex-col p-6 sm:p-8">
                    <div className="mb-4 flex items-center justify-end gap-2">
                        <ScoreBadge
                            score={result.score}
                            isFeatured={true}
                        />
                        <Badge className="gap-1.5 border-none bg-primary text-primary-foreground shadow-sm hover:bg-primary/90">
                            <Trophy className="h-3.5 w-3.5" />
                            {__('knowledge.results.best_match')}
                        </Badge>
                    </div>

                    <div className="mb-4 flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                            <TypeIcon type={result.type} />
                        </div>
                        <div className="min-w-0 flex-1 pt-1">
                            <h3 className="line-clamp-2 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                                {result.title}
                            </h3>
                            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <AuthorAvatar className="h-5 w-5" />
                                    <span className="font-medium text-foreground">
                                        {result.author.name}
                                    </span>
                                </div>
                                <span className="hidden sm:inline">•</span>
                                <span className="text-xs sm:text-sm">
                                    {new Date(
                                        result.created_at,
                                    ).toLocaleDateString('fr-FR', {
                                        dateStyle: 'long',
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div
                        className={cn(
                            'grid gap-6',
                            result.solution ? 'md:grid-cols-2' : 'grid-cols-1',
                        )}
                    >
                        <div className="relative overflow-hidden rounded-lg border border-border/50 bg-background/50 p-4">
                            <div className="line-clamp-4 text-sm leading-relaxed text-muted-foreground">
                                <MarkdownViewer
                                    content={result.snippet}
                                    proseClass="prose-sm text-muted-foreground"
                                    className="!my-0"
                                />
                            </div>
                        </div>

                        {result.solution && (
                            <div className="relative overflow-hidden rounded-lg border border-primary/20 bg-primary/5 p-4">
                                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
                                    <CheckCircle2 className="h-4 w-4" />
                                    {__('knowledge.results.solution_available')}
                                </div>
                                <div className="max-h-60 overflow-hidden">
                                    <MarkdownViewer
                                        content={result.solution}
                                        proseClass="prose-sm text-muted-foreground italic line-clamp-3"
                                        className="!my-0"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex items-center justify-end">
                        <div className="flex items-center gap-2 text-sm font-semibold text-primary decoration-2 underline-offset-4 group-hover:underline">
                            {__('knowledge.buttons.view_details')}
                            <ArrowRight className="h-4 w-4" />
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card className="group relative flex flex-col overflow-hidden border-border/60 bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-lg">
            <Link
                href={route('tickets.show', result.ticket_id)}
                className="absolute inset-0 z-10"
            >
                <span className="sr-only">
                    {__('knowledge.buttons.view_ticket')}
                </span>
            </Link>
            <div className="flex h-full flex-col p-5">
                <div className="mb-3 flex flex-wrap items-start justify-between gap-2 sm:gap-4">
                    <div className="flex min-w-0 flex-1 gap-3">
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border bg-muted/40 transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                            <TypeIcon type={result.type} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="truncate text-base font-semibold text-foreground transition-colors group-hover:text-primary">
                                {result.title}
                            </h3>
                            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                                <div className="flex min-w-0 items-center gap-1.5">
                                    <AuthorAvatar className="h-4 w-4" />
                                    <span className="truncate max-w-[100px] sm:max-w-none">
                                        {result.author.name}
                                    </span>
                                </div>
                                <span className="hidden xs:inline">•</span>
                                <span className="shrink-0">
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
                    <div className="absolute top-0 left-0 h-full w-[3px] bg-primary/40 opacity-0 transition-opacity group-hover:opacity-100"></div>
                    <div className="line-clamp-3 leading-relaxed">
                        <MarkdownViewer
                            content={result.snippet}
                            proseClass="prose-sm text-muted-foreground"
                            className="!my-0"
                        />
                    </div>
                </div>

                {hasSolution && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-primary">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {__('knowledge.results.solution_available')}
                    </div>
                )}

                <div className="mt-4 flex items-center justify-end border-t border-border/40 pt-3">
                    <div className="flex items-center gap-1 text-xs font-semibold text-primary">
                        {__('knowledge.buttons.view_source')}
                        <ArrowRight className="h-3 w-3" />
                    </div>
                </div>
            </div>
        </Card>
    );
}

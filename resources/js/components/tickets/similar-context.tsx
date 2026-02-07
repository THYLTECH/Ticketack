import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTrans } from '@/lib/translation';
import { Link } from '@inertiajs/react';
import { Sparkles } from 'lucide-react';

interface SimilarTicket {
    id: number;
    title: string;
    similarity: number;
}

export function SimilarContext({ tickets }: { tickets: SimilarTicket[] }) {
    const __ = useTrans();

    if (!tickets || tickets.length === 0) return null;

    return (
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                    {__('knowledge.similar.title')}
                </h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tickets.map((ticket) => (
                    <Card
                        key={ticket.id}
                        className="flex flex-col justify-between p-4 transition-colors hover:border-purple-500/30 hover:bg-purple-50/10"
                    >
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Badge
                                    variant="secondary"
                                    className="bg-purple-100 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300"
                                >
                                    {Math.round(ticket.similarity * 100)}%{' '}
                                    {__('knowledge.similar.match')}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                    #{ticket.id}
                                </span>
                            </div>
                            <h4 className="leading-snug font-medium">
                                {ticket.title}
                            </h4>
                        </div>
                        <Button
                            asChild
                            variant="link"
                            className="mt-2 h-auto justify-start px-0 text-purple-600 dark:text-purple-400"
                        >
                            <Link href={route('tickets.show', ticket.id)}>
                                {__('knowledge.similar.view')}
                            </Link>
                        </Button>
                    </Card>
                ))}
            </div>
        </div>
    );
}

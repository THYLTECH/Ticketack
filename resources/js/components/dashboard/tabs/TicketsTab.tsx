import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Ticket } from 'lucide-react';
import { StatsPieChart } from '@/components/dashboard/StatsPieChart';
import { useTrans } from '@/lib/translation';

interface statsTickets {
    total: number;
    by_status: Array<{ title: string; tickets_count: number; color: string }>;
    by_category: Array<{ title: string; tickets_count: number; color: string }>;
    by_priority: Array<{ title: string; tickets_count: number; color: string }>;
};

export function TicketsTab({ statsTickets }: { statsTickets: statsTickets }) {
    const __ = useTrans();

    const items = [
        { label: __('dashboard.pages.stats.ticket_statistics.by_status'), indicator: __("dashboard.pages.stats.ticket_statistics.indicator.status"), stats: statsTickets.by_status },
        { label: __('dashboard.pages.stats.ticket_statistics.by_priority'), indicator: __("dashboard.pages.stats.ticket_statistics.indicator.priority"), stats: statsTickets.by_priority },
        { label: __('dashboard.pages.stats.ticket_statistics.by_category'), indicator: __("dashboard.pages.stats.ticket_statistics.indicator.category"), stats: statsTickets.by_category },
    ];

    return (
        <div className="space-y-4 pt-4">
            <Card className="flex flex-col items-center justify-center p-6 text-center shadow-sm mb-6">
                <CardHeader className="p-0 pb-2 flex-row justify-center items-center">
                    <Ticket className="size-10 text-primary" />
                </CardHeader>
                <CardContent className="p-0 flex flex-col items-center">
                    <p className="text-sm font-medium text-muted-foreground uppercase">{__('dashboard.pages.stats.ticket_statistics.total_tickets')}</p>
                    <div className="text-4xl font-bold">{statsTickets.total}</div>
                </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {items.map((item, idx) => (
                    <StatsPieChart key={idx} title={item.label} data={item.stats} total={statsTickets.total} indicator={item.indicator} />
                ))}
            </div>
        </div>
    );
};
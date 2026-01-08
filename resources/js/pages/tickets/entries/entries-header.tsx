import { Button } from '@/components/ui/button';
import { useTrans } from '@/lib/translation';
import { FileText, Plus } from 'lucide-react';

interface EntriesHeaderProps {
    onReportClick: () => void;
    onCreateClick: () => void;
}

export function EntriesHeader({
    onReportClick,
    onCreateClick,
}: EntriesHeaderProps) {
    const __ = useTrans();

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    {__('entries.index.title') || 'Time Entries'}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    {__('entries.index.description') ||
                        'Manage time entries and generate reports.'}
                </p>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={onReportClick}>
                    <FileText className="mr-2 h-4 w-4" />
                    {__('entries.header.actions.report') || 'Report'}
                </Button>
                <Button size="sm" onClick={onCreateClick}>
                    <Plus className="mr-2 h-4 w-4" />
                    {__('entries.header.actions.log_time') || 'New Entry'}
                </Button>
            </div>
        </div>
    );
}

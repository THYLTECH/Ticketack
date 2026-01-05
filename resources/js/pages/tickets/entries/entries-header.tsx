import { Button } from '@/components/ui/button';
import { useTrans } from '@/lib/translation';
import { Download, Plus } from 'lucide-react';

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
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    {__('entries.header.title')}
                </h1>
                <p className="text-sm text-muted-foreground">
                    {__('entries.header.description')}
                </p>
            </div>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onReportClick}
                    className="h-9 shadow-sm"
                >
                    <Download className="mr-2 h-4 w-4 text-muted-foreground" />
                    {__('entries.header.actions.report')}
                </Button>
                <Button
                    size="sm"
                    onClick={onCreateClick}
                    className="h-9 shadow-sm"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    {__('entries.header.actions.log_time')}
                </Button>
            </div>
        </div>
    );
}

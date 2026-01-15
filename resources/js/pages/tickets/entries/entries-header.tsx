import { useTrans } from '@/lib/translation';
import { FileText, Plus } from 'lucide-react';
import { HeaderActions, HeaderActionProps, PageHeader } from '../shared';

interface EntriesHeaderProps {
    onReportClick: () => void;
    onCreateClick: () => void;
}

export function EntriesHeader({
    onReportClick,
    onCreateClick,
}: EntriesHeaderProps) {
    const __ = useTrans();

    const actions: HeaderActionProps[] = [
        {
            label: __('entries.header.actions.report') || 'Report',
            icon: FileText,
            onClick: onReportClick,
            variant: 'outline',
        },
        {
            label: __('entries.header.actions.log_time') || 'New Entry',
            icon: Plus,
            onClick: onCreateClick,
        },
    ];

    return (
        <PageHeader
            title={__('entries.index.title') || 'Time Entries'}
            description={__('entries.index.description') || 'Manage time entries and generate reports.'}
            actions={<HeaderActions actions={actions} />}
        />
    );
}

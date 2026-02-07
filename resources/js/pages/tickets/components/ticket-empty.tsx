import { Button } from '@/components/ui/button';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle,
} from '@/components/ui/empty';
import { useTrans } from '@/lib/translation';
import { RefreshCcw, TicketIcon } from 'lucide-react';

interface TicketEmptyProps {
    onClearFilters?: () => void;
}

export function TicketEmpty({ onClearFilters }: TicketEmptyProps) {
    const __ = useTrans();

    return (
        <Empty className="py-16">
            <EmptyHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted/50">
                    <TicketIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <EmptyTitle className="mt-4 text-lg">
                    {__('tickets.pages.index.empty.title')}
                </EmptyTitle>
                <EmptyDescription className="mx-auto max-w-sm">
                    {__('tickets.pages.index.empty.description')}
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="mt-6">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onClearFilters}
                >
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    {__('tickets.pages.index.empty.button')}
                </Button>
            </EmptyContent>
        </Empty>
    );
}

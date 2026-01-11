import { useTrans } from '@/lib/translation';

export function AssignmentHeader() {
    const __ = useTrans();

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    {__('tickets.assignment.page_title')}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    {__('tickets.assignment.page_description')}
                </p>
            </div>
        </div>
    );
}


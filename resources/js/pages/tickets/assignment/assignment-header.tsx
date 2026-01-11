import { useTrans } from '@/lib/translation';

export function AssignmentHeader() {
    const __ = useTrans();

    return (
        <div className="flex flex-col gap-2 sm:gap-4">
            <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    {__('tickets.assignment.page_title')}
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                    {__('tickets.assignment.page_description')}
                </p>
            </div>
        </div>
    );
}


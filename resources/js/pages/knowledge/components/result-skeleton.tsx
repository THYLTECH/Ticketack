import { Skeleton } from '@/components/ui/skeleton';

export const ResultSkeleton = () => (
    <div className="rounded-xl border border-border/60 p-5">
        <div className="flex justify-between gap-4">
            <div className="flex flex-1 gap-3">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/3" />
                </div>
            </div>
            <Skeleton className="h-5 w-12 rounded-full" />
        </div>
        <Skeleton className="mt-4 h-20 w-full rounded-md" />
    </div>
);

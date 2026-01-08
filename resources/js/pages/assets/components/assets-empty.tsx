import { Button } from '@/components/ui/button';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import { useTrans } from '@/lib/translation';
import { Link } from '@inertiajs/react';
import { ListTree, RefreshCcw } from 'lucide-react';

export function AssetsEmpty() {
    const __ = useTrans();

    return (
        <div className="flex min-h-100 animate-in flex-col items-center justify-center p-8 text-center duration-300 zoom-in-95 fade-in">
            <Empty className="border-none shadow-none">
                <EmptyHeader>
                    <EmptyMedia
                        variant="icon"
                        className="mb-4 rounded-full bg-muted/50 p-4"
                    >
                        <ListTree className="h-10 w-10 text-muted-foreground/60" />
                    </EmptyMedia>
                    <EmptyTitle className="text-lg font-semibold text-foreground">
                        {__('assets.pages.index.empty.title')}
                    </EmptyTitle>
                    <EmptyDescription className="max-w-sm text-balance">
                        {__('assets.pages.index.empty.description')}
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent className="mt-6">
                    <Button variant="outline" className="gap-2" asChild>
                        <Link href={route('assets.index')}>
                            <RefreshCcw className="h-4 w-4" />
                            {__('assets.pages.index.empty.button')}
                        </Link>
                    </Button>
                </EmptyContent>
            </Empty>
        </div>
    );
}

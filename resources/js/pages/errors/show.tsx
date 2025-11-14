// resources/js/pages/errors/show.tsx

// Necessary imports
import { Link, usePage } from '@inertiajs/react';

// Translation Hook
import { useTrans } from '@/lib/translation';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Separator } from '@/components/ui/separator';

// Icons
import { ArrowLeft } from 'lucide-react';

// Types
import { SharedData } from '@/types';

export default function ErrorPage({
    statusCode,
    title,
}: {
    statusCode: number;
    title: string | null;
}) {

    const __ = useTrans();
    const { auth } = usePage<SharedData>().props;

    return (
        <main className="flex h-[100vh] w-[100vw] items-center justify-center overflow-hidden">
            <PlaceholderPattern className="absolute inset-0 size-full h-full w-full stroke-muted/50 z-0" />
            <div className='flex items-center flex-col gap-4 relative z-1'>
                <div className='flex items-center gap-4 text-4xl'>
                    <h4>
                        {statusCode}
                    </h4>
                    <Separator orientation='vertical' className='!h-8 !w-0.5 bg-foreground' />
                    <p>
                        {title ?? __(`common.errors.${statusCode}.title`, __('common.errors.default.title'))}
                    </p>
                </div>
                <p className='text-center max-w-lg text-muted-foreground'>
                    {__(`common.errors.${statusCode}.message`, __('common.errors.default.message'))}
                </p>
                <Button asChild variant='secondary' className='mt-4'>
                    <Link href={auth.user ? route('dashboard') : route('home')}>
                        <ArrowLeft />
                        {__('common.errors.button_back')}
                    </Link>
                </Button>
            </div>
        </main>
    );
}

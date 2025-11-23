// resources/js/pages/assets/show.tsx

// Necessary imports
import { Head, Link } from '@inertiajs/react';

// Layout
import Heading from '@/components/heading';
import AppLayout from '@/layouts/app/layout';

// Translation Hook
import { useTrans } from "@/lib/translation";

// Types
import type { BreadcrumbItem, Asset } from "@/types";

// Shadnc UI Components
import { Button } from '@/components/ui/button';

// Icons
import { ArrowLeft } from 'lucide-react';

export default function Show({ asset } : { asset: Asset }) {
    const __ = useTrans();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: __('dashboard.pages.breadcrumbs.dashboard'),
            href: route('dashboard'),
        },
        {
            title: __('assets.pages.breadcrumbs.index'),
            href: route('assets.index'),
        },
        {
            title: __('assets.pages.breadcrumbs.show'),
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('assets.pages.show.head_title', undefined, { title: asset.title })} />

            <Heading
                title={__('assets.pages.show.title', undefined, { title: asset.title })}
                description={__('assets.pages.show.description', undefined, { title: asset.title })}
                action={
                    <Button asChild variant={'secondary'}>
                        <Link href={route('assets.index')}>
                            <ArrowLeft />
                            Go back to assets
                        </Link>
                    </Button>
                }
            />

        </AppLayout>
    );
} 
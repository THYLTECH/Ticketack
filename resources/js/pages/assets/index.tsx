// resources/js/pages/assets/index.tsx

// Necessary imports
import { Head, Link } from '@inertiajs/react';

// Layout
import Heading from '@/components/heading';
import AppLayout from '@/layouts/app/layout';

// Translation Hook
import { useTrans } from '@/lib/translation';

// Types
import type { BreadcrumbItem } from '@/types';

// Shadcn UI Components
import { Button } from '@/components/ui/button';

// Icons
import { Plus } from 'lucide-react';

export default function Index({}) {
    const __ = useTrans();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: __('dashboard.pages.breadcrumbs.dashboard'),
            href: route('dashboard'),
        },
        {
            title: __('assets.pages.breadcrumbs.index'),
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('assets.pages.index.head_title')} />

            <Heading
                title={__('assets.pages.index.title')}
                description={__('assets.pages.index.description')}
                action={
                    <Button asChild>
                        <Link href={route('assets.create')}>
                            <Plus />
                            Create an asset
                        </Link>
                    </Button>
                }
            />
        </AppLayout>
    );
}

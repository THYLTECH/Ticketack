import { Head } from '@inertiajs/react';
import { useTrans } from '@/lib/translation';
import AppLayout from '@/layouts/app/layout';
import { type BreadcrumbItem } from '@/types';

export default function Home() {
    const __ = useTrans();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: __('app.layout.sidebar.menugroups.platform.items.home'),
            href: route('home'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Home" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* TO DO */}
            </div>
        </AppLayout>
    );
}
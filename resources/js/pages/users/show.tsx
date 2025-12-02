// resources/js/pages/users/show.tsx

// Necessary imports
import { userHasPermission } from '@/lib/utils';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

// Layout
import AppLayout from '@/layouts/app/layout';

// Translation Hook
import { useTrans } from '@/lib/translation';

// Custom components
import { InformationsTab } from '@/pages/users/form';

// Shadnc UI Components
import { Button } from '@/components/ui/button';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Types
import type { BreadcrumbItem, Role, SharedData, User } from '@/types';

// Icons
import { ArrowLeft, File, Pen } from 'lucide-react';

export default function Show({ roles, user }: { roles: Role[]; user: User }) {
    const __ = useTrans();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: __('dashboard.pages.breadcrumbs.dashboard'),
            href: route('dashboard'),
        },
        {
            title: __('users.pages.breadcrumbs.index'),
            href: route('users.index'),
        },
        {
            title: __('users.pages.breadcrumbs.show'),
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={__('users.pages.show.head_title', undefined, {
                    name: user.name,
                })}
            />

            <ShowForm existing_roles={roles} user={user} />
        </AppLayout>
    );
}

function ShowForm({
    existing_roles,
    user,
}: {
    existing_roles: Role[];
    user: User;
}) {
    const __ = useTrans();

    const { data, setData, errors } = useForm<{
        name: string;
        email: string;
        phone: string;
        avatar?: File | null;
        roles: string[];
        email_verified: boolean;

        avatar_url?: string | null;
    }>({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        avatar: null,
        roles: (user.roles && user.roles.map((role) => String(role.id))) || [],
        email_verified: user.email_verified_at !== null,

        avatar_url: user.avatar ? user.avatar.url : null,
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {__('users.pages.show.title', undefined, {
                        name: user.name,
                    })}
                </CardTitle>
                <CardDescription>
                    {__('users.pages.show.description')}
                </CardDescription>
                <CardAction className="space-x-2">
                    <Button asChild variant={'secondary'}>
                        <Link href={route('users.index')}>
                            <ArrowLeft />
                            {__('users.pages.form.buttons.back')}
                        </Link>
                    </Button>
                    {userHasPermission({
                        user: usePage<SharedData>().props.auth.user,
                        permission: 'update users',
                    }) && (
                        <Button asChild variant={'default'}>
                            <Link href={route('users.edit', { user: user.id })}>
                                <Pen />
                                {__('users.pages.form.buttons.edit')}
                            </Link>
                        </Button>
                    )}
                </CardAction>
            </CardHeader>
            <Separator />

            <CardContent>
                <Tabs
                    defaultValue={'informations'}
                    className="w-full space-y-4"
                >
                    <TabsList className="hidden w-full">
                        <TabsTrigger value={'informations'}>
                            <File />
                            {__('users.pages.form.tabs.informations')}
                        </TabsTrigger>
                    </TabsList>

                    <InformationsTab
                        data={data}
                        setData={setData}
                        errors={errors}
                        roles={existing_roles}
                        disabled
                    />
                </Tabs>
            </CardContent>
        </Card>
    );
}

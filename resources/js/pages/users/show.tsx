import { userHasPermission } from '@/lib/utils';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app/layout';
import { useTrans } from '@/lib/translation';
import { InformationsTab } from '@/pages/users/form';
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
import type { BreadcrumbItem, Role, SharedData, User } from '@/types';
import { ArrowLeft, File, Pen } from 'lucide-react';

export default function Show({ roles, user }: { roles: Role[]; user: User }) {
    const __ = useTrans();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: __('home.pages.breadcrumbs.home'),
            href: route('home'),
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
                <CardAction className="space-x-2 row-span-1 order-1 md:order-none self-end md:self-start md:mb-0">
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
                <CardTitle className="order-2 md:order-none">
                    {__('users.pages.show.title', undefined, {
                        name: user.name,
                    })}
                </CardTitle>
                <CardDescription className="col-span-2 order-3 md:order-none">
                    {__('users.pages.show.description')}
                </CardDescription>
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

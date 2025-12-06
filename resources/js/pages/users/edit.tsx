// resources/js/pages/users/edit.tsx

// Necessary imports
import { userHasPermission } from '@/lib/utils';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

// Layout
import AppLayout from '@/layouts/app/layout';

// Translation Hook
import { useTrans } from '@/lib/translation';

// Custom components
import { DeleteUser } from '@/pages/users/delete';
import { InformationsTab } from '@/pages/users/form';

// Shadnc UI Components
import { Button } from '@/components/ui/button';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Types
import type { BreadcrumbItem, Role, SharedData, User } from '@/types';

// Icons
import { ArrowLeft, File, Pen, Trash2 } from 'lucide-react';

export default function Edit({ roles, user }: { roles: Role[]; user: User }) {
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
            title: __('users.pages.breadcrumbs.edit'),
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={__('users.pages.edit.head_title', undefined, {
                    name: user.name,
                })}
            />

            <CreateForm existing_roles={roles} user={user} />
        </AppLayout>
    );
}

function CreateForm({
    existing_roles,
    user,
}: {
    existing_roles: Role[];
    user: User;
}) {
    const __ = useTrans();

    const { data, setData, errors, processing, post } = useForm<{
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
        roles: (user.roles && user.roles.map((role) => String(role.id))) || [],
        email_verified: user.email_verified_at !== null,

        avatar_url: user.avatar ? user.avatar.url : null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('users.update', { user: user.id }));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {__('users.pages.edit.title', undefined, {
                        name: user.name,
                    })}
                </CardTitle>
                <CardDescription>
                    {__('users.pages.edit.description')}
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
                        permission: 'delete users',
                    }) && (
                        <DeleteUser user={user}>
                            <Button variant="destructive">
                                <Trash2 />
                                {__('users.pages.form.buttons.delete')}
                            </Button>
                        </DeleteUser>
                    )}
                </CardAction>
            </CardHeader>
            <Separator />

            <form onSubmit={handleSubmit}>
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
                            disabled={processing}
                            roles={existing_roles}
                        />
                    </Tabs>
                </CardContent>
                <Separator className="my-6" />
                {userHasPermission({
                    user: usePage<SharedData>().props.auth.user,
                    permission: 'update users',
                }) && (
                    <CardFooter>
                        <Button disabled={processing} className="w-full">
                            {processing ? <Spinner /> : <Pen />}
                            {__('users.pages.form.buttons.update')}
                        </Button>
                    </CardFooter>
                )}
            </form>
        </Card>
    );
}

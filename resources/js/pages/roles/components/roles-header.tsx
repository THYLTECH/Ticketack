import { Button } from '@/components/ui/button';
import { useTrans } from '@/lib/translation';
import { userHasPermission } from '@/lib/utils';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';

export function RolesHeader() {
    const __ = useTrans();
    const { auth } = usePage<SharedData>().props;

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    {__('roles.pages.index.title')}
                </h1>
                <p className="text-sm text-muted-foreground">
                    {__('roles.pages.index.description')}
                </p>
            </div>
            <div className="flex items-center gap-2">
                {userHasPermission({
                    user: auth.user,
                    permission: 'create roles',
                }) && (
                        <Button asChild size="sm">
                            <Link href={route('roles.create')}>
                                <Plus className="mr-2 h-4 w-4" />
                                {__('roles.pages.index.buttons.create')}
                            </Link>
                        </Button>
                    )}
            </div>
        </div>
    );
}

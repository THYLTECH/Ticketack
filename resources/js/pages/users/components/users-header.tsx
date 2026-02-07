import { Button } from '@/components/ui/button';
import { useTrans } from '@/lib/translation';
import { userHasPermission } from '@/lib/utils';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';

export function UsersHeader() {
    const __ = useTrans();
    const { auth } = usePage<SharedData>().props;

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    {__('users.pages.index.title')}
                </h1>
                <p className="text-sm text-muted-foreground">
                    {__('users.pages.index.description')}
                </p>
            </div>
            <div className="flex items-center gap-2">
                {userHasPermission({
                    user: auth.user,
                    permission: 'create users',
                }) && (
                        <Button asChild size="sm">
                            <Link href={route('users.create')}>
                                <Plus className="mr-2 h-4 w-4" />
                                {__('users.pages.index.buttons.create')}
                            </Link>
                        </Button>
                    )}
            </div>
        </div>
    );
}

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
import { userHasPermission } from '@/lib/utils';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Plus, Users } from 'lucide-react';

export function UsersEmpty() {
    const __ = useTrans();
    const { auth } = usePage<SharedData>().props;

    return (
        <div className="flex min-h-[400px] flex-col items-center justify-center animate-in fade-in-50">
            <Empty className="border-none shadow-none">
                <EmptyHeader>
                    <EmptyMedia
                        variant="icon"
                        className="mb-4 rounded-full bg-muted/50 p-4"
                    >
                        <Users className="h-10 w-10 text-muted-foreground/60" />
                    </EmptyMedia>
                    <EmptyTitle className="text-lg font-semibold text-foreground">
                        {__('users.pages.index.empty.title')}
                    </EmptyTitle>
                    <EmptyDescription className="max-w-sm text-balance">
                        {__('users.pages.index.empty.description')}
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent className="mt-6">
                    {userHasPermission({
                        user: auth.user,
                        permission: 'create users',
                    }) && (
                            <Button asChild>
                                <Link href={route('users.create')}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    {__('users.pages.index.buttons.create')}
                                </Link>
                            </Button>
                        )}
                </EmptyContent>
            </Empty>
        </div>
    );
}

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
import type { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Briefcase, Plus } from 'lucide-react';

export function RolesEmpty() {
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
                        <Briefcase className="h-10 w-10 text-muted-foreground/60" />
                    </EmptyMedia>
                    <EmptyTitle className="text-lg font-semibold text-foreground">
                        {__('roles.pages.index.empty.title')}
                    </EmptyTitle>
                    <EmptyDescription className="max-w-sm text-balance">
                        {__('roles.pages.index.empty.description')}
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent className="mt-6">
                    {userHasPermission({
                        user: auth.user,
                        permission: 'create roles',
                    }) && (
                            <Button asChild>
                                <Link href={route('roles.create')}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    {__('roles.pages.index.buttons.create')}
                                </Link>
                            </Button>
                        )}
                </EmptyContent>
            </Empty>
        </div>
    );
}

// resources/js/pages/roles/delete.tsx

// Necessary imports
import { Link } from '@inertiajs/react';
import React from 'react';

// Translation hook
import { useTrans } from '@/lib/translation';

// Shadcn UI Components
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

// Types
import { Role } from '@/types';

// Icons
import { Trash2 } from 'lucide-react';

export function DeleteRole({
    role,
    children,
}: {
    role: Role;
    children: React.ReactNode;
}) {
    const __ = useTrans();

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {__('roles.pages.delete.title')}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {__('roles.pages.delete.description', undefined, {
                            title: role.name,
                        })}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        {__('roles.pages.delete.buttons.cancel')}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-destructive hover:bg-destructive/90"
                        asChild
                    >
                        <Link
                            method={'delete'}
                            href={route('roles.destroy', {
                                role: role.id,
                            })}
                        >
                            <Trash2 />
                            {__('roles.pages.delete.buttons.confirm')}
                        </Link>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

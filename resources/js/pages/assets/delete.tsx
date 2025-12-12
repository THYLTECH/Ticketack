// resources/js/pages/assets/delete.tsx

// Necessary imports
import { userHasPermission } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
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
import { Asset, SharedData } from '@/types';

// Icons
import { Trash2 } from 'lucide-react';

export function DeleteAsset({
    asset,
    children,
}: {
    asset: Asset;
    children: React.ReactNode;
}) {
    const __ = useTrans();

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {__('assets.pages.delete.title')}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {__('assets.pages.delete.description', undefined, {
                            title: asset.title,
                        })}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        {__('assets.pages.delete.buttons.cancel')}
                    </AlertDialogCancel>
                    {userHasPermission({
                        user: usePage<SharedData>().props.auth.user,
                        permission: 'delete assets',
                    }) && (
                        <AlertDialogAction
                            className="bg-destructive hover:bg-destructive/90"
                            asChild
                        >
                            <Link
                                method={'delete'}
                                href={route('assets.destroy', {
                                    asset: asset.id,
                                })}
                            >
                                <Trash2 />
                                {__('assets.pages.delete.buttons.confirm')}
                            </Link>
                        </AlertDialogAction>
                    )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

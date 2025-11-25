// resources/js/pages/assets/delete.tsx

// Necessary imports
import { Link } from '@inertiajs/react';
import React from 'react';

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
import { Asset } from '@/types';

// Icons
import { Trash2 } from 'lucide-react';

export function DeleteAsset({
    asset,
    children,
}: {
    asset: Asset;
    children: React.ReactNode;
}) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you sure you want to delete this asset?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the asset titled <strong>"{asset.title}"</strong>
                        .
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
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
                            Delete
                        </Link>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

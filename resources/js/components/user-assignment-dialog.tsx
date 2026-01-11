import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useInitials } from '@/hooks/use-initials';
import { useTrans } from '@/lib/translation';
import { cn } from '@/lib/utils';
import { User } from '@/types';
import { Check, Search } from 'lucide-react';
import * as React from 'react';

interface UserAssignmentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    users: User[];
    onConfirm: (userIds: number[]) => void;
    excludedUserIds?: number[];
    multiple?: boolean;
    title?: string;
    description?: string;
    searchPlaceholder?: string;
    confirmText?: string;
    cancelText?: string;
}

/**
 * Reusable dialog component for assigning users to tickets
 * Supports both single and multiple user selection
 */
export function UserAssignmentDialog({
    open,
    onOpenChange,
    users,
    onConfirm,
    excludedUserIds = [],
    multiple = false,
    title,
    description,
    searchPlaceholder,
    confirmText,
    cancelText,
}: UserAssignmentDialogProps) {
    const __ = useTrans();
    const getInitials = useInitials();

    const [searchQuery, setSearchQuery] = React.useState('');
    const [selectedUserIds, setSelectedUserIds] = React.useState<number[]>([]);

    React.useEffect(() => {
        if (!open) {
            setSelectedUserIds([]);
            setSearchQuery('');
        }
    }, [open]);

    const availableUsers = React.useMemo(() => {
        return users.filter((u) => {
            const isNotExcluded = !excludedUserIds.includes(u.id);
            const matchesSearch =
                u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.email.toLowerCase().includes(searchQuery.toLowerCase());
            return isNotExcluded && matchesSearch;
        });
    }, [users, excludedUserIds, searchQuery]);

    const handleToggleUserSelection = (userId: number) => {
        if (multiple) {
            setSelectedUserIds((prev) =>
                prev.includes(userId)
                    ? prev.filter((id) => id !== userId)
                    : [...prev, userId],
            );
        } else {
            setSelectedUserIds([userId]);
        }
    };

    const handleConfirm = () => {
        onConfirm(selectedUserIds);
        onOpenChange(false);
    };

    const handleCancel = () => {
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex max-h-[90vh] flex-col gap-0 p-0 sm:max-w-md">
                <DialogHeader className="border-b px-6 py-4">
                    <DialogTitle>
                        {title || __('tickets.assignment.dialog.title')}
                    </DialogTitle>
                    <DialogDescription>
                        {description || __('tickets.assignment.dialog.description')}
                    </DialogDescription>
                </DialogHeader>

                <div className="border-b px-4 py-3">
                    <div className="relative flex items-center">
                        <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={
                                searchPlaceholder ||
                                __('tickets.assignment.dialog.search_placeholder')
                            }
                            className="border-none pl-8 shadow-none focus-visible:ring-0"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                    {availableUsers.length === 0 ? (
                        <div className="flex h-24 flex-col items-center justify-center text-center text-sm text-muted-foreground">
                            <p>{__('tickets.assignment.dialog.no_users')}</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {availableUsers.map((user) => {
                                const isSelected = selectedUserIds.includes(user.id);
                                return (
                                    <div
                                        key={user.id}
                                        className={cn(
                                            'group flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-muted',
                                            isSelected &&
                                                'bg-muted/80 ring-1 ring-primary/20 ring-inset',
                                        )}
                                        onClick={() =>
                                            handleToggleUserSelection(user.id)
                                        }
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <Avatar className="h-9 w-9 border">
                                                    <AvatarImage
                                                        src={user.avatar?.url ?? undefined}
                                                    />
                                                    <AvatarFallback className="text-xs">
                                                        {getInitials(user.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                {isSelected && (
                                                    <div className="absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm ring-2 ring-background">
                                                        <Check className="h-2.5 w-2.5" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">
                                                    {user.name}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {user.email}
                                                </span>
                                            </div>
                                        </div>
                                        {isSelected && (
                                            <Check className="h-4 w-4 text-primary" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <DialogFooter className="border-t p-4">
                    <div className="flex w-full items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                            {selectedUserIds.length > 0 && multiple
                                ? `${selectedUserIds.length} ${selectedUserIds.length === 1 ? 'selected' : 'selected'}`
                                : ''}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCancel}
                                type="button"
                            >
                                {cancelText || __('common.cancel')}
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleConfirm}
                                type="button"
                                disabled={selectedUserIds.length === 0}
                            >
                                {confirmText || __('tickets.assignment.actions.assign')}
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


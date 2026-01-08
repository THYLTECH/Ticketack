import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useInitials } from '@/hooks/use-initials';
import { useTrans } from '@/lib/translation';
import { cn } from '@/lib/utils';
import { SharedData, User } from '@/types';
import { usePage } from '@inertiajs/react';
import { Check, Plus, Search, UserPlus, X } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';
import { TicketFormData } from './types';

interface ExtendedTicketFormData extends Omit<TicketFormData, 'assignees'> {
    assignees: number[];
}

interface TicketAssigneesProps {
    data: ExtendedTicketFormData;
    setData: <K extends keyof ExtendedTicketFormData>(
        key: K,
        value: ExtendedTicketFormData[K],
    ) => void;
    users: User[];
    disabled?: boolean;
}

export function TicketAssignees({
    data,
    setData,
    users,
    disabled = false,
}: TicketAssigneesProps) {
    const __ = useTrans();
    const { auth } = usePage<SharedData>().props;
    const getInitials = useInitials();

    const [assignDialogOpen, setAssignDialogOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [selectedUserIds, setSelectedUserIds] = React.useState<number[]>([]);

    const isAdmin =
        auth.user.roles?.some((role) => role.name === 'admin') ?? false;
    const isSolver =
        auth.user.roles?.some((role) => role.name === 'solver') ?? false;

    const canAddOthers = isAdmin;
    const canSelfAssign = isSolver || isAdmin;

    const isAssignedToMe = React.useMemo(() => {
        return data.assignees.includes(auth.user.id);
    }, [data.assignees, auth.user.id]);

    const assignedUsersObjects = React.useMemo(() => {
        return users.filter((u) => data.assignees.includes(u.id));
    }, [users, data.assignees]);

    const availableUsers = React.useMemo(() => {
        return users.filter((u) => {
            const isNotAssigned = !data.assignees.includes(u.id);
            const matchesSearch =
                u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.email.toLowerCase().includes(searchQuery.toLowerCase());
            return isNotAssigned && matchesSearch;
        });
    }, [users, data.assignees, searchQuery]);

    const handleAssignToMe = () => {
        if (isAssignedToMe) return;
        setData('assignees', [...data.assignees, auth.user.id]);
        toast.success(
            __(
                'tickets.pages.form.users_tab.notifications.assigned_to_self',
                'Assigné à vous-même',
            ),
        );
    };

    const handleToggleUserSelection = (userId: number) => {
        setSelectedUserIds((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId],
        );
    };

    const handleConfirmAssignment = () => {
        setData('assignees', [...data.assignees, ...selectedUserIds]);
        setAssignDialogOpen(false);
        setSearchQuery('');
        setSelectedUserIds([]);
        toast.success(__('tickets.pages.form.users_tab.notifications.added'));
    };

    const handleRemoveUser = (userId: number) => {
        setData(
            'assignees',
            data.assignees.filter((id) => id !== userId),
        );
        toast.success(__('tickets.pages.form.users_tab.notifications.removed'));
    };

    return (
        <div className="space-y-2 md:col-span-2">
            <Label>{__('tickets.pages.form.tabs.assignees')}</Label>
            <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-background/50 p-3">
                {assignedUsersObjects.length > 0 ? (
                    assignedUsersObjects.map((user) => (
                        <Badge
                            key={user.id}
                            variant="secondary"
                            className="flex items-center gap-1.5 py-1 pr-2 pl-1 text-sm font-normal"
                        >
                            <Avatar className="h-5 w-5">
                                <AvatarImage src={user.avatar?.url} />
                                <AvatarFallback className="text-[10px]">
                                    {getInitials(user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <span>{user.name}</span>
                            {!disabled &&
                                (canAddOthers || user.id === auth.user.id) && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveUser(user.id)
                                        }
                                        className="ml-1 rounded-full text-muted-foreground hover:bg-destructive hover:text-white"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                )}
                        </Badge>
                    ))
                ) : (
                    <span className="px-2 text-sm text-muted-foreground italic">
                        {__(
                            'tickets.pages.show.tabs.info_content.no_assignees',
                        )}
                    </span>
                )}

                <div className="ml-auto flex items-center gap-2">
                    {!isAssignedToMe && !disabled && canSelfAssign && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 rounded-full border-dashed"
                                        onClick={handleAssignToMe}
                                        type="button"
                                    >
                                        <UserPlus className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>
                                        {__(
                                            'tickets.pages.create.assign.assign_to_me',
                                        )}
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}

                    {!disabled && canAddOthers && (
                        <Dialog
                            open={assignDialogOpen}
                            onOpenChange={setAssignDialogOpen}
                        >
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 rounded-full border-dashed"
                                    type="button"
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="flex max-h-[90vh] flex-col gap-0 p-0 sm:max-w-md">
                                <DialogHeader className="border-b px-6 py-4">
                                    <DialogTitle>
                                        {__(
                                            'tickets.pages.create.assign.title',
                                        )}
                                    </DialogTitle>
                                    <DialogDescription>
                                        {__(
                                            'tickets.pages.create.assign.description',
                                        )}
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="border-b px-4 py-3">
                                    <div className="relative flex items-center">
                                        <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder={__(
                                                'tickets.pages.show.tabs.logs_content.search_placeholder',
                                            )}
                                            className="border-none pl-8 shadow-none focus-visible:ring-0"
                                            value={searchQuery}
                                            onChange={(e) =>
                                                setSearchQuery(e.target.value)
                                            }
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-2">
                                    {availableUsers.length === 0 ? (
                                        <div className="flex h-24 flex-col items-center justify-center text-center text-sm text-muted-foreground">
                                            <p>
                                                {__(
                                                    'tickets.pages.show.tabs.logs_content.no_results',
                                                )}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-1">
                                            {availableUsers.map((user) => {
                                                const isSelected =
                                                    selectedUserIds.includes(
                                                        user.id,
                                                    );
                                                return (
                                                    <div
                                                        key={user.id}
                                                        className={cn(
                                                            'group flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-muted',
                                                            isSelected &&
                                                                'bg-muted/80 ring-1 ring-primary/20 ring-inset',
                                                        )}
                                                        onClick={() =>
                                                            handleToggleUserSelection(
                                                                user.id,
                                                            )
                                                        }
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="relative">
                                                                <Avatar className="h-9 w-9 border">
                                                                    <AvatarImage
                                                                        src={
                                                                            user
                                                                                .avatar
                                                                                ?.url ??
                                                                            undefined
                                                                        }
                                                                    />
                                                                    <AvatarFallback className="text-xs">
                                                                        {getInitials(
                                                                            user.name,
                                                                        )}
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
                                            {selectedUserIds.length > 0
                                                ? `${selectedUserIds.length} selected`
                                                : ''}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    setAssignDialogOpen(false)
                                                }
                                                type="button"
                                            >
                                                {__(
                                                    'tickets.pages.create.assign.cancel',
                                                )}
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={
                                                    handleConfirmAssignment
                                                }
                                                type="button"
                                                disabled={
                                                    selectedUserIds.length === 0
                                                }
                                            >
                                                {__(
                                                    'tickets.pages.form.users_tab.add_button',
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </div>
        </div>
    );
}

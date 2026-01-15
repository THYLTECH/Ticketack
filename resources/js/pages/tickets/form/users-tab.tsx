import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { UserAssignmentDialog } from '@/components/user-assignment-dialog';
import { useInitials } from '@/hooks/use-initials';
import { useTrans } from '@/lib/translation';
import { SharedData, User } from '@/types';
import { usePage } from '@inertiajs/react';
import { Plus, UserPlus, X } from 'lucide-react';
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

    const handleConfirmAssignment = (userIds: number[]) => {
        setData('assignees', [...data.assignees, ...userIds]);
        toast.success(__('tickets.pages.form.users_tab.notifications.added'));
    };

    const handleRemoveUser = (userId: number) => {
        const isLastAssignee = data.assignees.length === 1;
        const isRemovingSelf = userId === auth.user.id;

        setData(
            'assignees',
            data.assignees.filter((id) => id !== userId),
        );

        if (isLastAssignee && isRemovingSelf) {
            toast.info(
                __('tickets.pages.form.users_tab.notifications.last_assignee_removed'),
                {
                    description: __('tickets.pages.form.users_tab.notifications.admins_notified'),
                }
            );
        } else {
            toast.success(__('tickets.pages.form.users_tab.notifications.removed'));
        }
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
                        <>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8 rounded-full border-dashed"
                                            type="button"
                                            onClick={() => setAssignDialogOpen(true)}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>
                                            {__(
                                                'tickets.pages.create.assign.add_users',
                                            )}
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <UserAssignmentDialog
                                open={assignDialogOpen}
                                onOpenChange={setAssignDialogOpen}
                                users={users}
                                onConfirm={handleConfirmAssignment}
                                excludedUserIds={data.assignees}
                                multiple={true}
                                title={__('tickets.pages.create.assign.title')}
                                description={__('tickets.pages.create.assign.description')}
                                searchPlaceholder={__(
                                    'tickets.pages.show.tabs.logs_content.search_placeholder',
                                )}
                                confirmText={__('tickets.pages.form.users_tab.add_button')}
                                cancelText={__('tickets.pages.create.assign.cancel')}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

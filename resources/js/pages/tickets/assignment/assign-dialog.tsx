import { UserAssignmentDialog } from '@/components/user-assignment-dialog';
import { useTrans } from '@/lib/translation';
import { User } from '@/types';

interface AssignDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    users: User[];
    onAssign: (userIds: number[]) => void;
}

/**
 * Dialog component for assigning a ticket to one or multiple users
 * Provides search functionality and user selection interface with multi-select support
 */
export function AssignDialog({
    open,
    onOpenChange,
    users,
    onAssign,
}: AssignDialogProps) {
    const __ = useTrans();

    return (
        <UserAssignmentDialog
            open={open}
            onOpenChange={onOpenChange}
            users={users}
            onConfirm={onAssign}
            multiple={true}
            title={__('tickets.assignment.dialog.title')}
            description={__('tickets.assignment.dialog.description')}
        />
    );
}


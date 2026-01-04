import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Empty,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { TabsContent } from '@/components/ui/tabs';
import { useInitials } from '@/hooks/use-initials';
import { useTrans } from '@/lib/translation';
import { SharedData, User } from '@/types';
import { usePage } from '@inertiajs/react';
import { MinusCircle, Plus, Search, UserMinus } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';
import { TicketFormData } from './types';

export function UsersTab({
    data,
    setData,
    users,
    disabled = false,
}: {
    data: { assignees: User[] };
    setData: <K extends keyof TicketFormData>(
        key: K,
        value: TicketFormData[K],
    ) => void;
    users: User[];
    disabled?: boolean;
}) {
    const __ = useTrans();
    const getInitials = useInitials();
    const { auth } = usePage<SharedData>().props;
    const [open, setOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');

    const availableUsers = React.useMemo(() => {
        const assignedIds = data.assignees.map((u) => u.id);
        return users.filter((u) => {
            const isNotAssigned = !assignedIds.includes(u.id);
            const matchesSearch =
                u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.email.toLowerCase().includes(searchQuery.toLowerCase());
            return isNotAssigned && matchesSearch;
        });
    }, [users, data.assignees, searchQuery]);

    const handleAddUser = (user: User) => {
        setData('assignees', [...data.assignees, user]);
        setOpen(false);
        setSearchQuery('');
        toast.success(__('tickets.pages.form.users_tab.notifications.added'));
    };

    const handleRemoveUser = (userId: number) => {
        setData(
            'assignees',
            data.assignees.filter((u) => u.id !== userId),
        );
        toast.success(__('tickets.pages.form.users_tab.notifications.removed'));
    };

    return (
        <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="text-lg font-medium">
                        {__('tickets.pages.form.tabs.assignees')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {__('tickets.pages.form.users_tab.description')}
                    </p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" disabled={disabled}>
                            <Plus className="mr-2 h-4 w-4" />
                            {__('tickets.pages.form.buttons.add')}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="gap-0 p-0 sm:max-w-[500px]">
                        <DialogHeader className="border-b px-6 py-4">
                            <DialogTitle>
                                {__('tickets.pages.create.assign.title')}
                            </DialogTitle>
                            <DialogDescription>
                                {__('tickets.pages.create.assign.description')}
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
                        <div className="max-h-[350px] overflow-y-auto p-2">
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
                                    {availableUsers.map((user) => (
                                        <div
                                            key={user.id}
                                            className="group flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-muted"
                                            onClick={() => handleAddUser(user)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9 border">
                                                    <AvatarImage
                                                        src={
                                                            user.avatar?.url ??
                                                            undefined
                                                        }
                                                    />
                                                    <AvatarFallback className="text-xs">
                                                        {getInitials(user.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium">
                                                        {user.name}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {user.email}
                                                    </span>
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="h-7 opacity-0 transition-opacity group-hover:opacity-100"
                                            >
                                                {__(
                                                    'tickets.pages.form.users_tab.add_button',
                                                )}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {data.assignees.length === 0 ? (
                <Empty className="border border-dashed py-10">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <UserMinus />
                        </EmptyMedia>
                        <EmptyTitle>
                            {__(
                                'tickets.pages.show.tabs.info_content.no_assignees',
                            )}
                        </EmptyTitle>
                    </EmptyHeader>
                </Empty>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50 hover:bg-muted/50">
                                <TableHead className="pl-4">
                                    {__(
                                        'tickets.pages.form.users_tab.table.assignee',
                                    )}
                                </TableHead>
                                <TableHead>
                                    {__(
                                        'tickets.pages.form.users_tab.table.role',
                                    )}
                                </TableHead>
                                <TableHead className="w-[80px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.assignees.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="py-3 pl-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8 border">
                                                <AvatarImage
                                                    src={
                                                        user.avatar?.url ??
                                                        undefined
                                                    }
                                                />
                                                <AvatarFallback className="text-xs">
                                                    {getInitials(user.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium">
                                                        {user.name}
                                                    </span>
                                                    {user.id ===
                                                        auth.user.id && (
                                                        <Badge
                                                            variant="outline"
                                                            className="h-5 px-1.5 text-[10px]"
                                                        >
                                                            {__(
                                                                'tickets.pages.form.users_tab.me_badge',
                                                            )}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <span className="text-xs text-muted-foreground">
                                                    {user.email}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {user.roles &&
                                            user.roles.length > 0 ? (
                                                user.roles.map((role) => (
                                                    <Badge
                                                        key={role.id}
                                                        variant="secondary"
                                                        className="font-normal"
                                                    >
                                                        {role.name}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <span className="text-xs text-muted-foreground">
                                                    -
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="pr-4 text-right">
                                        {!disabled && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                                onClick={() =>
                                                    handleRemoveUser(user.id)
                                                }
                                            >
                                                <MinusCircle className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </TabsContent>
    );
}

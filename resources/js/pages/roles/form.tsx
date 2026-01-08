import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { TabsContent } from '@/components/ui/tabs';
import { useTrans } from '@/lib/translation';
import type { Permission, SharedData, User } from '@/types';
import { usePage } from '@inertiajs/react';
import {
    AlertCircle,
    Info,
    Lock,
    Plus,
    Search,
    Shield,
    Trash2,
    UserMinus,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export interface RoleFormData {
    name: string;
    permissions: Permission[];
    users: User[];
}

type RoleSetData = <K extends keyof RoleFormData>(
    key: K,
    value: RoleFormData[K],
) => void;

export function InformationsTab({
    errors,
    data,
    setData,
    disabled = false,
    isSystemRole = false,
}: {
    errors: Partial<Record<keyof RoleFormData, string>>;
    data: RoleFormData;
    setData: RoleSetData;
    disabled?: boolean;
    isSystemRole?: boolean;
}) {
    const __ = useTrans();

    return (
        <TabsContent
            value="informations"
            className="animate-in space-y-6 pt-4 fade-in-50 slide-in-from-bottom-2"
        >
            {isSystemRole && (
                <div className="flex items-start gap-4 rounded-lg border border-blue-200 bg-blue-50/50 p-4 text-blue-800 dark:border-blue-900/50 dark:bg-blue-950/20 dark:text-blue-300">
                    <Info className="mt-0.5 h-5 w-5 shrink-0" />
                    <div className="space-y-1">
                        <h4 className="text-sm font-semibold">
                            {__('roles.pages.form.fields.name.system_badge')}
                        </h4>
                        <p className="text-sm leading-relaxed opacity-90">
                            {__('roles.pages.form.fields.name.system_helper')}
                        </p>
                    </div>
                </div>
            )}

            <div className="grid max-w-md gap-2">
                <Label
                    htmlFor="name"
                    className={errors.name ? 'text-destructive' : ''}
                >
                    {__('roles.pages.form.fields.name.label')}{' '}
                    <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                    <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder={__(
                            'roles.pages.form.fields.name.placeholder',
                        )}
                        disabled={disabled}
                        readOnly={isSystemRole}
                        className={`pr-10 ${
                            errors.name ? 'border-destructive' : ''
                        } ${
                            isSystemRole
                                ? 'cursor-not-allowed bg-muted/50 text-foreground focus-visible:ring-0'
                                : ''
                        }`}
                        autoFocus={!isSystemRole}
                    />
                    {isSystemRole && (
                        <Lock className="absolute top-2.5 right-3 h-4 w-4 text-muted-foreground/70" />
                    )}
                </div>
                {errors.name && (
                    <p className="flex animate-in items-center gap-1 text-sm font-medium text-destructive slide-in-from-left-1">
                        <AlertCircle className="h-3 w-3" /> {errors.name}
                    </p>
                )}
                {!isSystemRole && (
                    <p className="text-xs text-muted-foreground">
                        {__('roles.pages.form.fields.name.description')}
                    </p>
                )}
            </div>
        </TabsContent>
    );
}

interface GroupedPermissions {
    [key: string]: Permission[];
}

export function PermissionsTab({
    data,
    setData,
    permissions,
    disabled = false,
}: {
    data: RoleFormData;
    setData: RoleSetData;
    permissions: Permission[];
    disabled?: boolean;
}) {
    const __ = useTrans();

    const groupedPermissions = permissions.reduce(
        (acc: GroupedPermissions, permission: Permission) => {
            const parts = permission.name.split(' ');
            const moduleName =
                parts.length > 1 ? parts[parts.length - 1] : 'other';
            const finalGroup =
                parts.length > 2 &&
                parts[1] === 'ticket' &&
                parts[2] === 'entries'
                    ? 'entries'
                    : moduleName;

            if (!acc[finalGroup]) acc[finalGroup] = [];
            acc[finalGroup].push(permission);
            return acc;
        },
        {},
    );

    const getPermissionAction = (permissionName: string) => {
        const parts = permissionName.split(' ');
        parts.pop();
        return parts.join(' ');
    };

    const toggleModule = (
        modulePermissions: Permission[],
        isChecked: boolean,
    ) => {
        if (disabled) return;
        const currentIds = new Set(data.permissions.map((p) => p.id));
        const moduleIds = modulePermissions.map((p) => p.id);

        let newPermissions = [...data.permissions];

        if (isChecked) {
            const missing = modulePermissions.filter(
                (p) => !currentIds.has(p.id),
            );
            newPermissions = [...newPermissions, ...missing];
        } else {
            newPermissions = newPermissions.filter(
                (p) => !moduleIds.includes(p.id),
            );
        }
        setData('permissions', newPermissions);
    };

    const togglePermission = (permission: Permission) => {
        if (disabled) return;
        const exists = data.permissions.some((p) => p.id === permission.id);
        let newPermissions;
        if (exists) {
            newPermissions = data.permissions.filter(
                (p) => p.id !== permission.id,
            );
        } else {
            newPermissions = [...data.permissions, permission];
        }
        setData('permissions', newPermissions);
    };

    return (
        <TabsContent
            value="permissions"
            className="animate-in pt-6 fade-in-50 slide-in-from-bottom-2"
        >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {Object.entries(groupedPermissions).map(
                    ([group, groupPermissions]) => {
                        const isModuleFullyChecked = groupPermissions.every(
                            (p) =>
                                data.permissions.some((dp) => dp.id === p.id),
                        );

                        const groupTitle =
                            __(`permissions.${group}.title`) !==
                            `permissions.${group}.title`
                                ? __(`permissions.${group}.title`)
                                : group;

                        return (
                            <div
                                key={group}
                                className={`flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:shadow-md ${isModuleFullyChecked ? 'border-primary/40 ring-1 ring-primary/20' : ''}`}
                            >
                                <div className="flex items-center justify-between rounded-t-xl border-b bg-muted/30 p-4">
                                    <div className="flex items-center gap-2.5">
                                        <div
                                            className={`rounded-md p-1.5 ${isModuleFullyChecked ? 'bg-primary/10 text-primary' : 'border bg-background text-muted-foreground'}`}
                                        >
                                            <Shield className="h-4 w-4" />
                                        </div>
                                        <h3 className="font-semibold tracking-tight capitalize">
                                            {groupTitle}
                                        </h3>
                                    </div>
                                    <Switch
                                        checked={isModuleFullyChecked}
                                        onCheckedChange={(checked) =>
                                            toggleModule(
                                                groupPermissions,
                                                checked,
                                            )
                                        }
                                        disabled={disabled}
                                        className="data-[state=checked]:bg-primary"
                                    />
                                </div>

                                <div className="space-y-4 p-4">
                                    {groupPermissions.map((permission) => {
                                        const isChecked = data.permissions.some(
                                            (p) => p.id === permission.id,
                                        );
                                        const actionName = getPermissionAction(
                                            permission.name,
                                        );
                                        const actionTitle =
                                            __(
                                                `permissions.${group}.items.${actionName}.title`,
                                            ) !==
                                            `permissions.${group}.items.${actionName}.title`
                                                ? __(
                                                      `permissions.${group}.items.${actionName}.title`,
                                                  )
                                                : actionName;

                                        return (
                                            <div
                                                key={permission.id}
                                                className="group/item flex items-center justify-between gap-3"
                                            >
                                                <Label
                                                    htmlFor={`perm-${permission.id}`}
                                                    className={`cursor-pointer text-sm leading-none font-medium transition-colors ${isChecked ? 'text-foreground' : 'text-muted-foreground group-hover/item:text-foreground'}`}
                                                >
                                                    {actionTitle}
                                                </Label>
                                                <Switch
                                                    id={`perm-${permission.id}`}
                                                    checked={isChecked}
                                                    onCheckedChange={() =>
                                                        togglePermission(
                                                            permission,
                                                        )
                                                    }
                                                    disabled={disabled}
                                                    className="scale-90"
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    },
                )}
            </div>
        </TabsContent>
    );
}

export function UsersTab({
    data,
    setData,
    usersWithoutRole,
    disabled = false,
}: {
    data: RoleFormData;
    setData: RoleSetData;
    usersWithoutRole: User[];
    disabled?: boolean;
}) {
    const __ = useTrans();
    const { auth } = usePage<SharedData>().props;

    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [tempUsersWithoutRole, setTempUsersWithoutRole] = useState<User[]>(
        usersWithoutRole || [],
    );
    const [assignedSearchQuery, setAssignedSearchQuery] = useState('');

    const isSimpleUser = data.name === 'simple_user';

    const filteredAvailableUsers = useMemo(() => {
        if (!searchQuery) return tempUsersWithoutRole;
        const lowerQuery = searchQuery.toLowerCase();
        return tempUsersWithoutRole.filter(
            (user) =>
                user.name.toLowerCase().includes(lowerQuery) ||
                user.email.toLowerCase().includes(lowerQuery),
        );
    }, [tempUsersWithoutRole, searchQuery]);

    const filteredAssignedUsers = useMemo(() => {
        if (!assignedSearchQuery) return data.users;
        const lowerQuery = assignedSearchQuery.toLowerCase();
        return data.users.filter(
            (user) =>
                user.name.toLowerCase().includes(lowerQuery) ||
                user.email.toLowerCase().includes(lowerQuery),
        );
    }, [data.users, assignedSearchQuery]);

    const handleAddUser = (user: User) => {
        setData('users', [...data.users, user]);
        setTempUsersWithoutRole(
            tempUsersWithoutRole.filter((u) => u.id !== user.id),
        );
        toast.success(__('roles.pages.form.users.flash.added'));
    };

    const handleRemoveUser = (user: User) => {
        setData(
            'users',
            data.users.filter((u) => u.id !== user.id),
        );
        setTempUsersWithoutRole([...tempUsersWithoutRole, user]);
        toast.success(__('roles.pages.form.users.flash.removed'));
    };

    return (
        <TabsContent
            value="users"
            className="animate-in space-y-6 pt-6 fade-in-50 slide-in-from-bottom-2"
        >
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2">
                    <Badge
                        variant="outline"
                        className="h-6 px-2 text-sm font-medium"
                    >
                        {data.users.length}
                    </Badge>
                    <span className="text-sm font-medium text-muted-foreground">
                        {__('roles.pages.form.users.assigned_title')}
                    </span>
                </div>

                {!disabled && (
                    <AlertDialog open={open} onOpenChange={setOpen}>
                        <AlertDialogTrigger asChild>
                            <Button type="button" size="sm" className="gap-2">
                                <Plus className="h-4 w-4" />
                                {__('roles.pages.form.users.dialog.trigger')}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-2xl gap-0 overflow-hidden p-0">
                            <div className="border-b bg-muted/10 p-6">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-xl">
                                        {__(
                                            'roles.pages.form.users.dialog.title',
                                        )}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {__(
                                            'roles.pages.form.users.dialog.description',
                                        )}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>

                                <div className="relative mt-4">
                                    <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder={__(
                                            'roles.pages.form.users.dialog.search_placeholder',
                                        )}
                                        className="bg-background pl-9"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="custom-scrollbar max-h-100 overflow-y-auto">
                                {tempUsersWithoutRole.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <UserMinus className="mb-3 h-10 w-10 text-muted-foreground/30" />
                                        <p className="text-sm font-medium text-muted-foreground">
                                            {__(
                                                'roles.pages.form.users.dialog.empty.title',
                                            )}
                                        </p>
                                    </div>
                                ) : filteredAvailableUsers.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <Search className="mb-3 h-10 w-10 text-muted-foreground/30" />
                                        <p className="text-sm text-muted-foreground">
                                            {__(
                                                'roles.pages.form.users.dialog.search_empty',
                                                undefined,
                                                { search: searchQuery },
                                            )}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="divide-y">
                                        {filteredAvailableUsers.map((user) => (
                                            <div
                                                key={user.id}
                                                className="flex items-center justify-between p-4 transition-colors hover:bg-muted/40"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9">
                                                        <AvatarImage
                                                            src={
                                                                user.avatar?.url
                                                            }
                                                            alt={user.name}
                                                        />
                                                        <AvatarFallback className="bg-muted text-sm font-medium text-muted-foreground">
                                                            {user.name
                                                                .substring(0, 2)
                                                                .toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>

                                                    <div>
                                                        <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                                                            {user.name}
                                                            {user.id ===
                                                                auth.user
                                                                    .id && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="h-4 px-1 text-[10px]"
                                                                >
                                                                    {__(
                                                                        'roles.pages.form.users.you',
                                                                    )}
                                                                </Badge>
                                                            )}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    type="button"
                                                    className="h-8 gap-1.5 transition-colors hover:bg-primary hover:text-primary-foreground"
                                                    onClick={() =>
                                                        handleAddUser(user)
                                                    }
                                                >
                                                    <Plus className="h-3.5 w-3.5" />
                                                    {__(
                                                        'roles.pages.form.users.dialog.table.actions.add',
                                                    )}
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <AlertDialogFooter className="border-t bg-muted/10 p-4">
                                <AlertDialogCancel asChild>
                                    <Button type="button" variant="outline">
                                        {__(
                                            'roles.pages.form.users.dialog.buttons.close',
                                        )}
                                    </Button>
                                </AlertDialogCancel>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>

            {data.users.length > 0 && (
                <div className="relative max-w-md">
                    <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={__(
                            'roles.pages.form.users.filter_placeholder',
                        )}
                        value={assignedSearchQuery}
                        onChange={(e) => setAssignedSearchQuery(e.target.value)}
                        className="bg-background pl-9"
                    />
                </div>
            )}

            <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                {data.users.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="mb-3 rounded-full bg-muted/50 p-4">
                            <UserMinus className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-lg font-medium">
                            {__('roles.pages.form.users.empty.title')}
                        </h3>
                        <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                            {__('roles.pages.form.users.empty.description')}
                        </p>
                        {!disabled && (
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={() => setOpen(true)}
                                type="button"
                            >
                                {__('roles.pages.form.users.empty.action')}
                            </Button>
                        )}
                    </div>
                ) : filteredAssignedUsers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Search className="mb-3 h-8 w-8 text-muted-foreground/30" />
                        <p className="text-sm text-muted-foreground">
                            {__(
                                'roles.pages.form.users.filter_empty',
                                undefined,
                                { search: assignedSearchQuery },
                            )}
                        </p>
                        <Button
                            variant="link"
                            className="mt-2 text-xs"
                            onClick={() => setAssignedSearchQuery('')}
                            type="button"
                        >
                            {__('roles.pages.form.users.filter_clear')}
                        </Button>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/40 hover:bg-muted/40">
                                <TableHead className="w-[40%] pl-6">
                                    {__(
                                        'roles.pages.form.users.table.columns.name',
                                    )}
                                </TableHead>
                                <TableHead className="w-[40%]">
                                    {__(
                                        'roles.pages.form.users.table.columns.email',
                                    )}
                                </TableHead>
                                {!disabled && !isSimpleUser && (
                                    <TableHead className="w-[20%] pr-6 text-right">
                                        {__(
                                            'roles.pages.form.users.table.columns.actions',
                                        )}
                                    </TableHead>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAssignedUsers.map((user) => (
                                <TableRow key={user.id} className="group">
                                    <TableCell className="pl-6">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage
                                                    src={user.avatar?.url}
                                                    alt={user.name}
                                                />
                                                <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                                                    {user.name
                                                        .substring(0, 2)
                                                        .toUpperCase()}
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
                                                            variant="secondary"
                                                            className="h-4 px-1 text-[10px]"
                                                        >
                                                            {__(
                                                                'roles.pages.form.users.you',
                                                            )}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {user.email}
                                    </TableCell>

                                    {!disabled && !isSimpleUser && (
                                        <TableCell className="pr-6 text-right">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                type="button"
                                                className="h-8 w-8 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                                                onClick={() =>
                                                    handleRemoveUser(user)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </TabsContent>
    );
}

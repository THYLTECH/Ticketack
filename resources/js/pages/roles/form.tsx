// resources/js/pages/roles/form.tsx

// Necessary imports
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

// Translation Hook
import { useTrans } from '@/lib/translation';

// Shadnc UI Components
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
import { Button } from '@/components/ui/button';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
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

// Types
import type { Permission, SharedData, User } from '@/types';

// Icons
import { Badge } from '@/components/ui/badge';
import { MinusCircle, Plus, PlusCircle, UserMinus } from 'lucide-react';

export function InformationsTab({
    errors,
    data,
    setData,
    disabled = false,
}: {
    errors: Record<string, string>;
    // Change these any types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setData: any;
    disabled?: boolean;
}) {
    const __ = useTrans();

    return (
        <TabsContent
            value={'informations'}
            className="grid gap-4 md:grid-cols-4"
        >
            <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="name" indicator={'required'}>
                    {__('roles.pages.form.fields.name.label')}
                </Label>
                <Input
                    id="name"
                    type="text"
                    name="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                    placeholder={__('roles.pages.form.fields.name.placeholder')}
                    aria-invalid={errors.name ? 'true' : 'false'}
                    autoFocus
                    disabled={disabled}
                />
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
    // Change these any types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setData: any;
    permissions: Permission[];
    disabled?: boolean;
}) {
    const __ = useTrans();

    function groupPermissionsByModule(
        permissions: Permission[],
    ): GroupedPermissions {
        return permissions.reduce(
            (acc: GroupedPermissions, permission: Permission) => {
                const parts = permission.name.split(' ');
                const moduleName = parts[parts.length - 1];
                if (!acc[moduleName]) {
                    acc[moduleName] = [];
                }
                acc[moduleName].push(permission);
                return acc;
            },
            {},
        );
    }

    const getPermissionDisplayName = (permissionName: string): string => {
        const parts = permissionName.split(' ');
        parts.pop();
        return parts.join(' ');
    };

    const groupedPermissions = groupPermissionsByModule(permissions);

    const handleCheckboxModuleChange = (
        moduleName: string,
        isChecked: boolean,
    ) => {
        const modulePermissions = groupedPermissions[moduleName];

        if (isChecked) {
            const existingIds = new Set(
                data.permissions.map((p: Permission) => p.id),
            );

            const permissionsToAdd = modulePermissions.filter(
                (p) => !existingIds.has(p.id),
            );

            setData('permissions', [...data.permissions, ...permissionsToAdd]);
        } else {
            const modulePermissionIds = new Set(
                modulePermissions.map((perm) => perm.id),
            );

            const newPermissions = data.permissions.filter(
                (permission: Permission) =>
                    !modulePermissionIds.has(permission.id),
            );
            setData('permissions', newPermissions);
        }
    };

    const handleCheckboxPermissionChange = (permission: Permission) => {
        const isCurrentlyChecked = data.permissions.some(
            (item: Permission) => item.id === permission.id,
        );

        if (isCurrentlyChecked) {
            const newPermissions = data.permissions.filter(
                (item: Permission) => item.id !== permission.id,
            );
            setData('permissions', newPermissions);
        } else {
            setData('permissions', [...data.permissions, permission]);
        }
    };

    return (
        <TabsContent value={'permissions'} className="grid gap-10">
            {Object.entries(groupedPermissions).map(([moduleName, perms]) => (
                <div className="grid gap-2" key={moduleName}>
                    <div className="flex items-center justify-between gap-4">
                        <div className="grid">
                            <h3 className="font-medium">
                                {__(
                                    `permissions.${moduleName.toLowerCase()}.title`,
                                )}
                            </h3>
                            <p className="text-sm font-light text-muted-foreground">
                                {__(
                                    `permissions.${moduleName.toLowerCase()}.description`,
                                )}
                            </p>
                        </div>
                        {!disabled && (
                            <Switch
                                checked={perms.every((permission) =>
                                    data.permissions.some(
                                        (item: Permission) =>
                                            item.id === permission.id,
                                    ),
                                )}
                                onCheckedChange={(isChecked) =>
                                    handleCheckboxModuleChange(
                                        moduleName,
                                        isChecked,
                                    )
                                }
                            />
                        )}
                    </div>
                    <Separator />
                    <div className="mt-2 grid">
                        {perms.map((permission, index) => (
                            <div
                                className={`flex items-center justify-between gap-6 py-2 ${index % 2 === 0 ? 'bg-muted/50' : ''} rounded-md px-4`}
                                key={permission.id}
                            >
                                <div className="grid">
                                    <h3 className="text-sm">
                                        {__(
                                            `permissions.${moduleName.toLowerCase()}.items.${getPermissionDisplayName(permission.name).toLowerCase()}.title`,
                                        )}
                                    </h3>
                                    <p className="text-sm font-light text-muted-foreground">
                                        {__(
                                            `permissions.${moduleName.toLowerCase()}.items.${getPermissionDisplayName(permission.name).toLowerCase()}.description`,
                                        )}
                                    </p>
                                </div>
                                <Switch
                                    name="permissions[]"
                                    disabled={disabled}
                                    value={permission.id}
                                    checked={data.permissions.some(
                                        (item: Permission) =>
                                            item.id === permission.id,
                                    )}
                                    onCheckedChange={() =>
                                        handleCheckboxPermissionChange(
                                            permission,
                                        )
                                    }
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </TabsContent>
    );
}

export function UsersTab({
    data,
    setData,
    usersWithoutRole,
    disabled = false,
}: {
    // Change these any types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setData: any;
    usersWithoutRole: User[];
    disabled?: boolean;
}) {
    const __ = useTrans();

    const { auth } = usePage<SharedData>().props;

    const [open, setOpen] = useState(false);
    const [tempUsersWithoutRole, setTempUsersWithoutRole] = useState<User[]>(
        usersWithoutRole || [],
    );

    const handleAddUser = (user: User) => {
        setData('users', [...data.users, user]);
        setTempUsersWithoutRole(
            tempUsersWithoutRole.filter((u: User) => u.id !== user.id),
        );
        setOpen(false);
        toast.success(__('roles.pages.form.users.flash.added'));
    };

    const handleRemoveUser = (user: User) => {
        setData(
            'users',
            data.users.filter((u: User) => u.id !== user.id),
        );
        setTempUsersWithoutRole([...tempUsersWithoutRole, user]);
        toast.success(__('roles.pages.form.users.flash.removed'));
    };

    return (
        <TabsContent value={'users'} className="grid gap-4">
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                    {data.users.length !== 0 && !disabled && (
                        <Button
                            variant={'outline'}
                            size={'sm'}
                            className="w-max"
                            type="button"
                        >
                            <Plus />
                            {__('roles.pages.form.users.dialog.trigger')}
                        </Button>
                    )}
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-8lg">
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {__('roles.pages.form.users.dialog.title')}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {__('roles.pages.form.users.dialog.description')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    {tempUsersWithoutRole.length === 0 ? (
                        <Empty className="gap-2 border border-dashed !p-8">
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <UserMinus />
                                </EmptyMedia>
                                <EmptyTitle>
                                    {__(
                                        'roles.pages.form.users.dialog.empty.title',
                                    )}
                                </EmptyTitle>
                                <EmptyDescription>
                                    {__(
                                        'roles.pages.form.users.dialog.empty.description',
                                    )}
                                </EmptyDescription>
                            </EmptyHeader>
                            <EmptyContent>
                                {!disabled && (
                                    <AlertDialogCancel>
                                        {__(
                                            'roles.pages.form.users.dialog.buttons.close',
                                        )}
                                    </AlertDialogCancel>
                                )}
                            </EmptyContent>
                        </Empty>
                    ) : (
                        <>
                            <div className="overflow-hidden rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>
                                                {__(
                                                    'roles.pages.form.users.dialog.table.columns.name',
                                                )}
                                            </TableHead>
                                            <TableHead>
                                                {__(
                                                    'roles.pages.form.users.dialog.table.columns.email',
                                                )}
                                            </TableHead>
                                            <TableHead></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {tempUsersWithoutRole.map(
                                            (user: User) => (
                                                <TableRow key={user.id}>
                                                    <TableCell className="space-x-3">
                                                        <span>{user.name}</span>
                                                        {user.id ===
                                                            auth.user.id && (
                                                            <Badge>
                                                                {__(
                                                                    'roles.pages.form.users.you',
                                                                )}
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {user.email}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {!disabled && (
                                                            <Button
                                                                size={'sm'}
                                                                type="button"
                                                                onClick={() =>
                                                                    handleAddUser(
                                                                        user,
                                                                    )
                                                                }
                                                            >
                                                                <PlusCircle />
                                                                {__(
                                                                    'roles.pages.form.users.dialog.table.actions.add',
                                                                )}
                                                            </Button>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ),
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                            <AlertDialogFooter>
                                <AlertDialogCancel>
                                    {__(
                                        'roles.pages.form.users.dialog.buttons.close',
                                    )}
                                </AlertDialogCancel>
                            </AlertDialogFooter>
                        </>
                    )}
                </AlertDialogContent>
            </AlertDialog>

            {data.users.length === 0 ? (
                <Empty className="gap-2 border border-dashed !p-8">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <UserMinus />
                        </EmptyMedia>
                        <EmptyTitle>
                            {__('roles.pages.form.users.empty.title')}
                        </EmptyTitle>
                        <EmptyDescription>
                            {__('roles.pages.form.users.empty.description')}
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        {!disabled && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setOpen(true)}
                                type="button"
                            >
                                <Plus />
                                {__('roles.pages.form.users.empty.action')}
                            </Button>
                        )}
                    </EmptyContent>
                </Empty>
            ) : (
                <div className="overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    {__(
                                        'roles.pages.form.users.table.columns.name',
                                    )}
                                </TableHead>
                                <TableHead>
                                    {__(
                                        'roles.pages.form.users.table.columns.email',
                                    )}
                                </TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.users.map((user: User) => (
                                <TableRow key={user.id}>
                                    <TableCell className="space-x-3">
                                        <span>{user.name}</span>
                                        {user.id === auth.user.id && (
                                            <Badge>
                                                {__(
                                                    'roles.pages.form.users.you',
                                                )}
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell className="text-right">
                                        {!disabled && (
                                            <Button
                                                size={'sm'}
                                                type="button"
                                                variant={'outline'}
                                                onClick={() =>
                                                    handleRemoveUser(user)
                                                }
                                            >
                                                <MinusCircle />
                                                {__(
                                                    'roles.pages.form.users.table.actions.remove',
                                                )}
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

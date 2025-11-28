// resources/js/pages/assets/form.tsx

// Necessary imports

// Hooks

// Translation Hook
import { useTrans } from '@/lib/translation';

// Shadnc UI Components
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';


// Types
import type { Permission } from '@/types';
// Icons

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
                    Name
                </Label>
                <Input
                    id="name"
                    type="text"
                    name="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                    placeholder="Role Name"
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

    function getPermissionDisplayName(permissionName: string): string {
        const parts = permissionName.split(' ');
        parts.pop();
        return parts.join(' ');
    }

    const groupedPermissions = groupPermissionsByModule(permissions);

    const handleCheckboxModuleChange = (moduleName: string, isChecked: boolean) => {
        const modulePermissions = groupedPermissions[moduleName];
        const modulePermissionIds = modulePermissions.map((perm) => perm.id);

        if (isChecked) {
            // Add all permissions of the module
            const newPermissions = Array.from(
                new Set([...data.permissions, ...modulePermissionIds]),
            );
            setData('permissions', newPermissions);
        } else {
            // Remove all permissions of the module
            const newPermissions = data.permissions.filter(
                (id: number) => !modulePermissionIds.includes(id),
            );
            setData('permissions', newPermissions);
        }
    };

    const handleCheckboxPermissionChange = (permissionId: number) => {
        if (data.permissions.includes(permissionId)) {
            // Remove permission
            setData(
                'permissions',
                data.permissions.filter((id: number) => id !== permissionId),
            );
        } else {
            // Add permission
            setData('permissions', [...data.permissions, permissionId]);
        }
    }

    return (
        <TabsContent
            value={'permissions'}
            className="grid gap-10"
        >
            {Object.entries(groupedPermissions).map(
                ([moduleName, perms]) => (
                    <div className="grid gap-2" key={moduleName}>
                        <div className="flex items-center justify-between gap-4">
                            <div className='grid'>
                                <h3 className="font-medium">
                                    {__(`permissions.${moduleName.toLowerCase()}.title`)}
                                </h3>
                                <p className="text-sm font-light text-muted-foreground">
                                    {__(`permissions.${moduleName.toLowerCase()}.description`)}
                                </p>
                            </div>
                            {!disabled && (
                                <Switch
                                    checked={perms.every((permission) =>
                                        data.permissions.includes(permission.id),
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
                        <div className="grid mt-2">
                            {perms.map((permission, index) => (
                                <div 
                                    className={`flex items-center justify-between gap-6 py-2 ${index % 2 === 0 ? 'bg-muted/50' : ''} px-4 rounded-md`}
                                    key={permission.id}
                                >
                                    <div className="grid">
                                        <h3 className="text-sm">
                                            {__(`permissions.${moduleName.toLowerCase()}.items.${getPermissionDisplayName(permission.name).toLowerCase()}.title`)}
                                        </h3>
                                        <p className="text-sm font-light text-muted-foreground">
                                            {__(`permissions.${moduleName.toLowerCase()}.items.${getPermissionDisplayName(permission.name).toLowerCase()}.description`)}
                                        </p>
                                    </div>
                                    <Switch
                                        name="permissions[]"
                                        disabled={disabled}
                                        value={permission.id}
                                        checked={data.permissions.includes(permission.id)} 
                                        onCheckedChange={() =>
                                            handleCheckboxPermissionChange(
                                                permission.id,
                                            )
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ),
            )}
        </TabsContent>
    );
}

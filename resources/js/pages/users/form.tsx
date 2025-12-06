// resources/js/pages/users/form.tsx

// Necessary imports
import { useCallback } from 'react';

// Translation Hook
import { useTrans } from '@/lib/translation';

// Shadnc UI Components
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TabsContent } from '@/components/ui/tabs';

// Types
import type { Role } from '@/types';

// Icons
import AvatarUploader from '@/components/avatar-upload';
import { Combobox, ComboboxOption } from '@/components/ui/combobox';
import { PhoneInput } from '@/components/ui/phone-input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export function InformationsTab({
    errors,
    data,
    setData,
    disabled = false,
    roles,
}: {
    errors: Record<string, string>;
    // Change these any types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setData: any;
    disabled?: boolean;
    roles: Role[];
}) {
    const __ = useTrans();

    const handlePhoneChange = useCallback(
        (v: string) => {
            setData('phone', v);
        },
        [setData],
    );

    const handleRoleChange = useCallback(
        (options: string | string[]) => {
            setData('roles', options);
        },
        [setData],
    );

    const options: ComboboxOption[] = roles.map((role) => ({
        label: role.name,
        value: role.id.toString(),
        selected: data.roles.includes(role.id.toString()),
    }));

    return (
        <TabsContent
            value={'informations'}
            className="grid gap-2 md:grid-cols-3"
        >
            <div className="grid gap-3 md:col-span-2 md:grid-cols-2">
                <div className="col-span-2 grid gap-2">
                    <Label htmlFor="name" indicator={'required'}>
                        {__('users.pages.form.fields.name.label')}
                    </Label>
                    <Input
                        id="name"
                        name="name"
                        autoFocus
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        placeholder={__(
                            'users.pages.form.fields.name.placeholder',
                        )}
                        aria-invalid={errors.name ? 'true' : 'false'}
                        disabled={disabled}
                    />
                </div>

                <div className="col-span-2 grid gap-2">
                    <Label htmlFor="email" indicator={'required'}>
                        {__('users.pages.form.fields.email.label')}
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        placeholder={__(
                            'users.pages.form.fields.email.placeholder',
                        )}
                        disabled={disabled}
                        aria-invalid={errors.email ? 'true' : 'false'}
                    />
                </div>

                <div className="col-span-1 grid gap-2">
                    <Label htmlFor="email_status" indicator={'required'}>
                        {__('users.pages.form.fields.email_status.label')}
                    </Label>

                    <Select
                        value={data.email_verified ? 'yes' : 'no'}
                        disabled={disabled}
                        onValueChange={(value) =>
                            setData('email_verified', value === 'yes')
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue
                                placeholder={__(
                                    'users.pages.form.fields.email_status.placeholder',
                                )}
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="yes">
                                    {__(
                                        'users.pages.form.fields.email_status.verified',
                                    )}
                                </SelectItem>
                                <SelectItem value="no">
                                    {__(
                                        'users.pages.form.fields.email_status.unverified',
                                    )}
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div className="col-span-1 grid gap-2">
                    <Label htmlFor="phone" indicator={'optional'}>
                        {__('users.pages.form.fields.phone.label')}
                    </Label>
                    <PhoneInput
                        id="phone"
                        name="phone"
                        value={data.phone}
                        onChange={handlePhoneChange}
                        placeholder={__(
                            'users.pages.form.fields.phone.placeholder',
                        )}
                        placeholderSearch={__(
                            'users.pages.form.fields.phone.search_placeholder',
                        )}
                        aria-invalid={errors.phone ? 'true' : 'false'}
                        disabled={disabled}
                    />
                </div>

                <div className="col-span-2 grid gap-2">
                    <Label htmlFor="roles" indicator={'required'}>
                        {__('users.pages.form.fields.roles.label')}
                    </Label>

                    <Combobox
                        options={options}
                        multiple={true}
                        searchable={false}
                        onValueChange={(options) => handleRoleChange(options)}
                        placeholder={__(
                            'users.pages.form.fields.roles.placeholder',
                        )}
                        disabled={disabled}
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 items-center justify-items-center gap-2">
                <Label htmlFor="avatar" indicator={'optional'}>
                    {__('users.pages.form.fields.pfp.label')}
                </Label>

                <div className="md:max-w-[250px]">
                    <AvatarUploader
                        defaultUrl={data.avatar_url}
                        disabled={disabled}
                        onFileChange={(file) => {
                            setData('avatar', file);
                        }}
                    />
                </div>
            </div>
        </TabsContent>
    );
}

import { TicketFormData } from './types';

interface FileWrapper {
    file: File;
    [key: string]: unknown;
}

interface TicketFormSchema extends Omit<
    TicketFormData,
    'assignees' | 'attachments'
> {
    assignees: number[];
    attachments: (File | FileWrapper)[];
}

export function prepareTicketFormData(
    data: TicketFormSchema,
    method?: 'POST' | 'PUT' | 'PATCH',
): FormData {
    const formData = new FormData();

    if (method) {
        formData.append('_method', method);
    }

    (Object.keys(data) as Array<keyof TicketFormSchema>).forEach((key) => {
        const value = data[key];

        if (key === 'attachments') {
            const files = value as (File | FileWrapper)[];
            files.forEach((item, index) => {
                if (item instanceof File) {
                    formData.append(`attachments[${index}]`, item);
                } else if ('file' in item && item.file instanceof File) {
                    formData.append(`attachments[${index}]`, item.file);
                }
            });
        } else if (key === 'assignees') {
            const ids = value as number[];
            if (ids.length === 0) {
                formData.append('assignees', '[]');
            } else {
                ids.forEach((userId, index) => {
                    formData.append(`assignees[${index}][id]`, String(userId));
                });
            }
        } else if (value !== null && value !== undefined) {
            if (typeof value === 'boolean') {
                formData.append(key, value ? '1' : '0');
            } else {
                formData.append(key, String(value));
            }
        }
    });

    return formData;
}

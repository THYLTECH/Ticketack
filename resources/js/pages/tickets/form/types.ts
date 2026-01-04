import { FileWithPreview } from '@/hooks/use-file-upload';
import { User } from '@/types';

export interface TicketFormData {
    title: string;
    description: string;
    is_public: boolean;
    is_referenced: boolean;
    detailed_solution: string | null;
    priority_id: number | null;
    status_id: number | null;
    category_id: number | null;
    asset_id: number | null;
    attachments: FileWithPreview[];
    assignees: User[];
}

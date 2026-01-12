import { Asset, Ticket, TicketCategory, TicketPriority, TicketStatus, User } from '@/types';

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

export interface TicketStats {
    total: number;
    open: number;
    unassigned: number;
    resolved: number;
    avg_resolution_days: number;
    assigned_to_me: number;
    archived: number;
}

export interface ArchivedTicketStats {
    total: number;
    resolved: number;
    avg_archive_days: number;
    archived_last_30_days: number;
}

export interface TicketFilterOptions {
    statuses?: TicketStatus[];
    priorities?: TicketPriority[];
    categories?: TicketCategory[];
    assets?: Asset[];
    solvers?: User[];
}

export interface BaseTicketPageProps extends TicketFilterOptions {
    tickets: PaginatedData<Ticket>;
    filters: Record<string, string>;
}


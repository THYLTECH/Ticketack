import { Asset, TicketCategory, User } from '@/types';

export interface SearchResult {
    id: string;
    ticket_id: number;
    title: string;
    snippet: string;
    score: number;
    type: 'ticket' | 'pdf' | 'image' | 'text';
    created_at: string;
    author: {
        name: string;
        avatar?: string | null;
    };
    category?: string;
    solution?: string | null;
    has_solution: boolean;
}
export interface SearchProps {
    users: User[];
    categories: TicketCategory[];
    assets: Asset[];
}

export interface FilterOption {
    value: string;
    label: string;
    color?: string;
}

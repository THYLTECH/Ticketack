import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    unread_notifications: number;
    [key: string]: unknown;
}

export interface Attachment {
    file_path: string;
    file_name?: string;
    mime_type?: string;
    file_extension?: string;
    file_size?: number;
    url: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    attachment_avatar?: string;
    avatar: string | null;
    email_verified_at: string | null;
    language: string;
    timezone: string;
    theme: string;
    color_scheme: string;
    phone?: string;
    created_at: string;
    updated_at: string;
}

export interface Notification {
    id: string;
    type: string;
    data: {
        type: string;
        category: string;
        title: string;
        message: string;
        action?: string | null;
        action_url?: string | null;
    }
    created_at: string;
    read_at: string | null;
}

export interface PaginationProps {
    current_page: number;
    first_page_url: string;
    from : number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
    links: {
        url: string | null;
        active: boolean;
        label: string;
        page: number | null;
    }
}

export interface NotificationPreference {
    user_id: number;
    category: string;
    type: string;
    channel: string;
    enabled: boolean;
}

export interface Language {
    code: string;
    name: string;
}

export interface Timezone {
    value: string;
    utc: string;
} ;

export interface Theme {
    value: string;
}

export interface Color {
    value: string;
    color: string;
}

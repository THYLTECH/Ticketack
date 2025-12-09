import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

// ---------------------------------------
//  Authentication & User Management Types 
// ---------------------------------------

export interface Auth {
    user: User;
}

export interface User {
    id: number;
    name: string;
    email: string;
    attachment_avatar?: string;
    avatar: { url: string } | null;
    email_verified_at: string | null;
    language: string;
    timezone: string;
    theme: string;
    color_scheme: string;
    phone?: string;
    permissions: Permission[];
    roles?: Role[];
    created_at: string;
    updated_at: string;
}

export interface UserSimplified {
    id: number;
    name: string;
    email: string;
    attachment_avatar?: string;
    avatar: { url: string } | null;
    email_verified_at: string | null;
    language: string;
    timezone: string;
    theme: string;
    color_scheme: string;
    phone?: string;
    permissions: Permission[];
    created_at: string;
    updated_at: string;
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

// ---------------------------------------
//  Shared Types
// ---------------------------------------

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

// ---------------------------------------
//  Attachment Types
// ---------------------------------------

export interface Attachment {
    id: number;
    title?: string;
    description?: string;
    file_path: string;
    file_name?: string;
    mime_type?: string;
    file_extension?: string;
    file_size?: number;
    url: string;
}

// ---------------------------------------
//  Role & Permission Types
// ---------------------------------------

export interface Role {
    id: number;
    name: string;
    nbrOfUsers: number;
    permissions: Permission[];
    nbrOfUsers?: number;
    users: UserSimplified[];
    created_at: string;
    updated_at: string;
}

export interface Permission {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
}

// ---------------------------------------
//  Notification Types
// ---------------------------------------

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

export interface NotificationPreference {
    user_id: number;
    category: string;
    type: string;
    channel: string;
    enabled: boolean;
}

// ---------------------------------------
//  Asset Types
// ---------------------------------------

export interface Asset {
    id: string;
    title: string;
    description: string;
    parent_id: string | null;
    parent: Asset | null;
    icon: string | null;
    attributes: AssetAttribute[];
    attachments: Attachment[];
    depth_level?: number;
    updated_at: string;
    created_at: string;
}

export interface AssetAttribute {
    id: string;
    key: string;
    value: string;
}

// ---------------------------------------
//  Ticket Types
// ---------------------------------------

export interface Ticket {
    id: number;

    user: UserSimplified;
    priority: TicketPriority;
    status: TicketStatus;
    category: TicketCategory;
    asset: Asset;

    assignees: UserSimplified[];
    comments: TicketComment[];
    logs: TicketLog[];
    entries: TicketEntry[];
    schedules: TicketSchedule[];
    attachments: Attachment[];

    title: string;
    description: string;
    updated_at: string;
    created_at: string;
}

export interface TicketPriority {
    id: number;

    title: string;
    description: string;
    sort_order: number;
    color: string;

    created_at: string;
    updated_at: string;
}

export interface TicketStatus {
    id: number;

    title: string;
    description: string;
    sort_order: number;
    color: string;
    is_default: boolean;
    is_closed: boolean;
    progress: number;

    created_at: string;
    updated_at: string;
}

export interface TicketCategory {
    id: number;

    title: string;
    description: string;
    sort_order: number;
    color: string;
    icon: IconPickerProps['value'] | undefined;

    created_at: string;
    updated_at: string;
}

export interface TicketComment {
    id: number;

    user: UserSimplified;
    parent: TicketComment | null;
    
    attachments: Attachment[];
    
    content: string;
    created_at: string;
    updated_at: string;
}

export interface TicketLog {
    id: number;

    user: UserSimplified;

    action: string;
    field: string | null;
    old_value: string | null;
    new_value: string | null;

    created_at: string;
    updated_at: string;
}

export interface TicketEntry {
    id: number;

    user: UserSimplified;

    note: string | null;
    start_at: string;
    end_at: string;
    duration_seconds: number;
    billable: boolean;

    created_at: string;
    updated_at: string;
}

export interface TicketSchedule {
    id: number;

    user: UserSimplified;

    start_at: string;
    end_at: string;
    duration_minutes: number;

    created_at: string;
    updated_at: string;
}
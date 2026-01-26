<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Onboarding Tutorial Translations
    |--------------------------------------------------------------------------
    |
    */

    'actions' => [
        'next' => 'Next',
        'previous' => 'Previous',
        'skip' => 'Close',
        'finish' => 'Finish',
    ],

    'welcome' => [
        'title' => 'Welcome to Ticketack !',
        'description' => 'Your space to manage support requests simply and efficiently.',
        'tip_1' => 'Explore the app at your own pace. Help bubbles will appear on each new page to guide you.',
        'button' => 'Let\'s go !',
    ],

    'home' => [
        'tabs' => [
            'title' => 'Your tickets',
            'description' => 'Access all your personal tickets here. Switch between pending and resolved tickets.',
        ],
        'open_column' => [
            'title' => 'In Progress',
            'description' => 'Here are your tickets waiting for a response or action. Keep an eye on them !',
        ],
        'closed_column' => [
            'title' => 'Resolved',
            'description' => 'Find the history of your recently processed requests here.',
        ],
    ],

    'tickets' => [
        'list' => [
            'title' => 'All tickets',
            'description' => 'A complete overview. Use filters and search to find any ticket.',
        ],
        'filters' => [
            'title' => 'Smart filters',
            'description' => 'Refine your search by status, priority, or category in one click.',
        ],
    ],

    'ticket_detail' => [
        'info_tab' => [
            'title' => 'Information',
            'description' => 'All essential ticket details are here : description, priority, and attachments.',
        ],
        'properties' => [
            'title' => 'Properties',
            'description' => 'Quickly view status, priority, and other key ticket attributes.',
        ],
        'comments_tab' => [
            'title' => 'Discussion',
            'description' => 'Chat with support here. You will be notified of each new response.',
        ],
        'calendar_tab' => [
            'title' => 'Schedule',
            'description' => 'View planned interventions related to this ticket.',
        ],
        'logs_tab' => [
            'title' => 'History',
            'description' => 'Trace every action taken on this ticket since its creation.',
        ],
    ],

    'create_ticket' => [
        'form' => [
            'title' => 'New Request',
            'description' => 'Describe your issue as precisely as possible to help us solve it quickly.',
        ],
    ],

    'notifications' => [
        'list' => [
            'title' => 'Notification Center',
            'description' => 'Find everything that happened while you were away here. Click to mark as read.',
        ],
        'fake' => [
            'title' => 'Welcome! 🎉',
            'message' => 'This is a test notification to show you how they appear.',
        ],
    ],

    'archived' => [
        'list' => [
            'title' => 'Archived Tickets',
            'description' => 'Find archived tickets here. They are read-only.',
        ],
    ],

    'settings' => [
        'profile' => [
            'title' => 'User Profile',
            'description' => 'Manage your personal information here. Use the sidebar to access other settings.',
        ],
        'appearance' => [
            'theme' => [
                'title' => 'Theme',
                'description' => 'Choose between light, dark, or system mode.',
            ],
            'color' => [
                'title' => 'Accent Color',
                'description' => 'Customize the main interface color.',
            ],
        ],
        'notifications' => [
            'preferences' => [
                'title' => 'Notification Preferences',
                'description' => 'Configure precisely which emails or notifications you want to receive.',
            ],
        ],
    ],

    'planning' => [
        'calendar' => [
            'title' => 'Your Planning',
            'description' => 'This is the intervention calendar. Each block represents a scheduled task.',
        ],
        'edit_mode' => [
            'title' => 'Edit Mode',
            'description' => 'Enable this mode to schedule new interventions. A sidebar will appear with your tickets.',
        ],
        'sidebar' => [
            'title' => 'Tickets to Schedule',
            'description' => 'Drag a ticket from this list onto the calendar to schedule it.',
        ],
        'filters' => [
            'title' => 'Filter by Solver',
            'description' => 'Check solvers to see only their schedules.',
        ],
        'demo_event' => [
            'title' => 'Sample Task',
            'description' => 'Technical Intervention - Server Maintenance',
        ],
        'demo_ticket' => [
            'title' => 'Ticket to Schedule',
            'description' => 'Hardware installation request',
        ],
    ],

    'time_entries' => [
        'stats' => [
            'title' => 'Your Statistics',
            'description' => 'Summary of your hours worked. This counter updates in real time.',
        ],
        'table' => [
            'title' => 'Entry History',
            'description' => 'All your time entries are listed here. Click to edit or delete.',
        ],
        'demo_entry' => [
            'title' => 'Sample Entry',
            'description' => 'New Feature Development',
        ],
    ],

    'knowledge' => [
        'search' => [
            'title' => 'AI Search',
            'description' => 'Type your question in natural language. AI will find relevant tickets and documents.',
        ],
        'filters' => [
            'title' => 'Refine Results',
            'description' => 'Use these filters to target your searches by date, author, or category.',
        ],
    ],

    'assignment' => [
        'stats' => [
            'title' => 'Unassigned Tickets',
            'description' => 'Overview of tickets awaiting assignment with their priorities.',
        ],
        'table' => [
            'title' => 'Ticket List',
            'description' => 'Click "Assign" to attribute a ticket to one or more team members.',
        ],
        'demo_ticket' => [
            'title' => 'Sample Ticket',
            'description' => 'Awaiting assignment - IT Support Request',
        ],
    ],
    
    'assets' => [
        'table' => [
            'title' => 'Assets Inventory',
            'description' => 'View and manage all your organization\'s assets here.',
        ],
        'demo_asset' => [
            'title' => 'Sample Asset',
            'description' => 'MacBook Pro 16" - Engineering Dept',
        ],
    ],

    'users' => [
        'table' => [
            'title' => 'User Directory',
            'description' => 'Manage accounts for all users.',
        ],
        'demo_user' => [
            'name' => 'John Doe',
        ],
    ],

    'roles' => [
        'table' => [
            'title' => 'Roles & Permissions',
            'description' => 'Define what users can do in the system by assigning roles.',
        ],
        'demo_role' => [
            'title' => 'Manager',
        ],
    ],

    'trash' => [
        'tabs' => [
            'title' => 'Categories',
            'description' => 'Switch between deleted tickets, users, assets, and roles.',
        ],
        'retention' => [
            'title' => 'Retention Policy',
            'description' => 'Configure how long items are kept before being permanently deleted.',
        ],
        'table' => [
            'title' => 'Restorable Items',
            'description' => 'Items are kept here for the retention period configured in the system.
             You can restore them or permanently delete them.',
        ],
        'demo_item' => [
            'title' => 'Deleted Item',
        ],
    ],

];

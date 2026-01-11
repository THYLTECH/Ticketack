<?php

return [
    'assets' => [
        'title' => 'Assets',
        'description' => 'Manage permissions related to assets.',
        'items' => [
            'view' => ['title' => 'View Assets', 'description' => 'Allow access to the index page of assets.'],
            'show' => ['title' => 'Show Asset Details', 'description' => 'Allow viewing detailed information of an asset.'],
            'create' => ['title' => 'Create Assets', 'description' => 'Allow creating new assets.'],
            'update' => ['title' => 'Update Assets', 'description' => 'Allow updating existing assets.'],
            'delete' => ['title' => 'Delete Assets', 'description' => 'Allow deleting assets.'],
            'restore' => ['title' => 'Restore Assets', 'description' => 'Allow restoring deleted assets.'],
            'force delete' => ['title' => 'Permanently Delete Assets', 'description' => 'Allow permanently deleting assets.'],
        ],
    ],

    'users' => [
        'title' => 'Users',
        'description' => 'Manage permissions related to users.',
        'items' => [
            'view' => ['title' => 'View Users', 'description' => 'Allow access to the index page of users.'],
            'show' => ['title' => 'Show User Details', 'description' => 'Allow viewing detailed information of a user.'],
            'create' => ['title' => 'Create Users', 'description' => 'Allow creating new users.'],
            'update' => ['title' => 'Update Users', 'description' => 'Allow updating existing users.'],
            'delete' => ['title' => 'Delete Users', 'description' => 'Allow deleting users.'],
        ],
    ],

    'roles' => [
        'title' => 'Roles',
        'description' => 'Manage permissions related to roles.',
        'items' => [
            'view' => ['title' => 'View Roles', 'description' => 'Allow access to the index page of roles.'],
            'show' => ['title' => 'Show Role Details', 'description' => 'Allow viewing detailed information of a role.'],
            'create' => ['title' => 'Create Roles', 'description' => 'Allow creating new roles.'],
            'update' => ['title' => 'Update Roles', 'description' => 'Allow updating existing roles.'],
            'delete' => ['title' => 'Delete Roles', 'description' => 'Allow deleting roles.'],
        ],
    ],

    'tickets' => [
        'title' => 'Tickets',
        'description' => 'Manage permissions related to tickets.',
        'items' => [
            'view' => ['title' => 'View Tickets', 'description' => 'Allow access to the index page of tickets.'],
            'show' => ['title' => 'Show Ticket Details', 'description' => 'Allow viewing detailed information of a ticket.'],
            'create' => ['title' => 'Create Tickets', 'description' => 'Allow creating new tickets.'],
            'be assigned' => ['title' => 'Be Assigned Tickets', 'description' => 'Allow being assigned to tickets and self-assign.'],
            'assign' => ['title' => 'Assign Tickets', 'description' => 'Allow assigning tickets to other users.'],
            'update' => ['title' => 'Update Tickets', 'description' => 'Allow updating existing tickets.'],
            'delete' => ['title' => 'Delete Tickets', 'description' => 'Allow deleting tickets.'],
            'restore' => ['title' => 'Restore Tickets', 'description' => 'Allow restoring deleted tickets.'],
            'force delete' => ['title' => 'Permanently Delete', 'description' => 'Allow permanently deleting tickets.'],
            'archive' => ['title' => 'Archive Tickets', 'description' => 'Allow archiving tickets.'],
            'unarchive' => ['title' => 'Unarchive Tickets', 'description' => 'Allow unarchiving tickets.'],
            'view all archived' => ['title' => 'View All Archived Tickets', 'description' => 'Allow viewing all archived tickets from all users.'],
            'manage priority' => ['title' => 'Manage Ticket Priorities', 'description' => 'Allow managing ticket priorities.'],
            'manage status' => ['title' => 'Manage Ticket Statuses', 'description' => 'Allow managing ticket statuses.'],
            'manage category' => ['title' => 'Manage Ticket Categories', 'description' => 'Allow managing ticket categories.'],
        ],
    ],

    'entries' => [
        'title' => 'Time Entries',
        'description' => 'Manage time tracking on tickets.',
        'items' => [
            'view ticket' => ['title' => 'View Entries', 'description' => 'Allow viewing time entries.'],
            'create ticket' => ['title' => 'Create Entries', 'description' => 'Allow logging new time entries.'],
            'update ticket' => ['title' => 'Update Entries', 'description' => 'Allow modifying existing time entries.'],
            'delete ticket' => ['title' => 'Delete Entries', 'description' => 'Allow deleting time entries.'],
        ],
    ],

    'knowledge' => [
        'title' => 'Knowledge Base',
        'description' => 'Access the knowledge explorer.',
        'items' => [
            'view explorer' => ['title' => 'View Knowledge', 'description' => 'Access the knowledge explorer interface.'],
        ],
    ],

    'trash' => [
        'title' => 'Trash',
        'description' => 'Manage deleted items.',
        'items' => [
            'view' => ['title' => 'View Trash', 'description' => 'Access the recycle bin.'],
            'edit' => ['title' => 'Manage Trash', 'description' => 'Perform actions in the trash.'],
            'restore' => ['title' => 'Restore Items', 'description' => 'Restore items from trash.'],
            'force delete' => ['title' => 'Empty Trash', 'description' => 'Permanently delete items from trash.'],
        ],
    ],

    'planning' => [
        'title' => 'Planning',
        'description' => 'Manage schedule and planning.',
        'items' => [
            'view' => ['title' => 'View Planning', 'description' => 'Access the planning view.'],
            'manage' => ['title' => 'Manage Planning', 'description' => 'Create and edit schedule events.'],
        ],
    ],
];

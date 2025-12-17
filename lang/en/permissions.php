<?php

return [
    'assets' => [
        'title' => 'Assets',
        'description' => 'Manage permissions related to assets.',

        'items' => [
            'view' => [
                'title' => 'View Assets',
                'description' => 'Allow access to the index page of assets.',
            ],
            'show' => [
                'title' => 'Show Asset Details',
                'description' => 'Allow viewing detailed information of an asset.',
            ],
            'create' => [
                'title' => 'Create Assets',
                'description' => 'Allow creating new assets.',
            ],
            'update' => [
                'title' => 'Update Assets',
                'description' => 'Allow updating existing assets.',
            ],
            'delete' => [
                'title' => 'Delete Assets',
                'description' => 'Allow deleting assets.',
            ],
            'restore' => [
                'title' => 'Restore Assets',
                'description' => 'Allow restoring deleted assets.',
            ],
            'force delete' => [
                'title' => 'Permanently Delete Assets',
                'description' => 'Allow permanently deleting assets from the system.',
            ],
        ],
    ],

    'roles' => [
        'title' => 'Roles',
        'description' => 'Manage permissions related to roles.',

        'items' => [
            'view' => [
                'title' => 'View Roles',
                'description' => 'Allow access to the index page of roles.',
            ],
            'show' => [
                'title' => 'Show Role Details',
                'description' => 'Allow viewing detailed information of a role.',
            ],
            'create' => [
                'title' => 'Create Roles',
                'description' => 'Allow creating new roles.',
            ],
            'update' => [
                'title' => 'Update Roles',
                'description' => 'Allow updating existing roles.',
            ],
            'delete' => [
                'title' => 'Delete Roles',
                'description' => 'Allow deleting roles.',
            ],
        ],
    ],

    'users' => [
        'title' => 'Users',
        'description' => 'Manage permissions related to users.',

        'items' => [
            'view' => [
                'title' => 'View Users',
                'description' => 'Allow access to the index page of users.',
            ],
            'show' => [
                'title' => 'Show User Details',
                'description' => 'Allow viewing detailed information of a user.',
            ],
            'create' => [
                'title' => 'Create Users',
                'description' => 'Allow creating new users.',
            ],
            'update' => [
                'title' => 'Update Users',
                'description' => 'Allow updating existing users.',
            ],
            'delete' => [
                'title' => 'Delete Users',
                'description' => 'Allow deleting users.',
            ],
        ],
    ],

    'tickets' => [
        'title' => 'Tickets',
        'description' => 'Manage permissions related to tickets.',

        'items' => [
            'view' => [
                'title' => 'View Tickets',
                'description' => 'Allow access to the index page of tickets.',
            ],
            'show' => [
                'title' => 'Show Ticket Details',
                'description' => 'Allow viewing detailed information of a ticket.',
            ],
            'create' => [
                'title' => 'Create Tickets',
                'description' => 'Allow creating new tickets.',
            ],
            'update' => [
                'title' => 'Update Tickets',
                'description' => 'Allow updating existing tickets.',
            ],
            'delete' => [
                'title' => 'Delete Tickets',
                'description' => 'Allow deleting tickets.',
            ],
            'restore' => [
                'title' => 'Restore Tickets',
                'description' => 'Allow restoring deleted tickets.',
            ],
            'force delete' => [
                'title' => 'Permanently Delete Tickets',
                'description' => 'Allow permanently deleting tickets from the system.',
            ],
        ],
    ],
];

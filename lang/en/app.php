<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Flash messages
    |--------------------------------------------------------------------------
    |
    */

    /*
    |--------------------------------------------------------------------------
    | Pages content
    |--------------------------------------------------------------------------
    |
    */

    'layout' => [
        'sidebar' => [
            'menugroups' => [
                'platform' => [
                    'title' => 'Platform',
                    'items' => [
                        'home'      => 'Home',
                        'dashboard' => 'Dashboard',
                        'tickets'   => 'Tickets',
                        'assets'    => 'Assets',
                        'roles'     => 'Roles',
                        'users'     => 'Users',
                        'planning' => 'Planning',
                        'trash'     => 'Trash',
                        'entries'    => 'Time Entries',
                    ],
                ],
                'footer' => [
                    'title' => '',
                    'items' => [
                        'repository' => 'Repository',
                        'documentation' => 'Documentation',
                    ],
                ],
            ],
            'usermenu' => [
                'items' => [
                    'notifications' => 'Notifications',
                    'settings' => 'Settings',
                    'logout' => 'Logout',
                ],
            ],
            'actions' => [
                'create_ticket' => 'Create ticket',
            ],
        ],
    ],

];

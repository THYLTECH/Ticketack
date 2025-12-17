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
                        'trash'     => 'Trash'
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
        ],
    ],

];

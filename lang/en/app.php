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
                        'dashboard' => 'Dashboard',
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

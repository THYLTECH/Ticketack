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

    'pages' => [
        'breadcrumbs' => [
            'dashboard' => 'Dashboard',
        ],
        'description' => 'Overview of system statistics',
        'title' => 'Dashboard',
        'tabs' => [
            'global_statistics' => 'Global Statistics',
            'ticket_statistics' => 'Ticket Statistics',
            'user_statistics' => 'User Statistics',
            'asset_statistics' => 'Asset Statistics',
        ],
        'stats' => [
            'global_statistics' => [
                'total_assets' => 'Number of Assets',
                'total_users' => 'Number of Users',
                'avg_resolution_time' => 'Average Resolution Time',
            ]
        ],

    ],

];
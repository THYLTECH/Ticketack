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
                'activity_title' => 'Ticket Activity',
            ],
            'ticket_statistics' => [
                'total_tickets' => 'Total Tickets',
                'by_status' => 'Tickets by Status',
                'by_priority' => 'Tickets by Priority',
                'by_category' => 'Tickets by Category',
                'indicator'=>
                [
                    'status' => 'Status',
                    'priority' => 'Priority',
                    'category' => 'Category',
                ]
            ],
            'user_statistics' => [
                'assigned_tickets' => 'Top 5 Users by Assigned Tickets',
                'created_tickets' => 'Top 5 Users by Created Tickets',
                'resolved_tickets' => 'Top 5 Users by Resolved Tickets',
                'time_to_resolve' => 'Top 5 Users by Time to Resolve Tickets',
            ],
            'asset_statistics' => [
                'description' =>'Ranking of assets by number of linked tickets',
                'by_attribute' => 'Usage of Asset Attributes',
            ],
            'no_data' => 'No data available',
        ],
        'filters' => [
            'period' => 'Period',
            'label'=> [
                'filter' => 'Chart filters',
                'limit' => 'Number of item',
            ]
        ]

    ],

];
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
                'assigned_tickets' => 'Users who Assigned the Most Tickets',
                'created_tickets' => 'Users Who Created the Most Tickets',
                'resolved_tickets' => 'Users Who Resolved the Most Tickets',
                'time_to_resolve' => 'Users Who Spend the Most Time on Tickets',
            ],
            'asset_statistics' => [
                'description' =>'Most Used Assets Across Tickets',
                'by_attribute' => 'Most Used Attributes Across Assets',
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
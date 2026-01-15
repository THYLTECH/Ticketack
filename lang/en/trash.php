<?php

return [
    'pages' => [
        'breadcrumbs' => [
            'index' => 'Trash',
        ],
        'index' => [
            'head_title' => 'Trash',
            'title' => 'Trash',
            'description' => 'View and manage items that have been deleted.',
            'search_placeholder' => 'Search deleted items...',
            'warning_permanent' => 'Warning: Deleting an item from this page is permanent and irreversible.',
            'empty' => [
                'title' => 'This section is empty',
                'search_title' => 'No results found',
                'description' => 'No items of type {type} in the trash.',
                'search_description' => 'No items match your search "{term}".',
                'clear_filters' => 'Clear filters',
            ],
            'table' => [
                'headers' => [
                    'name' => 'Name / Identification',
                    'deleted_at' => 'Deleted at',
                    'actions' => 'Actions',
                    'roles' => 'Roles',
                    'users' => 'Users',
                    'tickets' => 'Tickets',
                    'permissions' => 'Permissions',
                ],
                'cells' => [
                    'created_tickets' => 'created tickets',
                    'linked_tickets' => 'linked tickets',
                ]
            ],
            'buttons' => [
                'restore' => 'Restore',
                'force_delete' => 'Permanently delete',
                'force_delete_short' => 'Delete',
                'clear_search' => 'Clear search',
            ],
            'toolbar' => [
                'title' => 'Delete/Restore',
                'search' => 'Search deleted items...',
                'retention' => 'Permanently deleted after : ',
                'auto_delete_after' => 'days',
            ]
        ],
    ],
    'tabs' => [
        'tickets' => 'Tickets',
        'users' => 'Users',
        'assets' => 'Assets',
        'roles' => 'Roles',
    ],
    'toolbar' => [
        'retention' => 'Retention',
        'auto_delete_after' => 'Auto-delete items older than',
    ],
    'table' => [
        'badges' => [
            'linked_tickets' => 'Linked tickets',
            'created_tickets' => 'tickets',
        ]
    ],
    'retention' => [
        'critical' => ':days days - Critical',
        'warning' => ':days days - Warning',
        'remaining' => ':days days left',
    ],
    'common' => [
        'item_unnamed' => 'Item',
        'unknown' => 'Unknown',
        'selected' => 'selected',
        'all_items' => 'all items',
        'items' => 'items',
    ],
    'modals' => [
        'delete' => [
            'title' => 'Permanent deletion',
            'description_prefix' => 'You are about to permanently delete',
            'bulk_description_prefix' => 'You are about to permanently delete',
            'description_suffix' => 'This action is irreversible and cannot be undone.',
            'warning' => 'This action cannot be undone and data will be lost forever.',
            'buttons' => [
                'cancel' => 'Cancel',
                'confirm' => 'Confirm',
                'deleting' => 'Deleting...',
            ],
        ],
        'empty' => [
            'title' => 'Empty Trash',
            'description' => 'Are you sure you want to permanently delete all items in this section?',
        ],
        'retention' => [
            'title' => 'Set retention period',
            'description' => 'Set the retention period for items in this section.',
            'days' => 'days',
            'cancel' => 'Cancel',
            'buttons' => [
                'confirm' => 'Confirm',
                'cancel' => 'Cancel',
            ]
        ]
    ],
    'buttons' => [
        'restore_selected' => 'Restore selected',
        'delete_selected' => 'Permanently delete',
        'empty_trash' => 'Empty Trash',
    ],
    'console' => [
        'pruning' => 'Pruning :type trash - Deleting items deleted before :date (retention: :days days)',
        'summary' => 'Trash pruning complete. Total items permanently deleted: :count.',
    ],
    'notifications' => [
        'restored_title' => 'Restored',
        'restored_description' => 'The item has been successfully restored.',
        'bulk_restored_title' => 'Items restored',
        'bulk_restored_description' => '{count} items have been successfully restored.',
        'deleted_title' => 'Deleted',
        'deleted_description' => 'The item(s) have been permanently deleted.',
        'restored' => '{1} :count item has been restored.|[2,*] :count items have been restored.',
        'deleted' => '{1} :count item has been permanently deleted.|[2,*] :count items have been permanently deleted.',
        'emptied' => 'The :type trash has been emptied.',
    ],
];

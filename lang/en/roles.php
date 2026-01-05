<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Flash
    |--------------------------------------------------------------------------
    |
    */
    'flash' => [
        'created' => 'Role created successfully.',
        'updated' => 'Role updated successfully.',
        'delete_error' => 'Cannot delete role assigned to users.',
        'deleted' => 'Role deleted successfully.',
    ],

    /*
    |--------------------------------------------------------------------------
    | Pages
    |--------------------------------------------------------------------------
    |
    */

    'pages' => [
        'breadcrumbs' => [
            'index' => 'Roles',
            'create' => 'Create a Role',
            'show' => 'View Role',
            'edit' => 'Edit Role',
        ],
        'index' => [
            'head_title' => 'Roles',
            'title' => 'Roles',
            'description' => 'Manage and view all your roles in one place.',
            'search_placeholder' => 'Search a role...',
            'empty_search' => 'No roles found matching your search.',

            'buttons' => [
                'create' => 'Create a Role',
            ],

            'empty' => [
                'title' => 'No roles found',
                'description' => 'Get started by creating your first role.',
                'button' => 'Refresh',
            ],

            'table' => [
                'columns' => [
                    'name' => 'Name',
                    'users' => 'Nbr of Users',
                    'permissions' => 'Nbr of Permissions',
                    'updated_at' => 'Last Updated',
                    'created_at' => 'Created At',
                ],
                'badges' => [
                    'system' => 'System',
                ],
                'actions' => [
                    'label' => 'Actions',
                    'view' => 'View',
                    'edit' => 'Edit',
                    'delete' => 'Delete',
                ],
            ],
        ],
        'create' => [
            'head_title' => 'Create a Role',

            'title' => 'Create a Role',
            'description' => 'Fill out the form below to create a new role.',
        ],
        'edit' => [
            'head_title' => 'Edit Role :title',

            'title' => 'Edit Role :title',
            'description' => 'Modify the details of the role below.',
        ],
        'show' => [
            'head_title' => 'View Role :title',

            'title' => 'View Role :title',
            'description' => 'View the details of this role.',
        ],
        'form' => [
            'buttons' => [
                'back' => 'Go back to roles',
                'store' => 'Store Role',
                'update' => 'Update Role',
                'delete' => 'Delete Role',
                'edit' => 'Edit Role',
            ],
            'tabs' => [
                'informations' => 'Informations',
                'permissions' => 'Permissions',
                'users' => 'Users',
            ],
            'fields' => [
                'name' => [
                    'label' => 'Name',
                    'placeholder' => 'Enter role name',
                    'description' => 'The display name of the role in the application.',
                    'system_helper' => 'This is a system role and cannot be renamed.',
                    'system_badge' => 'System Role',
                ],
            ],
            'users' => [
                'assigned_title' => 'Assigned Users',
                'filter_placeholder' => 'Filter in list...',
                'filter_empty' => 'No users match ":search"',
                'filter_clear' => 'Clear search',
                'dialog' => [
                    'trigger' => 'Add Users',
                    'title' => 'Add Users',
                    'search_placeholder' => 'Search by name or email...',
                    'search_empty' => 'No results for ":search"',
                    'description' => 'Select users to add to this role.',
                    'empty' => [
                        'title' => 'No users found.',
                        'description' => 'All users are already assigned to this role.',
                    ],

                    'table' => [
                        'columns' => [
                            'name' => 'Name',
                            'email' => 'Email',
                        ],
                        'actions' => [
                            'add' => 'Add',
                        ],
                    ],

                    'buttons' => [
                        'close' => 'Close',
                    ],
                ],
                'table' => [
                    'columns' => [
                        'name' => 'Name',
                        'email' => 'Email',
                        'actions' => 'Actions',
                    ],
                    'actions' => [
                        'remove' => 'Remove',
                    ],
                ],
                'you' => 'You',

                'empty' => [
                    'title' => 'No users found.',
                    'description' => 'This role has no users assigned yet.',
                    'action' => 'Add Users',
                ],

                'flash' => [
                    'added' => 'Users added to role successfully.',
                    'removed' => 'User removed from role successfully.',
                ],
            ],
        ],
        'delete' => [
            'title' => 'Are you sure you want to delete this role?',
            'description' => 'This action cannot be undone. This will permanently delete the role titled \':title\'.',
            'buttons' => [
                'cancel' => 'Cancel',
                'confirm' => 'Yes, delete role',
            ],
        ],
    ],
];

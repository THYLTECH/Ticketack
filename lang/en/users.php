<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Flash
    |--------------------------------------------------------------------------
    |
    */
    'flash' => [
        'created' => 'User created successfully.',
        'updated' => 'User updated successfully.',
        'deleted' => 'User deleted successfully.',
    ],

    /*
    |--------------------------------------------------------------------------
    | Pages
    |--------------------------------------------------------------------------
    |
    */

    'pages' => [
        'breadcrumbs' => [
            'index' => 'Users',
            'create' => 'Create a User',
            'show' => 'View User',
            'edit' => 'Edit User',
        ],

// 
        'index' => [
            'head_title' => 'Users',

            'title' => 'Users',
            'description' => 'Manage and view all your roles in one place.',

            'buttons' => [
                'create' => 'Create a User',
            ],

            'empty' => [
                'title' => 'No users found',
                'description' => 'Get started by creating your first user.',
                'button' => 'Refresh',
            ],

            'table' => [
                'columns' => [
                    'pfp' => 'Profile Picture',
                    'name' => 'Name',
                    'email' => 'Email',
                    'email_status' => 'Email Status',
                    'roles' => 'Roles',
                    'updated_at' => 'Last Updated',
                    'created_at' => 'Created At',
                ],
                'labels' => [
                    'you' => 'You',
                    'email_verified' => 'Verified',
                    'email_unverified' => 'Unverified',
                ]
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
                ],
            ],
            'users' => [
                'dialog' => [

                    'trigger' => 'Add Users',
                    'title' => 'Add Users',
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

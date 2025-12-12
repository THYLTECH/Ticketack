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
            'description' => 'Manage and view every user in one place.',

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
            'head_title' => 'Create a User',

            'title' => 'Create a User',
            'description' => 'Fill out the form below to create a new user.',
        ],
        'edit' => [
            'head_title' => 'Edit User :name',

            'title' => 'Edit User :name',
            'description' => 'Modify the details of the user below.',
        ],
        'show' => [
            'head_title' => 'View User :name',

            'title' => 'View User :name',
            'description' => 'View the details of this user.',
        ],
        'form' => [
            'buttons' => [
                'back' => 'Go back to users',
                'store' => 'Store User',
                'update' => 'Update User',
                'delete' => 'Delete User',
                'edit' => 'Edit User',
            ],
            'tabs' => [
                'informations' => 'Informations',
            ],
            'fields' => [
                'name' => [
                    'label' => 'Name',
                    'placeholder' => 'eg. John Doe',
                ],
                'email' => [
                    'label' => 'Email Address',
                    'placeholder' => 'eg. user@example.com',
                ],
                'email_status' => [
                    'label' => 'Email Status',
                    'verified' => 'Verified',
                    'unverified' => 'Not Verified',
                    'placeholder' => 'Select verification status',
                ],
                'phone' => [
                    'label' => 'Phone Number',
                    'placeholder' => 'eg. +1234567890',
                    'search_placeholder' => 'eg. United States',
                ],
                'roles' => [
                    'label' => 'Roles',
                    'placeholder' => 'Select roles for the user',
                ],
                'pfp' => [
                    'label' => 'Profile Picture',
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
            'title' => 'Are you sure you want to delete this user?',
            'description' => 'This action cannot be undone. This will permanently delete the user \':name\'.',
            'buttons' => [
                'cancel' => 'Cancel',
                'confirm' => 'Yes, delete user',
            ],
        ],
    ],
];

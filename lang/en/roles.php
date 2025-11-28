<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Flash
    |--------------------------------------------------------------------------
    |
    */

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

            'buttons' => [
                'create' => 'Create a Role',
            ],

            'empty' => [
                'title' => 'No roles found',
                'description' => 'Get started by creating your first role.',
                'button' => 'Refresh',
            ],
        ],
    ],
];

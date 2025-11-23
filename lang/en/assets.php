<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Pages
    |--------------------------------------------------------------------------
    |
    */

    'pages' => [
        'breadcrumbs' => [
            'index' => 'Assets',
            'create' => 'Create Asset',
            'show' => 'View Asset',
            'edit' => 'Edit Asset',
        ],
        'index' => [
            'head_title' => 'Assets',

            'title' => 'Assets',
            'description' => 'Manage and view all your assets in one place.',
        ],
        'create' => [
            'head_title' => 'Create Asset',

            'title' => 'Create an Asset',
            'description' => 'Fill out the form below to create a new asset.',
        ],
        'show' => [
            'head_title' => 'View Asset :title',
            
            'title' => 'View Asset :title',
            'description' => 'View details for asset :title.',
        ],
        'edit' => [
            'head_title' => 'Edit Asset :title',

            'title' => 'Edit Asset :title',
            'description' => 'Edit details for asset :title.',
        ],
    ],
];

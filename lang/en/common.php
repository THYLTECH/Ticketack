<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Flash messages
    |--------------------------------------------------------------------------
    |
    */

    'flash' => [
        'error' => 'An error occurred',
    ],

    /*
    |--------------------------------------------------------------------------
    | Pages content
    |--------------------------------------------------------------------------
    |
    */


    /*
    |--------------------------------------------------------------------------
    | Other
    |--------------------------------------------------------------------------
    |
    */

    'themes' => [
        'light' => 'Light',
        'dark' => 'Dark',
        'system' => 'System',
    ],

    'colors' => [
        'default' => 'Default',
        'blue' => 'Blue',
        'red' => 'Red',
        'green' => 'Green',
        'orange' => 'Orange',
        'rose' => 'Rose',
        'violet' => 'Violet',
        'yellow' => 'Yellow',
    ],

    'errors' => [
        'button_back' => 'Go to homepage',

        'default' => [
            'title' => 'An error occurred',
            'message' => 'An unexpected error has occurred.',
        ],
        '403' => [
            'title' => 'Access denied',
            'message' => 'You do not have permission to access this page.',
        ],
        '404' => [
            'title' => 'Page not found',
            'message' => 'The page you are looking for could not be found.',
        ],
        '500' => [
            'title' => 'Server error',
            'message' => 'An unexpected error occurred on the server.',
        ],
        '501' => [
            'title' => 'Not implemented',
            'message' => 'The requested functionality is not implemented.',
        ],
        '503' => [
            'title' => 'Service unavailable',
            'message' => 'The service is currently unavailable. Please try again later.',
        ],
    ]

];
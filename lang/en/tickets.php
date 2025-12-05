<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Flash
    |--------------------------------------------------------------------------
    |
    */
    'flash' => [
        'created' => 'Ticket created successfully.',
        'updated' => 'Ticket updated successfully.',
        'deleted' => 'Ticket deleted successfully.',
    ],

    /*
    |--------------------------------------------------------------------------
    | Pages
    |--------------------------------------------------------------------------
    |
    */

    'pages' => [
        'breadcrumbs' => [
            'index' => 'Tickets',
            'create' => 'Create a Ticket',
            'show' => 'View Ticket',
            'edit' => 'Edit Ticket',
        ],
        'index' => [
            'head_title' => 'Tickets',

            'title' => 'Tickets',
            'description' => 'Manage and view all your tickets in one place.',

            'buttons' => [
                'create' => 'Create a Ticket',
            ],

            'empty' => [
                'title' => 'No tickets found',
                'description' => 'Get started by creating your first ticket.',
                'button' => 'Refresh',
            ],

            'table' => [
                'columns' => [
                    'title' => 'Title',
                    'updated_at' => 'Last Updated',
                    'created_at' => 'Created At',
                ],
            ],
        ],
        'create' => [
            'head_title' => 'Create Ticket',
            'title' => 'Create a New Ticket',
            'description' => 'Fill out the form below to create a new ticket.',
        ],
        'form' => [
            'buttons' => [
                'back' => 'Go back to tickets',
                'store' => 'Store Ticket',
                'update' => 'Update Ticket',
                'delete' => 'Delete Ticket',
                'edit' => 'Edit Ticket',
            ],
            'tabs' => [
                'informations' => 'Informations',
            ],
            'fields' => [

            ],
        ],
        'delete' => [
            'title' => 'Are you sure you want to delete this ticket?',
            'description' => 'This action cannot be undone. This will permanently delete the ticket titled \':title\'.',
            'buttons' => [
                'cancel' => 'Cancel',
                'confirm' => 'Yes, delete ticket',
            ],
        ],
    ],
];

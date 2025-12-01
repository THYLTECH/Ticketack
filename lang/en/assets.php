<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Flash
    |--------------------------------------------------------------------------
    |
    */

    'flash' => [
        'created' => 'Asset created successfully.',
        'updated' => 'Asset updated successfully.',
        'deleted' => 'Asset deleted successfully.',
        'restored' => 'Asset restored successfully.',
        'forced_deleted' => 'Asset permanently deleted successfully.',
        'invalid_parent' => 'The selected parent asset is invalid.',
    ],

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

            'buttons' => [
                'create' => 'Create Asset',
                'expand' => 'Expand all',
                'collapse' => 'Collapse all',
            ],

            'empty' => [
                'title' => 'No assets found',
                'description' => 'Get started by creating your first asset.',
                'button' => 'Refresh',
            ],

            'table' => [
                'headers' => [
                    'asset' => 'Asset',
                    'updated_at' => 'Last Updated',
                    'created_at' => 'Created At',
                ],
            ],
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
        'delete' => [
            'title' => 'Are you sure you want to delete this asset?',
            'description' => 'This action cannot be undone. This will permanently delete the asset titled \':title\'.',
            'buttons' => [
                'cancel' => 'Cancel',
                'confirm' => 'Yes, delete asset',
            ],
        ],
        'form' => [
            'buttons' => [
                'back' => 'Go back to assets',
                'store' => 'Store Asset',
                'update' => 'Update Asset',
                'delete' => 'Delete Asset',
                'edit' => 'Edit Asset',
            ],
            'tabs' => [
                'informations' => 'Informations',
                'attributes' => 'Attributes',
                'attachments' => 'Attachments',
            ],
            'fields' => [
                'informations' => [
                    'title' => [
                        'label' => 'Title',
                        'placeholder' => 'Enter asset title',
                    ],
                    'parent_asset' => [
                        'label' => 'Parent',
                        'placeholder' => 'Select a parent',
                        'clear' => 'Clear selection',
                    ],
                    'icon' => [
                        'label' => 'Icon',
                    ],
                    'description' => [
                        'label' => 'Description',
                        'placeholder' => 'Enter asset description',
                    ],
                ],
                'attributes' => [
                    'flash' => [
                        'unique_key' => 'Each attribute must have a unique key.',
                        'updated' => 'Attribute updated successfully.',
                        'added' => 'Attribute added successfully.',
                        'deleted' => 'Attribute deleted successfully.',
                    ],

                    'buttons' => [
                        'add_attribute' => 'Add Attribute',
                        'edit_attribute' => 'Edit Attribute',
                        'delete_attribute' => 'Delete Attribute',
                    ],

                    'dialog' => [
                        'title_create' => 'Add Attribute',
                        'title_edit' => 'Edit Attribute',

                        'description_create' => 'Fill out the form below to add a new attribute to this asset.',
                        'description_edit' => 'Update the details of this attribute below.',

                        'fields' => [
                            'key' => [
                                'label' => 'Key',
                                'placeholder' => 'Enter attribute key',
                            ],
                            'value' => [
                                'label' => 'Value',
                                'placeholder' => 'Enter attribute value',
                            ],
                        ],

                        'buttons' => [
                            'cancel' => 'Cancel',
                            'confirm_create' => 'Create attribute',
                            'confirm_edit' => 'Edit attribute',
                        ],
                    ],

                    'fua' => [
                        'title' => 'Frequently used attributes',
                    ],

                    'current' => [
                        'title' => 'Current attributes',
                        'buttons' => [
                            'edit' => 'Edit attribute',
                            'delete' => 'Delete attribute',
                        ],
                        'empty' => 'No attributes created yet.',
                    ],

                ],
                'attachments' => [

                ],
            ],
        ],
    ],
];

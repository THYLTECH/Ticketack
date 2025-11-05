<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Flash messages
    |--------------------------------------------------------------------------
    |
    */

    'flash' => [
        'profile_updated' => 'Profile informations updated successfully.',
        'password_updated' => 'Password updated successfully.',
        'incorrect_current_password' => 'The provided current password is incorrect.',
        'account_deleted' => 'Your account has been deleted successfully.',
        'language_updated' => 'Language preferences updated successfully.',
    ],

    /*
    |--------------------------------------------------------------------------
    | Pages content
    |--------------------------------------------------------------------------
    |
    */

    'pages' => [

        'breadcrumbs' => [
            'settings' => 'Settings',
            'profile' => 'Profile',
            'appearance' => 'Appearance',
            'password' => 'Password',
        ],

        'profile' => [
            'head_title' => 'Profile settings',

            'info_form' => [
                'title' => 'Profile informations',
                'description' => 'Update your profile informations such as name and email address',

                'fields' => [
                    'name' => [
                        'label' => 'Name',
                        'placeholder' => 'Full name',
                    ],
                    'email' => [
                        'label' => 'Email address',
                        'placeholder' => 'Email address',
                    ],
                ],
                'buttons' => [
                    'submit' => 'Save informations',
                ],
            ],

            'lang_form' => [
                'title' => 'Language preferences',
                'description' => 'Choose your preferred language and timezone settings',

                'fields' => [
                    'language' => [
                        'label' => 'Language',
                        'placeholder' => 'Select your language',
                    ],
                    'timezone' => [
                        'label' => 'Timezone',
                        'placeholder' => 'Select your timezone',
                    ],
                ],
                'buttons' => [
                    'submit' => 'Save preferences',
                ],
            ],

            'delete_account' => [
                'title' => 'Delete account',
                'description' => 'Delete your account and all of its resources',

                'caution_title' => 'Warning',
                'caution_description' => 'Please proceed with caution, this cannot be undone.',

                'dialog' => [
                    'trigger' => 'Delete account',
                    'title' => 'Are you sure you want to delete your account?',
                    'description' => 'Once your account is deleted, all of its resources and data will also be permanently deleted. Please enter your password to confirm you would like to permanently delete your account.',
                    'fields' => [
                        'password' => [
                            'label' => 'Password',
                            'placeholder' => 'Enter your password',
                        ],
                    ],
                    'buttons' => [
                        'cancel' => 'Cancel',
                        'confirm' => 'Delete account',
                    ],
                ],
            ],
        ],

        'appearance' => [

        ],
        'password' => [

        ],
    ],
];

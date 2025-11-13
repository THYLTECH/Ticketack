<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Notification Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines are used during notification sending for various
    | messages that we need to display to the user. You are free to modify
    | these language lines according to your application's requirements.
    |
    */

    'sms' => [
        'Example' => [
            'content' => 'Example',
        ],
    ],

    'database' => [
        'registered' => [
            'title' => 'Welcome to :app!',
            'message' => 'Your account has been successfully created on :app. We’re glad to have you on board.',
            'action' => 'Log in to my account',
        ],
    ],

    'mail' => [
        'greeting' => 'Hello :name,',
        'thanks' => 'Thanks for your trust,',
        'team' => 'The :app Team',
        'all_rights_reserved' => 'All rights reserved',

        'password_reset' => [
            'subject' => ':app — Reset your password',
            'title' => 'Reset your password',
            'intro' => 'You requested a password reset. Click the button below.',
            'expires' => 'This link will expire in 60 minutes.',
            'button' => 'Reset my password',
            'ignore' => 'If you did not request this, please ignore this email.',
        ],

        'registered' => [
            'subject' => ':app — Welcome!',
            'title' => 'Welcome to :app!',
            'intro' => 'Your account has been successfully created on :app. We’re glad to have you on board.',
            'button' => 'Log in to my account',
            'body' => 'You can now log in and start using all features of the platform.',
        ],

        'verify_email' => [
            'subject' => ':app — Verify your email address',
            'title' => 'Verify your email address',
            'intro' => 'Thanks for signing up on :app. To complete your registration, please verify your email address by clicking the button below.',
            'button' => 'Verify my email address',
            'ignore' => 'If you did not create an account on :app, please ignore this email.',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Notification Preferences
    |--------------------------------------------------------------------------
    |
    */

    'preferences' => [
        'auth' => [
            'title' => 'Authentication',
            'description' => 'Manage notifications related to your account security and authentication events. If no channels are selected, the notification will by default be sent by email.',
            'items' => [
                'user_registered' => [
                    'title' => 'New account registration',
                    'description' => 'Receive a confirmation when your account is successfully created.',
                ],
                'password_reset' => [
                    'title' => 'Password reset request',
                    'description' => 'Get notified whenever a password reset is requested for your account.',
                ],
                'verify_email' => [
                    'title' => 'Email verification',
                    'description' => 'Be alerted when an email verification is required or completed.',
                ],
            ],
        ],
    ],

    'channels' => [
        'mail' => 'Email',
        'database' => 'Database',
        'vonage' => 'SMS',
    ],

    /*
    |--------------------------------------------------------------------------
    | Pages
    |--------------------------------------------------------------------------
    |
    */

    'pages' => [
        'breadcrumbs' => [
            'index' => 'Notifications',
        ],
        'index' => [
            'head_title' => 'Notifications',

            'title' => 'Your Notifications',
            'description' => 'Manage and view all your notifications in one place.',

            'bulk_actions' => [
                'text' => 'You selected :count notification(s), you can',
                'mark_as_read' => 'mark them as read',
                'or' => 'or',
                'delete' => 'delete them.',
            ],

            'search' => [
                'label' => 'Search',
                'placeholder' => 'Search notifications...',
                'button' => 'Search',
            ],

            'empty' => [
                'title' => 'No Notifications',
                'description' => 'You\'re all caught up. New notifications will appear here.',
                'button' => 'Refresh',
            ],

            'table' => [
                'columns' => [
                    'type' => 'Type',
                    'message' => 'Message',
                    'date' => 'Date',
                ],
                'empty' => 'No notifications found.',
                'buttons' => [
                    'mark_as_read' => 'Mark as read',
                    'delete' => 'Delete',
                ],
                'footer' => 'Showing :first to :last of :total notifications'
            ],

            'dialog' => [
                'buttons' => [
                    'close' => 'Close',
                ]
            ]
        ],
    ],
];

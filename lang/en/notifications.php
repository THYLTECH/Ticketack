<?php

return [

    'flash' => [
        'read_success' => 'Notification marked as read.',
        'read_many_success' => 'Notifications marked as read.',
        'delete_success' => 'Notification deleted successfully.',
        'delete_many_success' => 'Notifications deleted successfully.',
    ],
    'ticket_unassigned' => [
        'title' => 'Ticket Unassigned',
        'message' => ':user has unassigned themselves from ticket #:ticket_id (:ticket). The ticket now has no assignees.',
        'action' => 'View Ticket',
        'sms' => ':user unassigned from ticket #:ticket_id. No assignees remaining.',
    ],

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
        'ticket_created' => [
            'message' => 'A new ticket ":title" has been created on :app. View it here: :url',
        ],
        'ticket_updated' => [
            'message' => 'The ticket ":title" has been updated on :app. Check the details here: :url',
        ],
        'ticket_assigned' => [
            'message' => 'You have been assigned to the ticket ":title" on :app. View it here: :url',
        ],
        'ticket_unassigned' => [
            'message' => 'The ticket ":title" has been unassigned by :user on :app. View it here: :url',
        ],
        'ticket_status_changed' => [
            'message' => 'The status of the ticket ":title" has changed to :status on :app. See the update here: :url',
        ],
        'ticket_priority_changed' => [
            'message' => 'The priority of the ticket ":title" has been changed to :priority on :app. View it here: :url',
        ],

        'ticket_entry_created' => [
            'message' => 'A new entry has been added to the ticket ":title" on :app. Check it out here: :url',
        ],
        'ticket_entry_deleted' => [
            'message' => 'An entry has been deleted from the ticket ":title" on :app. View the ticket here: :url',
        ],
        'ticket_comment_created' => [
            'message' => 'A new comment has been added to the ticket ":title" on :app. See it here: :url',
        ],
        'ticket_schedule_created' => [
            'message' => 'A new schedule has been created for the ticket ":title" on :app. View it here: :url',
        ],
        'ticket_schedule_updated' => [
            'message' => 'A schedule has been updated for the ticket ":title" on :app. Check it out here: :url',
        ],
        'ticket_schedule_deleted' => [
            'message' => 'A schedule has been deleted from the ticket ":title" on :app. View the ticket here: :url',
        ],
    ],

    'database' => [
        'registered' => [
            'title' => 'Welcome to :app!',
            'message' => 'Your account has been successfully created on :app. We’re glad to have you on board.',
            'action' => 'Log in to my account',
        ],
        'ticket_created' => [
            'title' => 'New Ticket Created',
            'message' => 'A new ticket ":title" has been created.',
            'action' => 'View Ticket',
        ],
        'ticket_updated' => [
            'title' => 'Ticket Updated',
            'message' => 'The ticket ":title" has been updated.',
            'action' => 'View Ticket',
        ],
        'ticket_assigned' => [
            'title' => 'Ticket Assigned',
            'message' => 'You have been assigned to the ticket ":title".',
            'action' => 'View Ticket',
        ],
        'ticket_unassigned' => [
            'title' => 'Ticket Unassigned',
            'message' => 'The ticket ":title" has been unassigned by :user.',
            'action' => 'View Ticket',
        ],
        'ticket_status_changed' => [
            'title' => 'Ticket Status Changed',
            'message' => 'The status of the ticket ":title" has changed to :status.',
            'action' => 'View Ticket',
        ],
        'ticket_priority_changed' => [
            'title' => 'Ticket Priority Changed',
            'message' => 'The priority of the ticket ":title" has been changed to :priority.',
            'action' => 'View Ticket',
        ],

        'ticket_entry_created' => [
            'title' => 'New Ticket Entry',
            'message' => 'A new entry has been added to the ticket ":title".',
            'action' => 'View Ticket',
        ],
        'ticket_entry_deleted' => [
            'title' => 'Ticket Entry Deleted',
            'message' => 'An entry has been deleted from the ticket ":title".',
            'action' => 'View Ticket',
        ],
        'ticket_comment_created' => [
            'title' => 'Ticket Comment Added',
            'message' => 'A new comment has been added to the ticket ":title".',
            'action' => 'View Ticket',
        ],
        'ticket_schedule_created' => [
            'title' => 'Ticket Schedule Created',
            'message' => 'A new schedule has been created for the ticket ":title".',
            'action' => 'View Ticket',
        ],
        'ticket_schedule_updated' => [
            'title' => 'Ticket Schedule Updated',
            'message' => 'A schedule has been updated for the ticket ":title".',
            'action' => 'View Ticket',
        ],
        'ticket_schedule_deleted' => [
            'title' => 'Ticket Schedule Deleted',
            'message' => 'A schedule has been deleted from the ticket ":title".',
            'action' => 'View Ticket',
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
            'password' => 'Your temporary password is :password. Please change it after your first login.',
        ],

        'verify_email' => [
            'subject' => ':app — Verify your email address',
            'title' => 'Verify your email address',
            'intro' => 'Thanks for signing up on :app. To complete your registration, please verify your email address by clicking the button below.',
            'button' => 'Verify my email address',
            'ignore' => 'If you did not create an account on :app, please ignore this email.',
        ],

        'ticket_created' => [
            'subject' => ':app — New Ticket Created',
            'title' => 'New Ticket Created',
            'intro' => 'A new ticket ":title" has been created.',
            'button' => 'View Ticket',
        ],
        'ticket_updated' => [
            'subject' => ':app — Ticket Updated',
            'title' => 'Ticket Updated',
            'intro' => 'The ticket ":title" has been updated.',
            'button' => 'View Ticket',
        ],
        'ticket_assigned' => [
            'subject' => ':app — Ticket Assigned',
            'title' => 'Ticket Assigned',
            'intro' => 'You have been assigned to the ticket ":title".',
            'button' => 'View Ticket',
        ],
        'ticket_unassigned' => [
            'subject' => ':app — Ticket Unassigned',
            'title' => 'Ticket Unassigned',
            'intro' => 'The ticket ":title" has been unassigned by :user.',
            'button' => 'View Ticket',
        ],
        'ticket_status_changed' => [
            'subject' => ':app — Ticket Status Changed',
            'title' => 'Ticket Status Changed',
            'intro' => 'The status of the ticket ":title" has changed to :status.',
            'button' => 'View Ticket',
        ],
        'ticket_priority_changed' => [
            'subject' => ':app — Ticket Priority Changed',
            'title' => 'Ticket Priority Changed',
            'intro' => 'The priority of the ticket ":title" has been changed to :priority.',
            'button' => 'View Ticket',
        ],
        'ticket_entry_created' => [
            'subject' => ':app — New Ticket Entry',
            'title' => 'New Ticket Entry',
            'intro' => 'A new entry has been added to the ticket ":title".',
            'button' => 'View Ticket',
        ],
        'ticket_entry_deleted' => [
            'subject' => ':app — Ticket Entry Deleted',
            'title' => 'Ticket Entry Deleted',
            'intro' => 'An entry has been deleted from the ticket ":title".',
            'button' => 'View Ticket',
        ],
        'ticket_comment_created' => [
            'subject' => ':app — Ticket Comment Added',
            'title' => 'Ticket Comment Added',
            'intro' => 'A new comment has been added to the ticket ":title".',
            'button' => 'View Ticket',
        ],
        'ticket_schedule_created' => [
            'subject' => ':app — Ticket Schedule Created',
            'title' => 'Ticket Schedule Created',
            'intro' => 'A new schedule has been created for the ticket ":title".',
            'button' => 'View Ticket',
        ],
        'ticket_schedule_updated' => [
            'subject' => ':app — Ticket Schedule Updated',
            'title' => 'Ticket Schedule Updated',
            'intro' => 'A schedule has been updated for the ticket ":title".',
            'button' => 'View Ticket',
        ],
        'ticket_schedule_deleted' => [
            'subject' => ':app — Ticket Schedule Deleted',
            'title' => 'Ticket Schedule Deleted',
            'intro' => 'A schedule has been deleted from the ticket ":title".',
            'button' => 'View Ticket',
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
        'tickets' => [
            'title' => 'Tickets',
            'description' => 'Manage notifications related to ticket activities and updates. If no channels are selected, the notification will by default be sent by email.',
            'items' => [
                'ticket_created' => [
                    'title' => 'Ticket created',
                    'description' => 'Receive a notification when a new ticket is created that you are involved in.',
                ],
                'ticket_updated' => [
                    'title' => 'Ticket updated',
                    'description' => 'Get notified when a ticket you are involved in is updated.',
                ],
                'ticket_status_changed' => [
                    'title' => 'Ticket status changed',
                    'description' => 'Receive a notification when the status of a ticket you are involved in changes.',
                ],
                'ticket_priority_changed' => [
                    'title' => 'Ticket priority changed',
                    'description' => 'Be alerted when the priority of a ticket you are involved in changes.',
                ],
                'ticket_assigned' => [
                    'title' => 'Ticket assigned',
                    'description' => 'Get notified when you are assigned to a ticket.',
                ],
                'ticket_unassigned' => [
                    'title' => 'Ticket unassigned',
                    'description' => 'Get notified when a ticket is unassigned.',
                ],

                'ticket_entry_created' => [
                    'title' => 'New ticket entry',
                    'description' => 'Get notified when a new entry is added to a ticket you are involved in.',
                ],
                'ticket_entry_deleted' => [
                    'title' => 'Ticket entry deleted',
                    'description' => 'Be alerted when a ticket entry you are involved in is deleted.',
                ],
                'ticket_comment_created' => [
                    'title' => 'Ticket commented',
                    'description' => 'Be alerted when someone comments on a ticket you are involved in.',
                ],
                'ticket_schedule_created' => [
                    'title' => 'Schedule created',
                    'description' => 'Receive a notification when a schedule is created for a ticket you are involved in.',
                ],
                'ticket_schedule_updated' => [
                    'title' => 'Schedule updated',
                    'description' => 'Receive a notification when a schedule is updated for a ticket you are involved in.',
                ],
                'ticket_schedule_deleted' => [
                    'title' => 'Schedule deleted',
                    'description' => 'Receive a notification when a schedule is deleted for a ticket you are involved in.',
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

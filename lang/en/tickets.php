<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Flash
    |--------------------------------------------------------------------------
    */
    'flash' => [
        'created' => 'Ticket created successfully.',
        'updated' => 'Ticket updated successfully.',
        'deleted' => 'Ticket deleted successfully.',
    ],

    /*
    |--------------------------------------------------------------------------
    | Global Actions & Labels
    |--------------------------------------------------------------------------
    */
    'search' => [
        'placeholder' => 'Search tickets...',
    ],
    'filters' => [
        'status' => 'Status',
        'priority' => 'Priority',
        'assignee' => 'Assignee',
        'equipment' => 'Equipment',
        'category' => 'Category',
        'clear' => 'Clear filters',
    ],
    'archive' => [
        'message' => 'This ticket will be archived you can restore it at any time.',
        'confirm' => 'Are you sure you want to archive this ticket ?',
    ],
    'column' => [
        'title' => 'Title',
        'status' => 'Status',
        'priority' => 'Priority',
        'category' => 'Category',
        'assignee' => 'Assignee',
        'author' => 'Author',
        'visibility' => 'Visibility',
        'updated_at' => 'Updated',
        'created_at' => 'Created',
    ],

    /*
    |--------------------------------------------------------------------------
    | Pages
    |--------------------------------------------------------------------------
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
            'title' => 'Tickets Management',
            'description' => 'View, filter and manage all support tickets.',
            'toolbar' => [
                'search' => 'Search tickets...',
                'clear' => 'Clear filters',
                'filters' => [
                    'title' => 'Filters',
                    'status' => 'Status',
                    'priority' => 'Priority',
                    'category' => 'Category',
                    'asset' => 'Equipment',
                    'solver' => 'Assigned to',
                ],
                'selection' => [
                    'selected' => 'selected',
                    'no_results' => 'No results found.',
                ],
            ],
            'buttons' => [
                'create' => 'Create Ticket',
                'manage' => 'Manage Tickets',
            ],

            'empty' => [
                'title' => 'No tickets found',
                'description' => 'No tickets found matching your current filters or search criteria.',
                'button' => 'Clear Filters',
            ],
        ],
        'create' => [
            'head_title' => 'Create Ticket',
            'title' => 'Create a New Ticket',
            'description' => 'Fill out the form below to create a new ticket.',
            'validation_error' => [
                'title' => 'Validation Error',
                'description' => 'Please correct the errors listed below before saving.'
            ],
            'assign' => [
                'title' => 'Assign Ticket',
                'description' => 'Select users to assign to this ticket.',
            ],
        ],
        'form' => [
            'buttons' => [
                'back' => 'Go back to tickets',
                'store' => 'Store Ticket',
                'update' => 'Update Ticket',
                'delete' => 'Archive Ticket',
                'edit' => 'Edit Ticket',
                'back_to_ticket' => 'Back to Ticket',
                'add' => 'Add Assignee'
            ],
            'tabs' => [
                'informations' => 'Informations',
                'assignees' => 'Assignees',
            ],
            'fields' => [
                'public_label' => 'Public Ticket (Visible to everyone)',
                'private_label' => 'Private Ticket (Restricted access)',
            ],
            'placeholders' => [
                'title' => 'eg. Server not responding',
                'description' => 'Describe the issue...',
                'select_priority' => 'Select Priority',
                'select_status' => 'Select Status',
                'select_category' => 'Select Category',
                'select_asset' => 'Select Asset',
            ],
        ],
        'edit' => [
            'title' => 'Edit Ticket',
            'description' => 'Update ticket details and assignments.',
        ],
        'delete' => [
            'title' => 'Are you sure you want to archive this ticket?',
            'description' => 'This will permanently archive the ticket titled \':title\'.',
            'buttons' => [
                'cancel' => 'Cancel',
                'confirm' => 'Yes, archive ticket',
            ],
        ],
        'show' => [
            'head_title' => 'Ticket',
            'description' => 'View ticket details, history, schedule and logs.',
            'actions' => [
                'pdf' => 'Export PDF',
            ],
            'tabs' => [
                'info' => 'Info',
                'comments' => 'Communication History',
                'calendar' => 'Calendar',
                'logs' => 'Logs',
                'info_content' => [
                    'description' => 'Description',
                    'assignees' => 'Assignees',
                    'no_assignees' => 'No assignees.',
                    'details' => 'Details',
                    'users' => 'Users',
                ],
                'logs_content' => [
                    'empty' => 'No history available.',
                    'search_placeholder' => 'Search in history...',
                    'no_results' => 'No results found for your search.',
                    'old_value' => 'Old value',
                    'new_value' => 'New value',
                    'empty_value' => 'empty',
                    'pagination_info' => 'Page :current of :total (:count logs)',
                    'actions' => [
                        'created' => 'created the ticket',
                        'updated' => 'modified',
                        'commented' => 'added a comment',
                        'comment_deleted' => 'deleted a comment',
                        'time_logged' => 'logged time',
                        'scheduled' => 'scheduled an intervention',
                        'priority_changed' => 'changed the priority',
                        'schedule_updated' => 'modified the schedule',
                        'assigned' => 'assigned the ticket',
                        'unassigned' => 'removed an assignee',
                    ],
                ],
            ],
            'comments' => [
                'image_modal' => [
                    'title' => 'Image Preview',
                    'alt' => 'Full image preview',
                ],
                'editor' => [
                    'drop_files' => 'Drop your files here',
                    'placeholder' => 'Write a comment... (Markdown supported)',
                    'placeholder_edit' => 'Edit your comment...',
                    'attach_files' => 'Attach files',
                    'esc_to_cancel' => 'Esc to cancel',
                    'save' => 'Save',
                    'submit' => 'Comment',
                    'edit_mode' => 'Edit mode',
                    'cancel_edit' => 'Cancel edit',
                    'formatting' => [
                        'bold' => 'Bold',
                        'italic' => 'Italic',
                        'code' => 'Code',
                        'quote' => 'Quote',
                        'link' => 'Link',
                        'list' => 'List',
                        'ordered_list' => 'Ordered List',
                    ],
                ],
                'empty_title' => 'No comments',
                'empty_description' => 'Start the discussion here.',
                'new_messages' => 'New messages',
                'actions' => [
                    'edit' => 'Edit',
                    'delete' => 'Delete',
                    'cancel' => 'Cancel',
                ],
                'delete_modal' => [
                    'title' => 'Delete comment?',
                    'description' => 'Are you sure you want to delete this comment? This action cannot be undone.',
                    'cancel' => 'No',
                    'confirm' => 'Yes, delete',
                ],
                'notifications' => [
                    'deleted' => 'Comment deleted',
                    'attachment_deleted' => 'File deleted',
                    'sent' => 'Comment sent successfully',
                    'updated' => 'Comment updated successfully',
                    'error' => 'An error occurred',
                ],
            ],
            'calendar' => [
                'edit_mode' => 'Planning mode',
                'views' => [
                    'day' => 'Day',
                    'week' => 'Week',
                    'month' => 'Month',
                ],
                'notifications' => [
                    'scheduled' => 'Successfully scheduled',
                    'moved' => 'Successfully moved',
                    'updated' => 'Event updated',
                    'deleted' => 'Removed from schedule',
                ],
            ],
        ],
    ],
    'generated_by' => 'Generated by',
    'on' => 'on',
    'document_footer' => 'Document generated by Ticketack.',
    'pagination' => [
        'showing' => 'Showing',
        'of' => 'of',
        'results' => 'results',
        'to' => 'to'
    ]
];

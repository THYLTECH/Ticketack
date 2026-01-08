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
        'restored' => 'Ticket restored successfully.',
        'force_deleted' => 'Ticket permanently deleted successfully.',

        'categories_success' => 'Ticket categories saved successfully.',
        'categories_error' => 'Some categories cannot be deleted because they are attached to existing tickets: :categories',

        'priorities_success' => 'Ticket priorities saved successfully.',
        'priorities_error' => 'Some priorities cannot be deleted because they are attached to existing tickets: :priorities',
        'priorities_locked_error' => 'Some priorities cannot be deleted because they are locked: :priorities',

        'statuses_success' => 'Ticket statuses saved successfully.',
        'statuses_error' => 'Some statuses cannot be deleted because they are attached to existing tickets: :statuses',
        'statuses_locked_error' => 'Some statuses cannot be deleted because they are locked: :statuses',
        'statuses_default_error' => 'There must be exactly one default status.',
        'statuses_closed_error' => 'There must be exactly one closed status.',
    ],

    /*
    |--------------------------------------------------------------------------
    | Global Actions & Labels
    |--------------------------------------------------------------------------
    */
    'search' => [
        'placeholder' => 'Search tickets...',
    ],
    'controller' => [
        'attachments_limit' => 'You cannot have more than 10 attachments per ticket.',
    ],
    'filters' => [
        'status' => 'Status',
        'priority' => 'Priority',
        'assignee' => 'Assignee',
        'equipment' => 'Asset',
        'category' => 'Category',
        'clear' => 'Clear filters',
    ],
    'fields'=> [
        'id'         => 'ID',
        'title'      => 'Title',
        'status'     => 'Status',
        'priority'   => 'Priority',
        'author'     => 'Author',
        'updated_at' => 'Updated At',
    ],
    'status' => [
        'open'   => 'Open',
        'closed' => 'Closed',
    ],
    'priority' => [
        'low'    => 'Low',
        'medium' => 'Medium',
        'high'   => 'High',
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
                    'asset' => 'Asset',
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
                'cancel' => 'Cancel',
                'assign_to_me' => 'Assign to me',
            ],
        ],
        'form' => [
            'knowledge_base' => [
                'title' => 'Knowledge Base (AI)',
                'description' => 'Mark as a reference to improve automated suggestions.',
                'status_on' => 'Referenced',
                'status_off' => 'Not referenced',
            ],
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
            'users_tab' => [
                'description' => 'Manage assignees for this ticket.',
                'add_button' => 'Add',
                'me_badge' => 'Me',
                'notifications' => [
                    'added' => 'Assignee added successfully.',
                    'removed' => 'Assignee removed successfully.',
                    'assigned_to_self' => 'Ticket assigned to yourself.',
                ],
                'table' => [
                    'assignee' => 'Assignee',
                    'role' => 'Role',
                ],
            ],
            'editor' => [
                'label' => 'Markdown Editor',
                'placeholder' => "# Technical Solution...\n\nDescribe the resolution steps.",
                'markdown_active' => 'Markdown supported',
                'mode_zen' => 'Zen Mode',
                'preview' => 'Preview',
                'empty_preview' => 'Preview will appear here...',
                'actions' => [
                    'fullscreen' => 'Fullscreen',
                    'exit' => 'Exit',
                ],
                'formatting' => [
                    'bold' => 'Bold',
                    'italic' => 'Italic',
                    'strike' => 'Strikethrough',
                    'h1' => 'Heading 1',
                    'h2' => 'Heading 2',
                    'list' => 'Bulleted List',
                    'ordered_list' => 'Ordered List',
                    'link' => 'Link',
                    'image' => 'Image',
                    'table' => 'Table',
                    'code' => 'Code Block',
                    'quote' => 'Quote',
                    'separator' => 'Separator',
                ],
            ],
        ],
        'edit' => [
            'title' => 'Edit Ticket',
            'description' => 'Update ticket details and assignments.',
            'attachments' => [
                'title' => 'Attachments',
                'existing_attachments' => 'Existing Attachments',
                'dialog' => [
                    'title' => 'Delete Attachment?',
                    'description' => 'Are you sure you want to delete this attachment? This action cannot be undone.',
                    'cancel' => 'No',
                    'confirm' => 'Yes, delete',
                ],
                'delete_button' => 'Delete',
                'view_or_download' => 'View or download'
            ],
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
                    'attachments' => 'Attachments',
                    'no_attachments' => 'No attachments available.',
                    'no_desc' => 'No description available.',
                    'properties' => 'Properties',
                    'history' => 'History',
                    'created' => 'Created',
                    'updated' => 'Updated',
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
            'knowledge_base' => [
                'title' => 'Reference Solution',
                'badge' => 'Knowledge Base',
                'footer' => 'Validated by the technical team',
                'verified' => 'Verified',
                'collapse' => 'Show less',
                'expand' => 'Show more',
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
                'edit_mode' => 'Edit',
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
        'relations' => [
            'categories' => [
                'validation' => [
                    'title_required' => 'Title is required.',
                    'color_required' => 'Color is required.',
                ],
                'dialog' => [
                    'create_title' => 'Create Category',
                    'edit_title' => 'Edit Category',
                    'delete_title' => 'Delete Category',

                    'create_description' => 'Fill out the form below to create a new category.',
                    'edit_description' => 'Update the details of the category below.',
                    'delete_description' => 'Are you sure you want to delete this category? This action cannot be undone.',

                    'form' => [
                        'title_label' => 'Title',
                        'title_placeholder' => 'eg. Network Issue',
                        'description_label' => 'Description',
                        'description_placeholder' => 'A brief description of the category.',
                        'icon_label' => 'Icon',
                        'color_label' => 'Color',
                        'buttons' => [
                            'close' => 'Close',
                            'cancel' => 'Cancel',
                            'update' => 'Update Category',
                            'store' => 'Store Category',
                            'delete' => 'Yes, delete category',
                        ],
                    ],
                ], 
                'sheet' => [
                    'title' => 'Manage categories',
                    'description' => 'Create, edit, and delete ticket categories to organize your support tickets effectively.',

                    'table' => [
                        'column' => 'Category',
                        'empty' => 'No categories found.',
                    ],

                    'buttons' => [
                        'create' => 'Create Category',
                        'close' => 'Close',
                        'save' => 'Save Changes',
                    ]
                ],
            ],
            'priorities' => [
                'validation' => [
                    'title_required' => 'Title is required.',
                    'color_required' => 'Color is required.',
                ],
                'dialog' => [
                    'create_title' => 'Create Priority',
                    'edit_title' => 'Edit Priority',
                    'delete_title' => 'Delete Priority',

                    'create_description' => 'Fill out the form below to create a new priority.',
                    'edit_description' => 'Update the details of the priority below.',
                    'delete_description' => 'Are you sure you want to delete this priority? This action cannot be undone.',

                    'form' => [
                        'title_label' => 'Title',
                        'title_placeholder' => 'eg: High, Medium, Low',
                        'description_label' => 'Description',
                        'description_placeholder' => 'A brief description of the priority.',
                        'color_label' => 'Color',
                        'buttons' => [
                            'close' => 'Close',
                            'cancel' => 'Cancel',
                            'update' => 'Update Priority',
                            'store' => 'Store Priority',
                            'delete' => 'Yes, delete priority',
                        ],
                    ],
                ], 
                'sheet' => [
                    'title' => 'Manage priorities',
                    'description' => 'Create, edit, and delete ticket priorities to organize your support tickets effectively.',

                    'table' => [
                        'column' => 'Priority',
                        'empty' => 'No priorities found.',
                    ],

                    'buttons' => [
                        'create' => 'Create Priority',
                        'close' => 'Close',
                        'save' => 'Save Changes',
                    ]
                ],
            ],
            'statuses' => [
                'validation' => [
                    'title_required' => 'Title is required.',
                    'color_required' => 'Color is required.',
                ],
                'dialog' => [
                    'create_title' => 'Create Status',
                    'edit_title' => 'Edit Status',
                    'delete_title' => 'Delete Status',

                    'create_description' => 'Fill out the form below to create a new status.',
                    'edit_description' => 'Update the details of the status below.',
                    'delete_description' => 'Are you sure you want to delete this status? This action cannot be undone.',

                    'form' => [
                        'title_label' => 'Title',
                        'title_placeholder' => 'eg: To Do, In Progress, Done',
                        'description_label' => 'Description',
                        'description_placeholder' => 'A brief description of the status.',

                        'default_label' => 'Is Default',
                        'default_placeholder' => 'Set as default status for new tickets',
                        'default_yes' => 'Yes',
                        'default_no' => 'No',

                        'closed_label' => 'Is Closed',
                        'closed_placeholder' => 'Mark tickets with this status as closed',
                        'closed_yes' => 'Yes',
                        'closed_no' => 'No',

                        'color_label' => 'Color',
                        'buttons' => [
                            'close' => 'Close',
                            'cancel' => 'Cancel',
                            'update' => 'Update Status',
                            'store' => 'Store Status',
                            'delete' => 'Yes, delete status',
                        ],
                    ],
                ], 
                'sheet' => [
                    'title' => 'Manage statuses',
                    'description' => 'Create, edit, and delete ticket statuses to organize your support tickets effectively.',

                    'table' => [
                        'column' => 'Status',
                        'default' => 'Default',
                        'closed' => 'Closed',
                        'empty' => 'No statuses found.',
                    ],

                    'buttons' => [
                        'create' => 'Create Status',
                        'close' => 'Close',
                        'save' => 'Save Changes',
                    ]
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

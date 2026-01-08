<?php

return [
    'entries' => 'Entries',
    'entry' => 'Entry',
    'flash' => [
        'created' => 'Time entry created successfully.',
        'overlap_error' => 'This entry overlaps with another one.',
        'overlap_details' => 'Overlap with ticket #:id: :title (:start - :end)',
    ],
    'header' => [
        'title' => 'Time Tracking',
        'description' => 'Analyze your performance and export your data.',
        'actions' => [
            'report' => 'Report',
            'log_time' => 'Log time',
        ],
    ],
    'pdf' => [
        'title' => 'Time Tracking Report',
        'company_name' => 'Activity Report',
        'document_title' => 'Detailed Time Entries',
        'generated_on' => 'Generated on',
        'date_range' => 'Date Range',
        'total_hours' => 'Total Hours',
        'ticket_deleted' => 'Ticket #:id (Deleted)',
        'yes' => 'YES',
        'no' => 'NO',
        'no_entries' => 'No entries found for this period.',
        'grand_total' => 'GRAND TOTAL',
        'table' => [
            'date' => 'Date',
            'description' => 'Ticket & Description',
            'billable' => 'Billable',
            'duration' => 'Duration',
        ],
        'daily_summary' => 'Daily Hours Distribution',
        'weekly_details' => 'Weekly Detailed Entries',
        'week' => 'Week',
        'date' => 'Date',
        'hours' => 'Hours',
        'total' => 'Total',
    ],
    'controller' => [
        'store' => [
            'duration_error' => 'Duration must be greater than 0.',
            'success' => 'Time entry saved successfully.',
        ],
        'destroy' => [
            'success' => 'Time entry deleted.',
        ],
    ],
    'report' => [
        'title' => 'Export Report',
        'description' => 'Generate a file containing all entries currently visible in your list.',
        'format' => 'File Format',
        'formats' => [
            'csv' => 'Excel (.csv)',
            'pdf' => 'PDF Document',
        ],
        'actions' => [
            'cancel' => 'Cancel',
            'download' => 'Download',
        ],
        // NOUVEAU POUR LE BACKEND
        'period_all' => 'All history',
        'csv' => [
            'headers' => [
                'date' => 'Date',
                'time' => 'Time',
                'ticket_id' => 'Ticket ID',
                'ticket_title' => 'Ticket Title',
                'category' => 'Category',
                'duration' => 'Duration (h)',
                'description' => 'Description',
                'billable' => 'Billable',
            ],
            'yes' => 'Yes',
            'no' => 'No',
            'total_hours' => 'TOTAL HOURS',
            'deleted_ticket' => 'Deleted Ticket',
        ],
    ],
    'stats' => [
        'unit' => 'h',
        'total_hours' => [
            'title' => 'Total Hours',
            'description' => 'Accumulated time',
        ],
        'count' => [
            'title' => 'Interventions',
            'description' => 'Number of sessions',
        ],
        'period' => [
            'title' => 'Active Period',
            'description' => 'Active date range',
        ],
    ],
    'table' => [
        'empty' => [
            'title' => 'No time entries',
            'description' => 'Change your filters or add a new entry.',
        ],
        'headers' => [
            'date' => 'Date',
            'ticket_context' => 'Ticket & Context',
            'duration' => 'Duration',
            'description' => 'Description',
            'billable' => 'Bill.',
        ],
        'badges' => [
            'yes' => 'Yes',
            'no' => 'No',
        ],
        'actions' => [
            'delete' => 'Delete',
        ],
        'toast' => [
            'deleted' => 'Time entry deleted',
            'delete_error' => 'Error while deleting',
        ],
        'dialog' => [
            'delete' => [
                'title' => 'Delete Time Entry',
                'description' => 'This action is irreversible. The recorded time will be removed from the ticket and global statistics.',
                'cancel' => 'Cancel',
                'confirm' => 'Confirm',
            ],
            'preview' => [
                'work_description' => 'Work Description',
                'no_note' => 'No note provided for this entry.',
                'technician' => 'Technician',
                'unknown' => 'Unknown',
                'duration_billing' => 'Duration & Billing',
                'billable' => 'Billable',
                'not_billable' => 'Non-billable',
                'category' => 'Category',
                'uncategorized' => 'Uncategorized',
                'status_priority' => 'Status & Priority',
                'close' => 'Close',
                'go_to_ticket' => 'Go to ticket',
            ],
        ],
    ],
    'toolbar' => [
        'title' => 'Filters',
        'category' => [
            'label' => 'Category',
            'all' => 'All',
        ],
        'status' => [
            'label' => 'Status',
            'all' => 'All',
        ],
        'priority' => [
            'label' => 'Priority',
            'all' => 'All',
        ],
        'billable' => [
            'label' => 'Billable',
            'all' => 'All',
            'yes' => 'Yes',
            'no' => 'No',
        ],
        'date_range' => 'Period',
        'reset' => 'Reset',
    ],
    'index' => [
        'title' => 'Time Tracking',
        'breadcrumbs' => [
            'dashboard' => 'Dashboard',
            'current' => 'Entries',
        ],
        'timezone' => 'Timezone',
    ],
    'pagination' => [
        'showing' => 'Showing',
        'of' => 'of',
        'results' => 'results',
        'show' => 'Show'
    ],
    'dialog' => [
        'title' => 'Log time',
        'description_indication' => 'Fill out the form below to record your intervention.',
        'ticket' => [
            'label' => 'Ticket',
            'selected' => 'Ticket selected',
            'placeholder' => 'Select a ticket...',
            'search' => 'Search for a ticket...',
            'empty' => 'No ticket found.',
        ],
        'date' => [
            'label' => 'Date',
            'placeholder' => 'Pick a date',
        ],
        'duration' => [
            'hours' => 'Hours',
            'minutes' => 'Minutes',
            'h' => 'h',
            'min' => 'min',
            'error' => 'Invalid duration.',
        ],
        'description' => [
            'label' => 'Description',
            'placeholder' => 'Intervention details...',
        ],
        'billable' => [
            'label' => 'Billing Type',
            'standard' => 'Standard',
            'not_billable' => 'Non-billable',
            'billable' => 'Billable',
            'to_bill' => 'Charge to client',
        ],
        'actions' => [
            'cancel' => 'Cancel',
            'save' => 'Save',
        ],
        'toast' => [
            'date_required' => 'Please select a date.',
            'success' => 'Time entry added successfully',
            'error' => 'Please check the form fields.',
        ],
    ],
];

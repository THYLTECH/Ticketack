<?php

return [
    'buttons' => [
        'search' => 'Search',
        'view_source' => 'View source ticket',
        'view_details' => 'View details',
        'loading' => 'Wait...',
        'load_more' => 'Load more',
    ],
    'filters' => [
        'label' => 'Filters',
        'date' => 'Date Range',
        'author' => 'Author / Solver',
        'category' => 'Category',
        'asset' => 'Equipment',
        'type' => 'File Type',
        'clear' => 'Clear filters',
        'empty' => 'No results found.',
        'selected' => 'selected',
        'types' => [
            'all' => 'All types',
            'image' => 'Images',
            'pdf' => 'PDFs',
            'ticket' => 'Tickets'
        ],
    ],
    'pages' => [
        'search' => [
            'title' => 'Knowledge Explorer',
            'hero_title' => 'Smart Knowledge Base',
            'badge' => 'Find answers to your questions in minutes.',
            'hero_description' => 'Semantically search through ticket history, detailed solutions, and attachments.',
            'placeholder' => 'Describe the issue (eg. SMTP outlook error port 587)...',
            'service_unavailable' => 'Search service is temporarily unavailable',
            'service_unavailable_title' => 'Search Service Unavailable',
            'service_unavailable_description' => 'The vector search service is currently offline. This feature requires the ETL service to be running. Please contact your system administrator.',
            'error' => 'An error occurred while searching',
        ],
    ],
    'results' => [
        'count' => ':count results found',
        'found' => 'results found',
        'by' => 'By',
        'best_match' => 'Best match',
        'solution_available' => 'Referenced solution available',
        'relevance' => 'Relevance',
        'empty_title' => 'No results found.',
        'empty_description' => 'No results found matching your current filters or search criteria.',
    ],
    'similar' => [
        'title' => 'Similar Tickets (AI Suggestions)',
        'match' => 'Relevance',
        'view' => 'View ticket',
    ],
];

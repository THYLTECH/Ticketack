<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Flash messages
    |--------------------------------------------------------------------------
    |
    */

    /*
    |--------------------------------------------------------------------------
    | Pages content
    |--------------------------------------------------------------------------
    |
    */

    'pages' => [
        'title' => 'Landing page',

        'buttons' => [
            'dashboard' => 'Dashboard',
            'home'=> 'Home',
            'login' => 'Log in',
            'register' => 'Register',
            'company' => 'See more',
        ],
        'title' => 'Welcome to Ticketack',
        'description' => '',
        'breakout'=> [
            'companyTitle' =>'Imagined by ID Ingenierie',
            'companyDescription' =>'Specialist in customized software development and web and mobile technologies.',
            'teamTitle' => 'Developed by Thyltech',
            'teamDescription' =>'Team of french student from Centrale Lille IG2I.'
        ],
        'achievementsTitle' => "Ticketack's Features",
        'achievementsDescription' => 'Ticketack allow you to centralize and simplify the tracking of all your technical issues. This tool reduces difficult tracking, loss of information and lack of visibility caused by problem reports via emails.',
        'achievements' => [
            '1' => [
                'label' => 'Ticket Management',
                'value' => 'Create tickets to report bugs, request enhancements, obtain support, or plan maintenance.',
            ],
            '2' => [
                'label' => 'Resolution Tracking',
                'value' => 'Plan and track the time spent on resolving tickets.',
            ],
            '3' => [
                'label' => 'Asset Management',
                'value' => 'List and manage your assets with a hierarchical view',
            ],
            '4' => [
                'label' => 'Intervention Planning',
                'value' => 'Solvers can view and plan interventions for ticket resolution',
            ],
        ],

    ],

];
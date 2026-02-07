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

    'layout' => [
        'sidebar' => [
            'menugroups' => [
                'platform' => [
                    'title' => 'Plateforme',
                    'items' => [
                        'home'      => 'Accueil',
                        'dashboard' => 'Tableau de bord',
                        'tickets'   => 'Tickets',
                        'assignment' => 'Affectation',
                        'assets'    => 'Assets',
                        'roles'     => 'Rôles',
                        'users'     => 'Utilisateurs',
                        'planning' => 'Planning',
                        'trash'     => 'Corbeille',
                        'entries'    => 'Pointage',
                    ],
                ],
                'footer' => [
                    'title' => '',
                    'items' => [
                        'repository' => 'Dépôt Github',
                        'documentation' => 'Documentation',
                    ],
                ],
            ],
            'usermenu' => [
                'items' => [
                    'notifications' => 'Notifications',
                    'settings' => 'Paramètres',
                    'logout' => 'Se déconnecter',
                ],
            ],
            'actions' => [
                'create_ticket' => 'Créer un ticket',
            ],
        ],
    ],

];

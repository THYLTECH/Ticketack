<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Messages Flash
    |--------------------------------------------------------------------------
    |
    */

    /*
    |--------------------------------------------------------------------------
    | Contenu des pages
    |--------------------------------------------------------------------------
    |
    */

    'pages' => [
        'breadcrumbs' => [
            'dashboard' => 'Tableau de bord',
        ],
        'description' => 'Aperçu des statistiques du système',
        'title' => 'Tableau de bord',
        'tabs' => [
            'global_statistics' => 'Statistiques globales',
            'ticket_statistics' => 'Statistiques des tickets',
            'user_statistics' => 'Statistiques utilisateurs',
            'asset_statistics' => 'Statistiques des assets',
        ],
        'stats' => [
            'global_statistics' => [
                'total_assets' => 'Nombre d\'assets',
                'total_users' => 'Nombre d\'utilisateurs',
                'avg_resolution_time' => 'Temps moyen de résolution',
                'unassigned_tickets' => 'Nombre de tickets non assignés',
                'activity_title' => 'Activité des tickets',
            ],
            'ticket_statistics' => [
                'total_tickets' => 'Total des tickets',
                'by_status' => 'Tickets par statut',
                'by_priority' => 'Tickets par priorité',
                'by_category' => 'Tickets par catégorie',
                'indicator'=>
                [
                    'status' => 'Statut',
                    'priority' => 'Priorité',
                    'category' => 'Catégorie',
                ]
            ],
            'user_statistics' => [
                'assigned_tickets' => 'Utilisateurs ayant assigné le plus de tickets',
                'created_tickets' => 'Utilisateurs ayant créé le plus de tickets',
                'resolved_tickets' => 'Utilisateurs ayant résolu le plus de tickets',
                'time_to_resolve' => 'Utilisateurs passant le plus de temps sur les tickets',
            ],
            'asset_statistics' => [
                'description' => 'Assets les plus utilisées dans les tickets',
                'by_attribute' => 'Attributs les plus utilisés dans les assets',
            ],
            'no_data' => 'Aucune donnée disponible',
        ],
        'filters' => [
            'period' => 'Période',
            'label'=> [
                'filter' => 'Filtres du graphique',
                'limit' => 'Nombre d\'éléments',
            ]
        ]

    ],

];
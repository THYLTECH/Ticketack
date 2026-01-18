<?php

return [
    'pages' => [
        'breadcrumbs' => [
            'index' => 'Corbeille',
        ],
        'index' => [
            'head_title' => 'Corbeille',
            'title' => 'Corbeille',
            'description' => 'Visualisez et gérez les éléments qui ont été supprimés.',
            'search_placeholder' => 'Rechercher des éléments supprimés...',
            'warning_permanent' => 'Attention : La suppression d\'un élément depuis cette page est définitive et irréversible.',
            'empty' => [
                'title' => 'Cette section est vide',
                'search_title' => 'Aucun résultat trouvé',
                'description' => 'Aucun élément de type {type} dans la corbeille.',
                'search_description' => 'Aucun élément ne correspond à votre recherche "{term}".',
                'clear_filters' => 'Effacer les filtres',
            ],
            'table' => [
                'headers' => [
                    'name' => 'Nom / Identification',
                    'deleted_at' => 'Supprimé le',
                    'actions' => 'Actions',
                    'roles' => 'Rôles',
                    'users' => 'Utilisateurs',
                    'tickets' => 'Tickets',
                    'permissions' => 'Permissions',
                ],
                'cells' => [
                    'created_tickets' => 'tickets créés',
                    'linked_tickets' => 'tickets liés',
                ]
            ],
            'buttons' => [
                'restore' => 'Restaurer',
                'force_delete' => 'Supprimer définitivement',
                'force_delete_short' => 'Supprimer',
                'clear_search' => 'Effacer la recherche',
            ],
            'toolbar' => [
                'title' => 'Supprimer/Restaurer',
                'search' => 'Rechercher des éléments supprimés...',
                'type' => 'Type',
                'retention' => 'Suppression définitive après :',
                'auto_delete_after' => 'jours',
            ]
        ],
    ],
    'tabs' => [
        'tickets' => 'Tickets',
        'users' => 'Utilisateurs',
        'assets' => 'Assets',
        'roles' => 'Rôles',
    ],
    'toolbar' => [
        'retention' => 'Rétention',
        'auto_delete_after' => 'Supprimer auto. les éléments datant de plus de',
    ],
    'table' => [
        'badges' => [
            'linked_tickets' => 'Tickets liés',
            'created_tickets' => 'tickets',
        ]
    ],
    'retention' => [
        'critical' => ':days jours - Critique',
        'warning' => ':days jours - Attention',
        'remaining' => ':days jours restants',
    ],
    'common' => [
        'item_unnamed' => 'Élément',
        'unknown' => 'Inconnu',
        'selected' => 'sélectionné(s)',
        'all_items' => 'tous les éléments',
        'items' => 'éléments',
    ],
    'modals' => [
        'delete' => [
            'title' => 'Suppression définitive',
            'description_prefix' => 'Vous êtes sur le point de supprimer définitivement',
            'bulk_description_prefix' => 'Vous êtes sur le point de supprimer définitivement',
            'description_suffix' => 'Cette action est irréversible et ne peut pas être annulée.',
            'warning' => 'Cette action est irréversible et les données seront perdues à jamais.',
            'buttons' => [
                'cancel' => 'Annuler',
                'confirm' => 'Confirmer',
                'deleting' => 'Suppression...',
            ],
        ],
        'empty' => [
            'title' => 'Vider la corbeille',
            'description' => 'Êtes-vous sûr de vouloir supprimer définitivement tous les éléments de cette section ?',
        ],
        'retention' => [
            'title' => 'Définir la période de rétention',
            'description' => 'Définissez le délai de conservation des éléments dans cette section.',
            'days' => 'jours',
            'cancel' => 'Annuler',
            'buttons' => [
                'confirm' => 'Confirmer',
                'cancel' => 'Annuler',
            ]
        ]
    ],
    'buttons' => [
        'restore_selected' => 'Restaurer la sélection',
        'delete_selected' => 'Supprimer définitivement',
        'empty_trash' => 'Vider la corbeille',
    ],
    'console' => [
        'pruning' => 'Nettoyage de la corbeille :type - Suppression des éléments supprimés avant le :date (rétention : :days jours)',
        'summary' => 'Nettoyage de la corbeille terminé. Total d\'éléments supprimés définitivement : :count.',
    ],
    'notifications' => [
        'restored_title' => 'Restauré',
        'restored_description' => 'L\'élément a été restauré avec succès.',
        'bulk_restored_title' => 'Éléments restaurés',
        'bulk_restored_description' => '{count} éléments ont été restaurés avec succès.',
        'deleted_title' => 'Supprimé',
        'deleted_description' => 'Le(s) élément(s) ont été supprimé(s) définitivement.',
        'restored' => '{1} :count élément a été restauré.|[2,*] :count éléments ont été restaurés.',
        'deleted' => '{1} :count élément a été supprimé définitivement.|[2,*] :count éléments ont été supprimés définitivement.',
        'emptied' => 'La corbeille :type a été vidée.',
    ],
];
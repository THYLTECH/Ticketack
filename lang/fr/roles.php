<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Flash
    |--------------------------------------------------------------------------
    |
    */
    'flash' => [
        'created' => 'Rôle créé avec succès.',
        'updated' => 'Rôle mis à jour avec succès.',
        'delete_error' => 'Impossible de supprimer un rôle assigné à des utilisateurs.',
        'deleted' => 'Rôle supprimé avec succès.',
        'delete_locked' => 'Ce rôle est verrouillé et ne peut pas être supprimé.',
    ],

    /*
    |--------------------------------------------------------------------------
    | Pages
    |--------------------------------------------------------------------------
    |
    */

    'pages' => [
        'breadcrumbs' => [
            'index' => 'Rôles',
            'create' => 'Créer un rôle',
            'show' => 'Voir le rôle',
            'edit' => 'Modifier le rôle',
        ],
        'index' => [
            'head_title' => 'Rôles',
            'title' => 'Rôles',
            'description' => 'Gérez et visualisez tous vos rôles au même endroit.',
            'search_placeholder' => 'Rechercher un rôle...',
            'empty_search' => 'Aucun rôle ne correspond à votre recherche.',

            'buttons' => [
                'create' => 'Créer un rôle',
            ],

            'empty' => [
                'title' => 'Aucun rôle trouvé',
                'description' => 'Commencez par créer votre premier rôle.',
                'button' => 'Actualiser',
            ],

            'table' => [
                'columns' => [
                    'name' => 'Nom',
                    'users' => 'Nb d\'utilisateurs',
                    'permissions' => 'Nb de permissions',
                    'updated_at' => 'Dernière mise à jour',
                    'created_at' => 'Créé le',
                ],
                'badges' => [
                    'system' => 'Système',
                ],
                'actions' => [
                    'label' => 'Actions',
                    'view' => 'Voir',
                    'edit' => 'Modifier',
                    'delete' => 'Supprimer',
                    'clone' => 'Dupliquer',
                ],
            ],
        ],
        'create' => [
            'head_title' => 'Créer un rôle',

            'title' => 'Créer un rôle',
            'description' => 'Remplissez le formulaire ci-dessous pour créer un nouveau rôle.',
        ],
        'edit' => [
            'head_title' => 'Modifier le rôle :title',

            'title' => 'Modifier le rôle :title',
            'description' => 'Modifiez les détails du rôle ci-dessous.',
        ],
        'show' => [
            'head_title' => 'Voir le rôle :title',

            'title' => 'Voir le rôle :title',
            'description' => 'Consultez les détails de ce rôle.',
        ],
        'form' => [
            'buttons' => [
                'back' => 'Retour aux rôles',
                'store' => 'Enregistrer le rôle',
                'update' => 'Mettre à jour le rôle',
                'delete' => 'Supprimer le rôle',
                'edit' => 'Modifier le rôle',
            ],
            'tabs' => [
                'informations' => 'Informations',
                'permissions' => 'Permissions',
                'permissions_search_placeholder' => 'Rechercher une permission...',
                'users' => 'Utilisateurs',
            ],
            'fields' => [
                'name' => [
                    'label' => 'Nom',
                    'placeholder' => 'Entrez le nom du rôle',
                    'description' => 'Le nom d\'affichage du rôle dans l\'application.',
                    'system_helper' => 'C\'est un rôle système et il ne peut pas être renommé.',
                    'system_badge' => 'Rôle Système',
                ],
            ],
            'users' => [
                'assigned_title' => 'Utilisateurs assignés',
                'filter_placeholder' => 'Filtrer la liste...',
                'filter_empty' => 'Aucun utilisateur ne correspond à ":search"',
                'filter_clear' => 'Effacer la recherche',
                'dialog' => [
                    'trigger' => 'Ajouter des utilisateurs',
                    'title' => 'Ajouter des utilisateurs',
                    'search_placeholder' => 'Rechercher par nom ou email...',
                    'search_empty' => 'Aucun résultat pour ":search"',
                    'description' => 'Sélectionnez les utilisateurs à ajouter à ce rôle.',
                    'empty' => [
                        'title' => 'Aucun utilisateur trouvé.',
                        'description' => 'Tous les utilisateurs sont déjà assignés à ce rôle.',
                    ],

                    'table' => [
                        'columns' => [
                            'name' => 'Nom',
                            'email' => 'Email',
                        ],
                        'actions' => [
                            'add' => 'Ajouter',
                        ],
                    ],

                    'buttons' => [
                        'close' => 'Fermer',
                    ],
                ],
                'table' => [
                    'columns' => [
                        'name' => 'Nom',
                        'email' => 'Email',
                        'actions' => 'Actions',
                    ],
                    'actions' => [
                        'remove' => 'Retirer',
                    ],
                ],
                'you' => 'Vous',

                'empty' => [
                    'title' => 'Aucun utilisateur trouvé.',
                    'description' => 'Ce rôle n\'a pas encore d\'utilisateurs assignés.',
                    'action' => 'Ajouter des utilisateurs',
                ],

                'flash' => [
                    'added' => 'Utilisateurs ajoutés au rôle avec succès.',
                    'removed' => 'Utilisateur retiré du rôle avec succès.',
                ],
            ],
        ],
        'delete' => [
            'title' => 'Êtes-vous sûr de vouloir supprimer ce rôle ?',
            'description' => 'Cette action est irréversible. Cela supprimera définitivement le rôle intitulé ":title".',
            'buttons' => [
                'cancel' => 'Annuler',
                'confirm' => 'Oui, supprimer le rôle',
            ],
        ],
    ],
];
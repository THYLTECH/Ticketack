<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Flash
    |--------------------------------------------------------------------------
    |
    */
    'flash' => [
        'created' => 'Utilisateur créé avec succès.',
        'updated' => 'Utilisateur mis à jour avec succès.',
        'deleted' => 'Utilisateur supprimé avec succès.',
        'restored' => 'Utilisateur restauré avec succès.',
        'forced_deleted' => 'Utilisateur supprimé définitivement avec succès.',
    ],

    /*
    |--------------------------------------------------------------------------
    | Pages
    |--------------------------------------------------------------------------
    |
    */

    'pages' => [
        'breadcrumbs' => [
            'index' => 'Utilisateurs',
            'create' => 'Créer un utilisateur',
            'show' => 'Voir l\'utilisateur',
            'edit' => 'Modifier l\'utilisateur',
        ],

        'index' => [
            'head_title' => 'Utilisateurs',
            'search_placeholder' => 'Rechercher des utilisateurs...',
            'filter_role_placeholder' => 'Filtrer par rôle',
            'filters' => [
                'role_placeholder' => 'Filtrer par rôle',
            ],
            'title' => 'Utilisateurs',
            'description' => 'Gérez et visualisez tous les utilisateurs au même endroit.',

            'buttons' => [
                'create' => 'Créer un utilisateur',
            ],

            'empty' => [
                'title' => 'Aucun utilisateur trouvé',
                'description' => 'Commencez par créer votre premier utilisateur.',
                'button' => 'Actualiser',
            ],

            'table' => [
                'columns' => [
                    'pfp' => 'Photo de profil',
                    'name' => 'Nom',
                    'email' => 'Email',
                    'email_status' => 'Statut de l\'email',
                    'roles' => 'Rôles',
                    'updated_at' => 'Dernière mise à jour',
                    'created_at' => 'Créé le',
                ],
                'labels' => [
                    'you' => 'Vous',
                    'email_verified' => 'Vérifié',
                    'email_unverified' => 'Non vérifié',
                ]
            ],
        ],
        'create' => [
            'head_title' => 'Créer un utilisateur',

            'title' => 'Créer un utilisateur',
            'description' => 'Remplissez le formulaire ci-dessous pour créer un nouvel utilisateur.',
        ],
        'edit' => [
            'head_title' => 'Modifier l\'utilisateur :name',

            'title' => 'Modifier l\'utilisateur :name',
            'description' => 'Modifiez les détails de l\'utilisateur ci-dessous.',
        ],
        'show' => [
            'head_title' => 'Voir l\'utilisateur :name',

            'title' => 'Voir l\'utilisateur :name',
            'description' => 'Consultez les détails de cet utilisateur.',
        ],
        'form' => [
            'buttons' => [
                'back' => 'Retour aux utilisateurs',
                'store' => 'Enregistrer l\'utilisateur',
                'update' => 'Mettre à jour l\'utilisateur',
                'delete' => 'Supprimer l\'utilisateur',
                'edit' => 'Modifier l\'utilisateur',
            ],
            'tabs' => [
                'informations' => 'Informations',
            ],
            'fields' => [
                'name' => [
                    'label' => 'Nom',
                    'placeholder' => 'ex. John Doe',
                ],
                'email' => [
                    'label' => 'Adresse e-mail',
                    'placeholder' => 'ex. utilisateur@exemple.com',
                ],
                'email_status' => [
                    'label' => 'Statut de l\'email',
                    'verified' => 'Vérifié',
                    'unverified' => 'Non vérifié',
                    'placeholder' => 'Sélectionnez le statut de vérification',
                ],
                'phone' => [
                    'label' => 'Numéro de téléphone',
                    'placeholder' => 'ex. +33612345678',
                    'search_placeholder' => 'ex. France',
                ],
                'roles' => [
                    'label' => 'Rôles',
                    'placeholder' => 'Sélectionnez les rôles de l\'utilisateur',
                ],
                'pfp' => [
                    'label' => 'Photo de profil',
                ],
            ],

            'users' => [
                'dialog' => [
                    'trigger' => 'Ajouter des utilisateurs',
                    'title' => 'Ajouter des utilisateurs',
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
            'title' => 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?',
            'description' => 'Cette action est irréversible. Cela supprimera définitivement l\'utilisateur \':name\'.',
            'buttons' => [
                'cancel' => 'Annuler',
                'confirm' => 'Oui, supprimer l\'utilisateur',
            ],
        ],
    ],
];
<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Flash
    |--------------------------------------------------------------------------
    |
    */

    'flash' => [
        'created' => 'Création de l\'asset réussie.',
        'updated' => 'Mise à jour de l\'asset réussie.',
        'deleted' => 'Suppression de l\'asset réussie.',
        'restored' => 'Restauration de l\'asset réussie.',
        'forced_deleted' => 'Suppression définitive de l\'asset réussie.',
        'invalid_parent' => 'L\'asset parent sélectionné est invalide.',
    ],
    'filters' => [
        'attributes' => 'Attributs',
        'attributes_search' => 'Rechercher par attribut...',
    ],

    /*
    |--------------------------------------------------------------------------
    | Pages
    |--------------------------------------------------------------------------
    |
    */

    'pages' => [
        'breadcrumbs' => [
            'index' => 'Assets',
            'create' => 'Créer un Asset',
            'show' => 'Voir l\'Asset',
            'edit' => 'Editer l\'Asset',
        ],
        'index' => [
            'head_title' => 'Assets',

            'title' => 'Assets',
            'description' => 'Gérez et visualisez tous vos assets en un seul endroit.',

            'buttons' => [
                'create' => 'Créer un Asset',
                'expand' => 'Tout développer',
                'collapse' => 'Tout réduire',
            ],

            'empty' => [
                'title' => 'Aucun asset trouvé',
                'description' => 'Commencez par créer votre premier asset.',
                'button' => 'Rafraîchir',
            ],

            'table' => [
                'headers' => [
                    'asset' => 'Asset',
                    'attributes' => 'Attributs',
                    'updated_at' => 'Date de modification',
                    'created_at' => 'Date de création',
                ],
            ],
            'filter' => [
                'placeholder' => 'Rechercher des assets...',
            ]
        ],
        'create' => [
            'head_title' => 'Créer un Asset',

            'title' => 'Créer un Asset',
            'description' => 'Remplissez le formulaire ci-dessous pour créer un nouvel asset.',
        ],
        'show' => [
            'head_title' => 'Voir l\' Asset :title',

            'title' => 'Voir un Asset :title',
            'description' => 'Voir les détails de l\'asset :title.',
        ],
        'edit' => [
            'head_title' => 'Editer l\'Asset :title',

            'title' => 'Editer un Asset :title',
            'description' => 'Modifier les détails de l\'asset :title.',
        ],
        'delete' => [
            'title' => 'Voulez-vous vraiment supprimer cet asset ?',
            'description' => 'Cette action ne peut pas être annulée. Cela supprimera de façon permanente l\'asset \':title\'.',
            'buttons' => [
                'cancel' => 'Annuler',
                'confirm' => 'Oui, supprimer l\'asset',
            ],
        ],
        'form' => [
            'buttons' => [
                'back' => 'Revenir aux assets',
                'store' => 'Créer l\'Asset',
                'update' => 'Mettre à jour l\'Asset',
                'delete' => 'Supprimer l\'Asset',
                'edit' => 'Editer l\'Asset',
            ],
            'tabs' => [
                'informations' => 'Informations',
                'attributes' => 'Attributs',
                'attachments' => 'Pièces jointes',
            ],
            'fields' => [
                'informations' => [
                    'title' => [
                        'label' => 'Titre',
                        'placeholder' => 'Ecrire le titre de l\'Asset',
                    ],
                    'parent_asset' => [
                        'label' => 'Parent',
                        'placeholder' => 'Selectionner un parent',
                        'clear' => 'Effacer la sélection',
                    ],
                    'icon' => [
                        'label' => 'Icon',
                    ],
                    'description' => [
                        'label' => 'Description',
                        'placeholder' => 'Ecrire la description de l\'Asset',
                    ],
                ],
                'attributes' => [
                    'flash' => [
                        'unique_key' => 'Chaque attribut doit avoir une clé unique.',
                        'updated' => 'Mise à jour de l\'attribut réussie.',
                        'added' => 'Ajout de l\'attribut réussi.',
                        'deleted' => 'Suppression de l\'attribut réussie.',
                    ],

                    'buttons' => [
                        'add_attribute' => 'Ajouter un Attribut',
                        'edit_attribute' => 'Editer un Attribut',
                        'delete_attribute' => 'Supprimer un Attribut',
                    ],

                    'dialog' => [
                        'title_create' => 'Ajouter un Attribut',
                        'title_edit' => 'Editer un Attribut',

                        'description_create' => 'Remplir le formulaire ci-dessous pour ajouter un nouvel attribut à cet asset.',
                        'description_edit' => 'Mettre à jour les détails de cet attribut ci-dessous.',

                        'fields' => [
                            'key' => [
                                'label' => 'clé',
                                'placeholder' => 'Ecrire la clé de l\'attribut',
                            ],
                            'value' => [
                                'label' => 'Valeur',
                                'placeholder' => 'Ecrire la valeur de l\'attribut',
                            ],
                        ],

                        'buttons' => [
                            'cancel' => 'Annuler',
                            'confirm_create' => 'Créer l\'attribut',
                            'confirm_edit' => 'Mettre à jour l\'attribut',
                        ],
                    ],

                    'fua' => [
                        'title' => 'Attributs fréquemment utilisés',
                    ],

                    'current' => [
                        'title' => 'Attributs actuels',
                        'buttons' => [
                            'edit' => 'Editer l\'attribut',
                            'delete' => 'Supprimer l\'attribut',
                        ],
                        'empty' => 'Aucun attribut créé pour le moment.',
                    ],

                ],
                'attachments' => [

                ],
            ],
        ],
    ],
];

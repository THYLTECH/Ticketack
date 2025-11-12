<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Messages flash
    |--------------------------------------------------------------------------
    |
    */

    'flash' => [
        'profile_updated' => 'Les informations du profil ont été mises à jour avec succès.',
        'password_updated' => 'Le mot de passe a été mis à jour avec succès.',
        'incorrect_current_password' => 'Le mot de passe actuel est incorrect.',
        'account_deleted' => 'Votre compte a été supprimé avec succès.',
        'language_updated' => 'Les préférences linguistiques ont été mises à jour avec succès.',
    ],

    /*
    |--------------------------------------------------------------------------
    | Contenu des pages
    |--------------------------------------------------------------------------
    |
    */

    'pages' => [

        'breadcrumbs' => [
            'settings' => 'Paramètres',
            'profile' => 'Profil',
            'appearance' => 'Apparence',
            'password' => 'Mot de passe',
        ],

        'profile' => [
            'head_title' => 'Paramètres du profil',

            'info_form' => [
                'title' => 'Informations du profil',
                'description' => 'Mettez à jour vos informations de profil telles que le nom et l’adresse e-mail.',
                'errors' => [
                    'avatar_too_big' => 'L’image est trop lourde. Taille maximale autorisée : :size MB.',
                ],
                'fields' => [
                    'name' => [
                        'label' => 'Nom',
                        'placeholder' => 'Nom complet',
                    ],
                    'email' => [
                        'label' => 'Adresse e-mail',
                        'placeholder' => 'Adresse e-mail',
                    ],
                    'avatar' => [
                        'label' => 'Photo de profil',
                        'max_size' => 'Glisser un fichier ou cliquer pour en choisir un — max : :size MB',
                        'description' => 'Cliquez ou déposez une image pour la télécharger.',
                    ],
                ],
                'buttons' => [
                    'submit' => 'Enregistrer les informations',
                ],
                'crop_title' => 'Recadrer l’image',
                'crop_confirm' => 'Valider',
            ],

            'lang_form' => [
                'title' => 'Préférences linguistiques',
                'description' => 'Choisissez votre langue et votre fuseau horaire préférés.',

                'fields' => [
                    'language' => [
                        'label' => 'Langue',
                        'placeholder' => 'Sélectionnez votre langue',
                    ],
                    'timezone' => [
                        'label' => 'Fuseau horaire',
                        'placeholder' => 'Sélectionnez votre fuseau horaire',
                    ],
                ],
                'buttons' => [
                    'submit' => 'Enregistrer les préférences',
                ],
            ],

            'delete_account' => [
                'title' => 'Supprimer le compte',
                'description' => 'Supprimez votre compte et l’ensemble de ses ressources.',

                'caution_title' => 'Attention',
                'caution_description' => 'Veuillez procéder avec prudence, cette action est irréversible.',

                'dialog' => [
                    'trigger' => 'Supprimer le compte',
                    'title' => 'Êtes-vous sûr de vouloir supprimer votre compte ?',
                    'description' => 'Une fois votre compte supprimé, toutes ses données et ressources seront définitivement effacées. Veuillez saisir votre mot de passe pour confirmer la suppression définitive de votre compte.',
                    'fields' => [
                        'password' => [
                            'label' => 'Mot de passe',
                            'placeholder' => 'Entrez votre mot de passe',
                        ],
                    ],
                    'buttons' => [
                        'cancel' => 'Annuler',
                        'confirm' => 'Supprimer le compte',
                    ],
                ],
            ],
        ],

        'appearance' => [

        ],
        'password' => [

        ],
    ],
];

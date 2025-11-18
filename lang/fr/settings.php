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

        'theme_loading' => 'Mise à jour du thème...',
        'theme_updated' => 'Le thème a été mis à jour avec succès.',

        'color_scheme_loading' => 'Mise à jour du thème de couleur...',
        'color_scheme_updated' => 'Le thème de couleur a été mis à jour avec succès.',

        'notifications_updated' => 'Les préférences de notifications ont été mises à jour avec succès.',
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
            'notification' => 'Notifications',
        ],

        'layout' => [
            'title' => 'Paramètres',
            'description' => 'Gérez les paramètres et préférences de votre compte.',
        ],

        'profile' => [
            'head_title' => 'Paramètres du profil',

            'info_form' => [
                'title' => 'Informations du profil',
                'description' => 'Mettez à jour vos informations de profil telles que le nom et l’adresse e-mail.',
                // FRONT ERRORS (React)
                'avatar_too_big_title' => 'L’image est trop lourde',
                'avatar_too_big_description' => 'La taille maximale autorisée est de :size MB.',

                'avatar_error_type' => 'Format de fichier non supporté.',
                'avatar_error_type_description' => 'Formats autorisés : JPG, PNG, WEBP.',

                'avatar_error_crop' => 'Une erreur est survenue lors du recadrage de l’image.',

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
                        'description' => 'Glisser ou cliquer pour choisir un fichier — max : :size MB',
                    ],
                    'phone' => [
                        'label' => 'Numéro de téléphone',
                        'placeholder' => '01 23 45 67 89',
                        'country_search_placeholder' => 'Rechercher un pays...',
                    ],
                ],
                'buttons' => [
                    'submit' => 'Enregistrer les informations',
                ],
                'crop_title' => 'Recadrer l’image',
                'crop_confirm' => 'Valider',
                'crop_cancel' => 'Annuler',
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
            'head_title' => 'Paramètres d’apparence',

            'theme_form' => [
                'title' => 'Mode de thème',
                'description' => 'Sélectionnez le mode de thème pour votre compte.',
                'options' => [
                    'light' => 'Clair',
                    'dark' => 'Sombre',
                    'system' => 'Système',
                ],
            ],

            'color_form' => [
                'title' => 'Thème de couleur',
                'description' => 'Choisissez votre thème de couleur préféré.',
            ],
        ],

        'password' => [
            'head_title' => 'Paramètres de mot de passe',

            'form' => [
                'title' => 'Mettre à jour le mot de passe',
                'description' => 'Assurez-vous que votre compte utilise un mot de passe long et aléatoire pour rester sécurisé.',

                'fields' => [
                    'current_password' => [
                        'label' => 'Mot de passe actuel',
                        'placeholder' => 'Mot de passe actuel',
                    ],
                    'password' => [
                        'label' => 'Nouveau mot de passe',
                        'placeholder' => 'Nouveau mot de passe',
                    ],
                    'password_confirmation' => [
                        'label' => 'Confirmer le mot de passe',
                        'placeholder' => 'Confirmer le mot de passe',
                    ],
                ],

                'buttons' => [
                    'submit' => 'Enregistrer le mot de passe',
                ],
            ],
        ],

        'notification' => [
            'head_title' => 'Paramètres de notifications',

            'phone_number' => [
                'title' => 'Numéro de téléphone manquant',
                'description' => 'Veuillez ajouter un numéro de téléphone à votre compte dans l’onglet « Paramètres » pour activer les notifications par SMS.',
            ],

            'form' => [
                'title' => 'Préférences de notifications',
                'description' => 'Gérez la façon dont vous recevez vos notifications.',
                'buttons' => [
                    'submit' => 'Enregistrer les préférences',
                ],
            ],
        ],
    ],
];

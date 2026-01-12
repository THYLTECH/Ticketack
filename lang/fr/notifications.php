<?php

return [

    'flash' => [
        'read_success' => 'Notification marquée comme lue.',
        'read_many_success' => 'Notifications marquées comme lues.',
        'delete_success' => 'Notification supprimée avec succès.',
        'delete_many_success' => 'Notifications supprimées avec succès.',
    ],
    'ticket_unassigned' => [
        'title' => 'Ticket non assigné',
        'message' => ':user s\'est retiré du ticket #:ticket_id (:ticket). Le ticket n\'a désormais plus de personne assignée.',
        'action' => 'Voir le ticket',
        'sms' => ':user s\'est désassigné du ticket #:ticket_id. Plus aucune personne assignée.',
    ],

    /*
    |--------------------------------------------------------------------------
    | Notification Language Lines
    |--------------------------------------------------------------------------
    |
    | Les lignes suivantes sont utilisées lors de l'envoi de notifications pour
    | divers messages que nous devons afficher à l'utilisateur. Vous pouvez
    | modifier ces lignes selon les besoins de votre application.
    |
    */

    'sms' => [
        'Example' => [
            'content' => 'Exemple',
        ],
        'ticket_created' => [
            'message' => 'Un nouveau ticket ":title" a été créé sur :app. Voir ici : :url',
        ],
        'ticket_updated' => [
            'message' => 'Le ticket ":title" a été mis à jour sur :app. Voir les détails ici : :url',
        ],
        'ticket_assigned' => [
            'message' => 'Vous avez été assigné au ticket ":title" sur :app. Voir ici : :url',
        ],
        'ticket_unassigned' => [
            'message' => 'Le ticket ":title" n\'est plus assigné par :user sur :app. Voir ici : :url',
        ],
        'ticket_status_changed' => [
            'message' => 'Le statut du ticket ":title" est passé à :status sur :app. Voir la mise à jour : :url',
        ],
        'ticket_priority_changed' => [
            'message' => 'La priorité du ticket ":title" a été changée en :priority sur :app. Voir ici : :url',
        ],

        'ticket_entry_created' => [
            'message' => 'Une nouvelle entrée a été ajoutée au ticket ":title" sur :app. Consulter ici : :url',
        ],
        'ticket_entry_deleted' => [
            'message' => 'Une entrée a été supprimée du ticket ":title" sur :app. Voir le ticket : :url',
        ],
        'ticket_comment_created' => [
            'message' => 'Un nouveau commentaire a été ajouté au ticket ":title" sur :app. Voir ici : :url',
        ],
        'ticket_schedule_created' => [
            'message' => 'Une nouvelle planification a été créée pour le ticket ":title" sur :app. Voir ici : :url',
        ],
        'ticket_schedule_updated' => [
            'message' => 'Une planification a été mise à jour pour le ticket ":title" sur :app. Vérifier ici : :url',
        ],
        'ticket_schedule_deleted' => [
            'message' => 'Une planification a été supprimée du ticket ":title" sur :app. Voir le ticket : :url',
        ],
    ],

    'database' => [
        'registered' => [
            'title' => 'Bienvenue sur :app !',
            'message' => 'Votre compte a été créé avec succès sur :app. Nous sommes ravis de vous compter parmi nous.',
            'action' => 'Me connecter à mon compte',
        ],
        'ticket_created' => [
            'title' => 'Nouveau ticket créé',
            'message' => 'Un nouveau ticket ":title" a été créé.',
            'action' => 'Voir le ticket',
        ],
        'ticket_updated' => [
            'title' => 'Ticket mis à jour',
            'message' => 'Le ticket ":title" a été mis à jour.',
            'action' => 'Voir le ticket',
        ],
        'ticket_assigned' => [
            'title' => 'Ticket assigné',
            'message' => 'Vous avez été assigné au ticket ":title".',
            'action' => 'Voir le ticket',
        ],
        'ticket_unassigned' => [
            'title' => 'Ticket non assigné',
            'message' => 'Le ticket ":title" a été désassigné par :user.',
            'action' => 'Voir le ticket',
        ],
        'ticket_status_changed' => [
            'title' => 'Statut du ticket modifié',
            'message' => 'Le statut du ticket ":title" est passé à :status.',
            'action' => 'Voir le ticket',
        ],
        'ticket_priority_changed' => [
            'title' => 'Priorité du ticket modifiée',
            'message' => 'La priorité du ticket ":title" a été changée en :priority.',
            'action' => 'Voir le ticket',
        ],

        'ticket_entry_created' => [
            'title' => 'Nouvelle entrée sur le ticket',
            'message' => 'Une nouvelle entrée a été ajoutée au ticket ":title".',
            'action' => 'Voir le ticket',
        ],
        'ticket_entry_deleted' => [
            'title' => 'Entrée de ticket supprimée',
            'message' => 'Une entrée a été supprimée du ticket ":title".',
            'action' => 'Voir le ticket',
        ],
        'ticket_comment_created' => [
            'title' => 'Commentaire ajouté au ticket',
            'message' => 'Un nouveau commentaire a été ajouté au ticket ":title".',
            'action' => 'Voir le ticket',
        ],
        'ticket_schedule_created' => [
            'title' => 'Planification de ticket créée',
            'message' => 'Une nouvelle planification a été créée pour le ticket ":title".',
            'action' => 'Voir le ticket',
        ],
        'ticket_schedule_updated' => [
            'title' => 'Planification de ticket mise à jour',
            'message' => 'Une planification a été mise à jour pour le ticket ":title".',
            'action' => 'Voir le ticket',
        ],
        'ticket_schedule_deleted' => [
            'title' => 'Planification de ticket supprimée',
            'message' => 'Une planification a été supprimée du ticket ":title".',
            'action' => 'Voir le ticket',
        ],
    ],

    'mail' => [
        'greeting' => 'Bonjour :name,',
        'thanks' => 'Merci de votre confiance,',
        'team' => 'L\'équipe :app',
        'all_rights_reserved' => 'Tous droits réservés',

        'password_reset' => [
            'subject' => ':app — Réinitialisation de votre mot de passe',
            'title' => 'Réinitialisez votre mot de passe',
            'intro' => 'Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous.',
            'expires' => 'Ce lien expirera dans 60 minutes.',
            'button' => 'Réinitialiser mon mot de passe',
            'ignore' => 'Si vous n\'avez pas demandé cela, veuillez ignorer cet e-mail.',
        ],

        'registered' => [
            'subject' => ':app — Bienvenue !',
            'title' => 'Bienvenue sur :app !',
            'intro' => 'Votre compte a été créé avec succès sur :app. Nous sommes ravis de vous compter parmi nous.',
            'button' => 'Me connecter à mon compte',
            'body' => 'Vous pouvez maintenant vous connecter et commencer à utiliser toutes les fonctionnalités de la plateforme.',
            'password' => 'Votre mot de passe temporaire est :password. Veuillez le modifier après votre première connexion.',
        ],

        'verify_email' => [
            'subject' => ':app — Vérifiez votre adresse e-mail',
            'title' => 'Vérifiez votre adresse e-mail',
            'intro' => 'Merci de vous être inscrit sur :app. Pour finaliser votre inscription, veuillez vérifier votre adresse e-mail en cliquant sur le bouton ci-dessous.',
            'button' => 'Vérifier mon adresse e-mail',
            'ignore' => 'Si vous n\'avez pas créé de compte sur :app, veuillez ignorer cet e-mail.',
        ],

        'ticket_created' => [
            'subject' => ':app — Nouveau ticket créé',
            'title' => 'Nouveau ticket créé',
            'intro' => 'Un nouveau ticket ":title" a été créé.',
            'button' => 'Voir le ticket',
        ],
        'ticket_updated' => [
            'subject' => ':app — Ticket mis à jour',
            'title' => 'Ticket mis à jour',
            'intro' => 'Le ticket ":title" a été mis à jour.',
            'button' => 'Voir le ticket',
        ],
        'ticket_assigned' => [
            'subject' => ':app — Ticket assigné',
            'title' => 'Ticket assigné',
            'intro' => 'Vous avez été assigné au ticket ":title".',
            'button' => 'Voir le ticket',
        ],
        'ticket_unassigned' => [
            'subject' => ':app — Ticket non assigné',
            'title' => 'Ticket non assigné',
            'intro' => 'Le ticket ":title" n\'est plus assigné par :user.',
            'button' => 'Voir le ticket',
        ],
        'ticket_status_changed' => [
            'subject' => ':app — Statut du ticket modifié',
            'title' => 'Statut du ticket modifié',
            'intro' => 'Le statut du ticket ":title" est passé à :status.',
            'button' => 'Voir le ticket',
        ],
        'ticket_priority_changed' => [
            'subject' => ':app — Priorité du ticket modifiée',
            'title' => 'Priorité du ticket modifiée',
            'intro' => 'La priorité du ticket ":title" a été changée en :priority.',
            'button' => 'Voir le ticket',
        ],
        'ticket_entry_created' => [
            'subject' => ':app — Nouvelle entrée sur le ticket',
            'title' => 'Nouvelle entrée sur le ticket',
            'intro' => 'Une nouvelle entrée a été ajoutée au ticket ":title".',
            'button' => 'Voir le ticket',
        ],
        'ticket_entry_deleted' => [
            'subject' => ':app — Entrée de ticket supprimée',
            'title' => 'Entrée de ticket supprimée',
            'intro' => 'Une entrée a été supprimée du ticket ":title".',
            'button' => 'Voir le ticket',
        ],
        'ticket_comment_created' => [
            'subject' => ':app — Commentaire ajouté au ticket',
            'title' => 'Commentaire ajouté au ticket',
            'intro' => 'Un nouveau commentaire a été ajouté au ticket ":title".',
            'button' => 'Voir le ticket',
        ],
        'ticket_schedule_created' => [
            'subject' => ':app — Planification de ticket créée',
            'title' => 'Planification de ticket créée',
            'intro' => 'Une nouvelle planification a été créée pour le ticket ":title".',
            'button' => 'Voir le ticket',
        ],
        'ticket_schedule_updated' => [
            'subject' => ':app — Planification de ticket mise à jour',
            'title' => 'Planification de ticket mise à jour',
            'intro' => 'Une planification a été mise à jour pour le ticket ":title".',
            'button' => 'Voir le ticket',
        ],
        'ticket_schedule_deleted' => [
            'subject' => ':app — Planification de ticket supprimée',
            'title' => 'Planification de ticket supprimée',
            'intro' => 'Une planification a été supprimée du ticket ":title".',
            'button' => 'Voir le ticket',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Notification Preferences
    |--------------------------------------------------------------------------
    |
    */

    'preferences' => [
        'auth' => [
            'title' => 'Authentification',
            'description' => 'Gérez les notifications liées à la sécurité de votre compte et aux événements d\'authentification. Si aucun canal n\'est sélectionné, la notification sera envoyée par e-mail par défaut.',
            'items' => [
                'user_registered' => [
                    'title' => 'Nouvelle inscription au compte',
                    'description' => 'Recevez une confirmation lorsque votre compte est créé avec succès.',
                ],
                'password_reset' => [
                    'title' => 'Demande de réinitialisation du mot de passe',
                    'description' => 'Soyez averti lorsqu\'une réinitialisation de mot de passe est demandée pour votre compte.',
                ],
                'verify_email' => [
                    'title' => 'Vérification de l\'e-mail',
                    'description' => 'Soyez alerté lorsqu\'une vérification d\'e-mail est requise ou complétée.',
                ],
            ],
        ],
        'tickets' => [
            'title' => 'Tickets',
            'description' => 'Gérez les notifications liées aux activités et mises à jour des tickets. Si aucun canal n\'est sélectionné, la notification sera envoyée par e-mail par défaut.',
            'items' => [
                'ticket_created' => [
                    'title' => 'Ticket créé',
                    'description' => 'Recevez une notification lorsqu\'un nouveau ticket dans lequel vous êtes impliqué est créé.',
                ],
                'ticket_updated' => [
                    'title' => 'Ticket mis à jour',
                    'description' => 'Soyez averti lorsqu\'un ticket dans lequel vous êtes impliqué est mis à jour.',
                ],
                'ticket_status_changed' => [
                    'title' => 'Statut du ticket modifié',
                    'description' => 'Recevez une notification lorsque le statut d\'un ticket dans lequel vous êtes impliqué change.',
                ],
                'ticket_priority_changed' => [
                    'title' => 'Priorité du ticket modifiée',
                    'description' => 'Soyez alerté lorsque la priorité d\'un ticket dans lequel vous êtes impliqué change.',
                ],
                'ticket_assigned' => [
                    'title' => 'Ticket assigné',
                    'description' => 'Soyez averti lorsque vous êtes assigné à un ticket.',
                ],
                'ticket_unassigned' => [
                    'title' => 'Ticket non assigné',
                    'description' => 'Soyez averti lorsqu\'un ticket n\'est plus assigné.',
                ],

                'ticket_entry_created' => [
                    'title' => 'Nouvelle entrée de ticket',
                    'description' => 'Soyez averti lorsqu\'une nouvelle entrée est ajoutée à un ticket dans lequel vous êtes impliqué.',
                ],
                'ticket_entry_deleted' => [
                    'title' => 'Entrée de ticket supprimée',
                    'description' => 'Soyez alerté lorsqu\'une entrée de ticket dans laquelle vous êtes impliqué est supprimée.',
                ],
                'ticket_comment_created' => [
                    'title' => 'Commentaire sur le ticket',
                    'description' => 'Soyez alerté lorsque quelqu\'un commente un ticket dans lequel vous êtes impliqué.',
                ],
                'ticket_schedule_created' => [
                    'title' => 'Planification créée',
                    'description' => 'Recevez une notification lorsqu\'une planification est créée pour un ticket dans lequel vous êtes impliqué.',
                ],
                'ticket_schedule_updated' => [
                    'title' => 'Planification mise à jour',
                    'description' => 'Recevez une notification lorsqu\'une planification est mise à jour pour un ticket dans lequel vous êtes impliqué.',
                ],
                'ticket_schedule_deleted' => [
                    'title' => 'Planification supprimée',
                    'description' => 'Recevez une notification lorsqu\'une planification est supprimée pour un ticket dans lequel vous êtes impliqué.',
                ],
            ],
        ],
    ],

    'channels' => [
        'mail' => 'E-mail',
        'database' => 'Base de données',
        'vonage' => 'SMS',
    ],

    /*
    |--------------------------------------------------------------------------
    | Pages
    |--------------------------------------------------------------------------
    |
    */

    'pages' => [
        'breadcrumbs' => [
            'index' => 'Notifications',
        ],
        'index' => [
            'head_title' => 'Notifications',

            'title' => 'Vos Notifications',
            'description' => 'Gérez et consultez toutes vos notifications au même endroit.',

            'bulk_actions' => [
                'text' => 'Vous avez sélectionné :count notification(s), vous pouvez',
                'mark_as_read' => 'les marquer comme lues',
                'or' => 'ou',
                'delete' => 'les supprimer.',
            ],

            'search' => [
                'label' => 'Rechercher',
                'placeholder' => 'Rechercher des notifications...',
                'button' => 'Rechercher',
            ],

            'empty' => [
                'title' => 'Aucune notification',
                'description' => 'Vous êtes à jour. Les nouvelles notifications apparaîtront ici.',
                'button' => 'Actualiser',
            ],

            'table' => [
                'columns' => [
                    'type' => 'Type',
                    'message' => 'Message',
                    'date' => 'Date',
                ],
                'empty' => 'Aucune notification trouvée.',
                'buttons' => [
                    'mark_as_read' => 'Marquer comme lu',
                    'delete' => 'Supprimer',
                ],
                'footer' => 'Affichage de :first à :last sur :total notifications'
            ],

            'dialog' => [
                'buttons' => [
                    'close' => 'Fermer',
                ]
            ]
        ],
    ],
];
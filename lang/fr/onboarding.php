<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Onboarding Tutorial Translations
    |--------------------------------------------------------------------------
    |
    */

    'actions' => [
        'next' => 'Suivant',
        'previous' => 'Précédent',
        'skip' => 'Fermer',
        'finish' => 'Terminer',
    ],

    'welcome' => [
        'title' => 'Bienvenue sur Ticketack !',
        'description' => 'Votre espace pour gérer vos demandes de support simplement et efficacement.',
        'tip_1' => 'Explorez l’application à votre rythme. Des bulles d’aide apparaîtront sur chaque nouvelle page pour vous guider.',
        'button' => 'C’est parti !',
    ],

    'home' => [
        'tabs' => [
            'title' => 'Vos tickets',
            'description' => 'Accédez ici à tous vos tickets personnels. Basculez entre vos tickets en attente et ceux qui ont été résolus.',
        ],
        'open_column' => [
            'title' => 'En cours',
            'description' => 'Ici s’affichent vos tickets qui attendent une réponse ou une action. Gardez un œil dessus !',
        ],
        'closed_column' => [
            'title' => 'Résolus',
            'description' => 'Retrouvez ici l’historique de vos demandes traitées récemment.',
        ],
    ],

    'tickets' => [
        'list' => [
            'title' => 'Tous les tickets',
            'description' => 'Une vue d’ensemble complète. Utilisez les filtres et la recherche pour retrouver n’importe quel ticket.',
        ],
        'filters' => [
            'title' => 'Filtres intelligents',
            'description' => 'Affinez votre recherche par statut, priorité ou catégorie en un clic.',
        ],
    ],

    'ticket_detail' => [
        'info_tab' => [
            'title' => 'Informations',
            'description' => 'Tous les détails essentiels du ticket sont ici : description, priorité, et fichiers joints.',
        ],
        'properties' => [
            'title' => 'Propriétés',
            'description' => 'Visualisez rapidement le statut, la priorité et les autres attributs clés du ticket.',
        ],
        'comments_tab' => [
            'title' => 'Discussion',
            'description' => 'Échangez avec le support ici. Vous serez notifié à chaque nouvelle réponse.',
        ],
        'calendar_tab' => [
            'title' => 'Planning',
            'description' => 'Visualisez les interventions prévues liées à ce ticket.',
        ],
        'logs_tab' => [
            'title' => 'Historique',
            'description' => 'Tracez chaque action effectuée sur ce ticket depuis sa création.',
        ],
    ],

    'create_ticket' => [
        'form' => [
            'title' => 'Nouvelle demande',
            'description' => 'Décrivez votre problème le plus précisément possible pour nous aider à le résoudre rapidement.',
        ],
        'attachments' => [
            'title' => 'Pièces jointes',
            'description' => 'N’hésitez pas à ajouter des captures d’écran ou documents pour illustrer votre demande.',
        ],
    ],

    'notifications' => [
        'list' => [
            'title' => 'Centre de notifications',
            'description' => 'Retrouvez ici tout ce qui s’est passé pendant votre absence. Cliquez pour marquer comme lu.',
        ],
        'fake' => [
            'title' => 'Bienvenue ! 🎉',
            'message' => 'Ceci est une notification de test pour vous montrer comment elles apparaissent.',
        ],
    ],

    'archived' => [
        'list' => [
            'title' => 'Tickets archivés',
            'description' => 'Retrouvez ici les tickets supprimés ou archivés. Ils sont en lecture seule.',
        ],
    ],

    'settings' => [
        'profile' => [
            'title' => 'Mon profil',
            'description' => 'Gérez vos informations personnelles ici. Utilisez le menu latéral pour accéder aux autres paramètres.',
        ],
        'appearance' => [
            'theme' => [
                'title' => 'Thème',
                'description' => 'Choisissez entre le mode clair, sombre ou système.',
            ],
            'color' => [
                'title' => 'Couleur d\'accentuation',
                'description' => 'Personnalisez la couleur principale de l\'interface.',
            ],
        ],
        'notifications' => [
            'preferences' => [
                'title' => 'Préférences de notification',
                'description' => 'Configurez précisément quels emails ou notifications vous souhaitez recevoir.',
            ],
        ],
    ],

    'planning' => [
        'calendar' => [
            'title' => 'Votre planning',
            'description' => 'Voici le calendrier des interventions. Chaque bloc représente une tâche planifiée.',
        ],
        'edit_mode' => [
            'title' => 'Mode édition',
            'description' => 'Activez ce mode pour planifier de nouvelles interventions. Une sidebar apparaîtra avec vos tickets.',
        ],
        'sidebar' => [
            'title' => 'Vos tickets à planifier',
            'description' => 'Glissez un ticket depuis cette liste vers le calendrier pour le planifier.',
        ],
        'filters' => [
            'title' => 'Filtrer par intervenant',
            'description' => 'Cochez les intervenants pour voir uniquement leurs plannings.',
        ],
        'demo_event' => [
            'title' => 'Exemple de tâche',
            'description' => 'Intervention technique - Maintenance serveur',
        ],
        'demo_ticket' => [
            'title' => 'Ticket à planifier',
            'description' => 'Demande d\'installation matériel',
        ],
    ],

    'time_entries' => [
        'stats' => [
            'title' => 'Vos statistiques',
            'description' => 'Résumé de vos heures travaillées. Ce compteur se met à jour en temps réel.',
        ],
        'table' => [
            'title' => 'Historique des saisies',
            'description' => 'Toutes vos entrées de temps sont listées ici. Cliquez pour modifier ou supprimer.',
        ],
        'demo_entry' => [
            'title' => 'Exemple de saisie',
            'description' => 'Développement nouvelle fonctionnalité',
        ],
    ],

    'knowledge' => [
        'search' => [
            'title' => 'Recherche IA',
            'description' => 'Tapez votre question en langage naturel. L\'IA trouvera les tickets et documents pertinents.',
        ],
        'filters' => [
            'title' => 'Affiner les résultats',
            'description' => 'Utilisez ces filtres pour cibler vos recherches par date, auteur ou catégorie.',
        ],
    ],

    'assignment' => [
        'stats' => [
            'title' => 'Tickets non assignés',
            'description' => 'Vue d\'ensemble des tickets en attente d\'assignation avec leurs priorités.',
        ],
        'table' => [
            'title' => 'Liste des tickets',
            'description' => 'Cliquez sur "Assigner" pour attribuer un ticket à un ou plusieurs intervenants.',
        ],
        'demo_ticket' => [
            'title' => 'Ticket exemple',
            'description' => 'En attente d\'assignation - Demande de support IT',
        ],
    ],
    
    'assets' => [
        'table' => [
            'title' => 'Inventaire des actifs',
            'description' => 'Consultez et gérez tous les équipements de votre organisation ici.',
        ],
        'demo_asset' => [
            'title' => 'Actif exemple',
            'description' => 'MacBook Pro 16" - Dép. Ingénierie',
        ],
    ],

    'users' => [
        'table' => [
            'title' => 'Annuaire utilisateurs',
            'description' => 'Gérez les comptes de tous les utilisateurs.',
        ],
        'demo_user' => [
            'name' => 'Jean Dupont',
        ],
    ],

    'roles' => [
        'table' => [
            'title' => 'Rôles et permissions',
            'description' => 'Définissez ce que vos utilisateurs peuvent faire en leur assignant des rôles.',
        ],
        'demo_role' => [
            'title' => 'Manager',
        ],
    ],

    'trash' => [
        'tabs' => [
            'title' => 'Catégories',
            'description' => 'Naviguez entre les tickets, utilisateurs, actifs et rôles supprimés.',
        ],
        'retention' => [
            'title' => 'Rétention automatique',
            'description' => 'Configurez la durée de conservation avant la suppression définitive.',
        ],
        'table' => [
            'title' => 'Éléments restaurables',
            'description' => 'Les éléments sont conservés 30 jours ici. Vous pouvez les restaurer ou les supprimer définitivement.',
        ],
        'demo_item' => [
            'title' => 'Élément supprimé',
        ],
    ],

];

<?php

return [
    'assets' => [
        'title' => 'Actifs',
        'description' => 'Gérer les permissions liées aux actifs (équipements).',
        'items' => [
            'view' => ['title' => 'Voir les actifs', 'description' => 'Autoriser l\'accès à la liste des actifs.'],
            'show' => ['title' => 'Afficher les détails de l\'actif', 'description' => 'Autoriser la consultation des informations détaillées d\'un actif.'],
            'create' => ['title' => 'Créer des actifs', 'description' => 'Autoriser la création de nouveaux actifs.'],
            'update' => ['title' => 'Modifier des actifs', 'description' => 'Autoriser la modification des actifs existants.'],
            'delete' => ['title' => 'Supprimer des actifs', 'description' => 'Autoriser la suppression d\'actifs.'],
            'restore' => ['title' => 'Restaurer des actifs', 'description' => 'Autoriser la restauration d\'actifs supprimés.'],
            'force delete' => ['title' => 'Supprimer définitivement', 'description' => 'Autoriser la suppression permanente d\'actifs.'],
        ],
    ],

    'users' => [
        'title' => 'Utilisateurs',
        'description' => 'Gérer les permissions liées aux utilisateurs.',
        'items' => [
            'view' => ['title' => 'Voir les utilisateurs', 'description' => 'Autoriser l\'accès à la liste des utilisateurs.'],
            'show' => ['title' => 'Afficher les détails de l\'utilisateur', 'description' => 'Autoriser la consultation des informations détaillées d\'un utilisateur.'],
            'create' => ['title' => 'Créer des utilisateurs', 'description' => 'Autoriser la création de nouveaux utilisateurs.'],
            'update' => ['title' => 'Modifier des utilisateurs', 'description' => 'Autoriser la modification des utilisateurs existants.'],
            'delete' => ['title' => 'Supprimer des utilisateurs', 'description' => 'Autoriser la suppression d\'utilisateurs.'],
        ],
    ],

    'roles' => [
        'title' => 'Rôles',
        'description' => 'Gérer les permissions liées aux rôles.',
        'items' => [
            'view' => ['title' => 'Voir les rôles', 'description' => 'Autoriser l\'accès à la liste des rôles.'],
            'show' => ['title' => 'Afficher les détails du rôle', 'description' => 'Autoriser la consultation des informations détaillées d\'un rôle.'],
            'create' => ['title' => 'Créer des rôles', 'description' => 'Autoriser la création de nouveaux rôles.'],
            'update' => ['title' => 'Modifier des rôles', 'description' => 'Autoriser la modification des rôles existants.'],
            'delete' => ['title' => 'Supprimer des rôles', 'description' => 'Autoriser la suppression de rôles.'],
        ],
    ],

    'tickets' => [
        'title' => 'Tickets',
        'description' => 'Gérer les permissions liées aux tickets.',
        'items' => [
            'view' => ['title' => 'Voir les tickets', 'description' => 'Autoriser l\'accès à la liste des tickets.'],
            'show' => ['title' => 'Afficher les détails du ticket', 'description' => 'Autoriser la consultation des informations détaillées d\'un ticket.'],
            'create' => ['title' => 'Créer des tickets', 'description' => 'Autoriser la création de nouveaux tickets.'],
            'be assigned' => ['title' => 'Être assigné aux tickets', 'description' => 'Autoriser l\'assignation à des tickets et l\'auto-assignation.'],
            'assign' => ['title' => 'Assigner des tickets', 'description' => 'Autoriser l\'assignation de tickets à d\'autres utilisateurs.'],
            'update' => ['title' => 'Modifier des tickets', 'description' => 'Autoriser la modification des tickets existants.'],
            'delete' => ['title' => 'Supprimer des tickets', 'description' => 'Autoriser la suppression de tickets.'],
            'restore' => ['title' => 'Restaurer des tickets', 'description' => 'Autoriser la restauration de tickets supprimés.'],
            'force delete' => ['title' => 'Supprimer définitivement', 'description' => 'Autoriser la suppression permanente de tickets.'],
            'archive' => ['title' => 'Archiver des tickets', 'description' => 'Autoriser l\'archivage de tickets.'],
            'unarchive' => ['title' => 'Désarchiver des tickets', 'description' => 'Autoriser le désarchivage de tickets.'],
            'view all archived' => ['title' => 'Voir tous les tickets archivés', 'description' => 'Autoriser la consultation de tous les tickets archivés de tous les utilisateurs.'],
            'manage priority' => ['title' => 'Gérer les priorités', 'description' => 'Autoriser la gestion des priorités de tickets.'],
            'manage status' => ['title' => 'Gérer les statuts', 'description' => 'Autoriser la gestion des statuts de tickets.'],
            'manage category' => ['title' => 'Gérer les catégories', 'description' => 'Autoriser la gestion des catégories de tickets.'],
            'use ai suggestions' => ['title' => 'Utiliser les suggestions IA', 'description' => 'Autoriser la consultation et l\'interaction avec les suggestions générées par l\'IA.'],
        ],
    ],

    'entries' => [
        'title' => 'Saisies de temps',
        'description' => 'Gérer le suivi du temps sur les tickets.',
        'items' => [
            'view ticket' => ['title' => 'Voir les saisies', 'description' => 'Autoriser la consultation des saisies de temps.'],
            'create ticket' => ['title' => 'Créer des saisies', 'description' => 'Autoriser l\'enregistrement de nouvelles saisies de temps.'],
            'update ticket' => ['title' => 'Modifier des saisies', 'description' => 'Autoriser la modification des saisies de temps existantes.'],
            'delete ticket' => ['title' => 'Supprimer des saisies', 'description' => 'Autoriser la suppression de saisies de temps.'],
        ],
    ],

    'knowledge' => [
        'title' => 'Base de connaissances',
        'description' => 'Accéder à l\'explorateur de connaissances.',
        'items' => [
            'view explorer' => ['title' => 'Voir la base de connaissances', 'description' => 'Accéder à l\'interface de l\'explorateur de connaissances.'],
        ],
    ],

    'trash' => [
        'title' => 'Corbeille',
        'description' => 'Gérer les éléments supprimés.',
        'items' => [
            'view' => ['title' => 'Voir la corbeille', 'description' => 'Accéder à la corbeille.'],
            'edit' => ['title' => 'Gérer la corbeille', 'description' => 'Effectuer des actions dans la corbeille.'],
            'restore' => ['title' => 'Restaurer des éléments', 'description' => 'Restaurer des éléments depuis la corbeille.'],
            'force delete' => ['title' => 'Vider la corbeille', 'description' => 'Supprimer définitivement des éléments de la corbeille.'],
        ],
    ],

    'planning' => [
        'title' => 'Planning',
        'description' => 'Gérer l\'emploi du temps et la planification.',
        'items' => [
            'view' => ['title' => 'Voir le planning', 'description' => 'Accéder à la vue du planning.'],
            'manage' => ['title' => 'Gérer le planning', 'description' => 'Créer et modifier des événements au planning.'],
        ],
    ],
    'dashboard' => [
        'title' => 'Tableau de bord',
        'description' => 'Accéder à la vue d\'ensemble du tableau de bord.',
        'items' => [
            'view' => ['title' => 'Voir le tableau de bord', 'description' => 'Autoriser l\'accès à la page du tableau de bord.'],
        ],
    ],
];
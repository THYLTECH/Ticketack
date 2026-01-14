<?php

return [
    'buttons' => [
        'search' => 'Rechercher',
        'view_source' => 'Voir le ticket source',
        'view_details' => 'Voir les détails',
        'loading' => 'Veuillez patienter...',
        'load_more' => 'Charger plus',
    ],
    'filters' => [
        'label' => 'Filtres',
        'date' => 'Période',
        'author' => 'Auteur / Résolveur',
        'category' => 'Catégorie',
        'asset' => 'Asset',
        'type' => 'Type de fichier',
        'clear' => 'Effacer les filtres',
        'empty' => 'Aucun résultat trouvé.',
        'selected' => 'sélectionné(s)',
        'types' => [
            'all' => 'Tous les types',
            'image' => 'Images',
            'pdf' => 'PDF',
            'ticket' => 'Tickets'
        ],
    ],
    'pages' => [
        'search' => [
            'title' => 'Base de connaissances',
            'hero_title' => 'Base de connaissances AI',
            'badge' => 'Trouvez des réponses à vos questions en quelques minutes.',
            'hero_description' => 'Recherche sémantique à travers l\'historique des tickets, les solutions détaillées et les pièces jointes.',
            'placeholder' => 'Décrivez le problème (ex: erreur SMTP outlook port 587)...',
            'service_unavailable' => 'Le service de recherche est temporairement indisponible',
            'service_unavailable_title' => 'Service de recherche indisponible',
            'service_unavailable_description' => 'Le service de recherche vectorielle est actuellement hors ligne. Cette fonctionnalité nécessite que le service ETL soit actif. Veuillez contacter votre administrateur système.',
            'service_unavailable_toast_description' => 'Le service de recherche vectorielle est peut-être hors ligne. Veuillez contacter votre administrateur.',
            'admin_instructions' => 'Pour les administrateurs',
            'admin_start_service' => 'Démarrez le service ETL avec',
            'admin_or_update' => 'Ou mettez à jour',
            'admin_in_env' => 'dans le fichier .env en cas d\'exécution locale',
            'error' => 'Une erreur est survenue lors de la recherche',
        ],
    ],
    'results' => [
        'count' => ':count résultats trouvés',
        'found' => 'résultats trouvés',
        'by' => 'Par',
        'best_match' => 'Meilleure correspondance',
        'solution_available' => 'Solution référencée disponible',
        'relevance' => 'Pertinence',
        'empty_title' => 'Aucun résultat trouvé.',
        'empty_description' => 'Aucun résultat ne correspond à vos filtres ou critères de recherche actuels.',
    ],
    'similar' => [
        'title' => 'Tickets similaires (Suggestions IA)',
        'match' => 'Pertinence',
        'view' => 'Voir le ticket',
    ],
];
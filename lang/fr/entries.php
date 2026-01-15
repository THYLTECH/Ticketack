<?php

return [
    'entries' => 'Saisies',
    'entry' => 'Saisie',
    'flash' => [
        'created' => 'Saisie de temps créée avec succès.',
        'overlap_error' => 'Cette saisie chevauche une autre saisie existante.',
        'overlap_details' => 'Chevauchement avec le ticket #:id : :title (:start - :end)',
        'future_error' => 'Impossible d\'enregistrer du temps dans le futur.',
    ],
    'header' => [
        'title' => 'Suivi du temps',
        'description' => 'Analysez vos performances et exportez vos données.',
        'actions' => [
            'report' => 'Rapport',
            'log_time' => 'Saisir du temps',
        ],
    ],
    'pdf' => [
        'title' => 'Rapport de suivi du temps',
        'company_name' => 'Rapport d\'activité',
        'document_title' => 'Détail des saisies de temps',
        'generated_on' => 'Généré le',
        'date_range' => 'Période',
        'total_hours' => 'Total des heures',
        'ticket_deleted' => 'Ticket #:id (Supprimé)',
        'yes' => 'OUI',
        'no' => 'NON',
        'no_entries' => 'Aucune saisie trouvée pour cette période.',
        'grand_total' => 'TOTAL GÉNÉRAL',
        'table' => [
            'date' => 'Date',
            'description' => 'Ticket & Description',
            'billable' => 'Facturable',
            'duration' => 'Durée',
        ],
        'daily_summary' => 'Répartition quotidienne des heures',
        'weekly_details' => 'Saisies détaillées par semaine',
        'week' => 'Semaine',
        'date' => 'Date',
        'hours' => 'Heures',
        'total' => 'Total',
    ],
    'controller' => [
        'store' => [
            'duration_error' => 'La durée doit être supérieure à 0.',
            'success' => 'Saisie de temps enregistrée avec succès.',
        ],
        'destroy' => [
            'success' => 'Saisie de temps supprimée.',
        ],
    ],
    'report' => [
        'title' => 'Exporter le rapport',
        'description' => 'Générez un fichier contenant toutes les saisies actuellement visibles dans votre liste.',
        'format' => 'Format du fichier',
        'formats' => [
            'csv' => 'Excel (.csv)',
            'pdf' => 'Document PDF',
        ],
        'actions' => [
            'cancel' => 'Annuler',
            'download' => 'Télécharger',
        ],
        'period_all' => 'Tout l\'historique',
        'csv' => [
            'headers' => [
                'date' => 'Date',
                'time' => 'Heure',
                'ticket_id' => 'ID Ticket',
                'ticket_title' => 'Titre du Ticket',
                'category' => 'Catégorie',
                'duration' => 'Durée (h)',
                'description' => 'Description',
                'billable' => 'Facturable',
            ],
            'yes' => 'Oui',
            'no' => 'Non',
            'total_hours' => 'TOTAL HEURES',
            'deleted_ticket' => 'Ticket supprimé',
        ],
    ],
    'stats' => [
        'unit' => 'h',
        'total_hours' => [
            'title' => 'Total des heures',
            'description' => 'Temps de travail total enregistré sur la période filtrée. Inclut toutes les saisies (facturables ou non).',
        ],
        'count' => [
            'title' => 'Interventions',
            'description' => 'Nombre total de sessions de travail enregistrées. Chaque entrée représente une intervention distincte.',
        ],
        'period' => [
            'title' => 'Période active',
            'description' => 'Plage de dates couverte par les saisies affichées. Correspond aux filtres appliqués ou à l\'historique complet.',
        ],
    ],
    'table' => [
        'empty' => [
            'title' => 'Aucune saisie de temps',
            'description' => 'Modifiez vos filtres ou ajoutez une nouvelle saisie.',
        ],
        'headers' => [
            'date' => 'Date',
            'ticket_context' => 'Ticket & Contexte',
            'duration' => 'Durée',
            'description' => 'Description',
            'billable' => 'Fact.',
        ],
        'badges' => [
            'yes' => 'Oui',
            'no' => 'Non',
        ],
        'actions' => [
            'delete' => 'Supprimer',
        ],
        'toast' => [
            'deleted' => 'Saisie de temps supprimée',
            'delete_error' => 'Erreur lors de la suppression',
        ],
        'dialog' => [
            'delete' => [
                'title' => 'Supprimer la saisie',
                'description' => 'Cette action est irréversible. Le temps enregistré sera retiré du ticket et des statistiques globales.',
                'cancel' => 'Annuler',
                'confirm' => 'Confirmer',
            ],
            'preview' => [
                'work_description' => 'Description du travail',
                'no_note' => 'Aucune note fournie pour cette saisie.',
                'technician' => 'Technicien',
                'unknown' => 'Inconnu',
                'duration_billing' => 'Durée & Facturation',
                'billable' => 'Facturable',
                'not_billable' => 'Non-facturable',
                'category' => 'Catégorie',
                'uncategorized' => 'Non catégorisé',
                'status_priority' => 'Statut & Priorité',
                'close' => 'Fermer',
                'go_to_ticket' => 'Aller au ticket',
            ],
        ],
    ],
    'toolbar' => [
        'title' => 'Filtres',
        'category' => [
            'label' => 'Catégorie',
            'all' => 'Toutes',
        ],
        'status' => [
            'label' => 'Statut',
            'all' => 'Tous',
        ],
        'priority' => [
            'label' => 'Priorité',
            'all' => 'Toutes',
        ],
        'billable' => [
            'label' => 'Facturable',
            'all' => 'Tous',
            'yes' => 'Oui',
            'no' => 'Non',
        ],
        'date_range' => 'Période',
        'reset' => 'Réinitialiser',
    ],
    'index' => [
        'title' => 'Suivi du temps',
        'breadcrumbs' => [
            'dashboard' => 'Tableau de bord',
            'current' => 'Saisies',
        ],
        'timezone' => 'Fuseau horaire',
        'description' => 'Consultez et gérez vos saisies de temps.'
    ],
    'pagination' => [
        'showing' => 'Affichage de',
        'of' => 'sur',
        'results' => 'résultats',
        'show' => 'Afficher'
    ],
    'dialog' => [
        'title' => 'Saisir du temps',
        'description_indication' => 'Remplissez le formulaire ci-dessous pour enregistrer votre intervention.',
        'ticket' => [
            'label' => 'Ticket',
            'selected' => 'Ticket sélectionné',
            'placeholder' => 'Sélectionner un ticket...',
            'search' => 'Rechercher un ticket...',
            'empty' => 'Aucun ticket trouvé.',
        ],
        'date' => [
            'label' => 'Date',
            'placeholder' => 'Choisir une date',
        ],
        'duration' => [
            'hours' => 'Heures',
            'minutes' => 'Minutes',
            'h' => 'h',
            'min' => 'min',
            'error' => 'Durée invalide.',
        ],
        'description' => [
            'label' => 'Description',
            'placeholder' => 'Détails de l\'intervention...',
        ],
        'billable' => [
            'label' => 'Type de facturation',
            'standard' => 'Standard',
            'not_billable' => 'Non-facturable',
            'billable' => 'Facturable',
            'to_bill' => 'À facturer au client',
        ],
        'actions' => [
            'cancel' => 'Annuler',
            'save' => 'Enregistrer',
        ],
        'toast' => [
            'date_required' => 'Veuillez sélectionner une date.',
            'success' => 'Saisie de temps ajoutée avec succès',
            'error' => 'Veuillez vérifier les champs du formulaire.',
        ],
    ],
];
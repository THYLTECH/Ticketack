<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Flash
    |--------------------------------------------------------------------------
    */
    'flash' => [
        'created' => 'Ticket créé avec succès.',
        'updated' => 'Ticket mis à jour avec succès.',
        'deleted' => 'Ticket supprimé avec succès.',
        'archived' => 'Ticket archivé avec succès.',
        'unarchived' => 'Ticket désarchivé avec succès.',
        'restored' => 'Ticket restauré avec succès.',
        'force_deleted' => 'Ticket supprimé définitivement avec succès.',

        'categories_success' => 'Catégories de tickets enregistrées avec succès.',
        'categories_error' => 'Certaines catégories ne peuvent pas être supprimées car elles sont liées à des tickets existants : :categories',

        'priorities_success' => 'Priorités de tickets enregistrées avec succès.',
        'priorities_error' => 'Certaines priorités ne peuvent pas être supprimées car elles sont liées à des tickets existants : :priorities',
        'priorities_locked_error' => 'Certaines priorités ne peuvent pas être supprimées car elles sont verrouillées : :priorities',

        'statuses_success' => 'Statuts de tickets enregistrés avec succès.',
        'statuses_error' => 'Certains statuts ne peuvent pas être supprimés car ils sont liés à des tickets existants : :statuses',
        'statuses_locked_error' => 'Certains statuts ne peuvent pas être supprimés car ils sont verrouillés : :statuses',
        'statuses_default_error' => 'Il doit y avoir exactement un statut par défaut.',
        'statuses_closed_error' => 'Il doit y avoir exactement un statut de fermeture.',
    ],

    /*
    |--------------------------------------------------------------------------
    | Assignment
    |--------------------------------------------------------------------------
    */
    'assignment' => [
        'assigned_successfully' => 'Ticket assigné avec succès.',
        'assigned_successfully_count' => '{1} :count utilisateur assigné avec succès.|[2,*] :count utilisateurs assignés avec succès.',
        'already_assigned_count' => '{1} :count utilisateur était déjà assigné.|[2,*] :count utilisateurs étaient déjà assignés.',
        'cannot_be_assigned_count' => '{1} :count utilisateur ne peut pas recevoir de tickets.|[2,*] :count utilisateurs ne peuvent pas recevoir de tickets.',
        'all_already_assigned' => 'Tous les utilisateurs sélectionnés sont déjà assignés à ce ticket.',
        'all_cannot_be_assigned' => 'Aucun des utilisateurs sélectionnés ne peut recevoir de tickets.',
        'no_users_assigned' => 'Aucun utilisateur n\'a été assigné.',
        'no_users_selected' => 'Veuillez sélectionner au moins un utilisateur.',
        'self_assigned_successfully' => 'Vous avez été assigné à ce ticket.',
        'already_assigned' => 'Ce ticket est déjà assigné à cet utilisateur.',
        'user_cannot_be_assigned' => 'Cet utilisateur ne peut pas recevoir de tickets.',

        'page_title' => 'Assignation des Tickets',
        'page_description' => 'Gérez les tickets non assignés et attribuez-les en fonction de la priorité et de l\'urgence.',

        'dialog' => [
            'title' => 'Assigner le Ticket',
            'description' => 'Sélectionnez un utilisateur à assigner à ce ticket.',
            'search_label' => 'Rechercher un utilisateur',
            'search_placeholder' => 'Rechercher par nom ou email...',
            'no_users' => 'Aucun utilisateur trouvé.',
            'selected_count' => ':count sélectionné(s)',
        ],

        'stats' => [
            'total_unassigned' => 'Total Non Assignés',
            'total_unassigned_description' => 'Nombre total de tickets qui n\'ont pas encore été assignés à un utilisateur.',
            'critical_unassigned' => 'Priorité Critique',
            'high_unassigned' => 'Priorité Haute',
            'medium_unassigned' => 'Priorité Moyenne',
            'low_unassigned' => 'Priorité Basse',
            'oldest_unassigned' => 'Plus Ancien Non Assigné',
            'oldest_unassigned_description' => 'Nombre de jours depuis la création du plus ancien ticket non assigné.',
            'priority_description' => 'Nombre de tickets non assignés avec une priorité :priority.',
            'days' => 'jours',
            'total' => 'Total Tickets',
            'open' => 'Ouverts',
            'in_progress' => 'En Cours',
            'resolved' => 'Résolus',
            'avg_resolution' => 'Résolution Moy.',
            'assigned_to_me' => 'Assignés à Moi',
        ],

        'actions' => [
            'assign' => 'Assigner',
            'assign_short' => 'Assigner',
            'self_assign' => 'M\'assigner le ticket',
            'self_assign_short' => 'Moi',
            'select_user' => 'Sélectionner un utilisateur...',
        ],

        'table' => [
            'title' => 'Tickets Non Assignés',
            'empty' => 'Aucun ticket non assigné trouvé.',
            'empty_description' => 'Tous les tickets ont été assignés ou il n\'y a pas encore de tickets.',
            'columns' => [
                'id' => 'ID',
                'title' => 'Titre',
                'priority' => 'Priorité',
                'status' => 'Statut',
                'category' => 'Catégorie',
                'author' => 'Auteur',
                'created_at' => 'Créé le',
                'age' => 'Ancienneté',
                'actions' => 'Actions',
            ],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Statistics
    |--------------------------------------------------------------------------
    */
    'stats' => [
        'total' => 'Total Tickets',
        'open' => 'Ouverts',
        'unassigned' => 'Non Assignés',
        'resolved' => 'Fermés',
        'avg_resolution' => 'Résolution Moy.',
        'assigned_to_me' => 'Assignés à Moi',
        'days' => 'jours',

        'total_description' => 'Nombre total de tickets visibles selon vos permissions.',
        'open_description' => 'Tickets qui ne sont pas encore fermés ou sans statut.',
        'unassigned_description' => 'Tickets qui n\'ont pas encore été assignés. Ils nécessitent une attention particulière.',
        'resolved_description' => 'Tickets qui ont été fermés.',
        'avg_resolution_description' => 'Temps moyen (en jours) pour fermer un ticket depuis sa création.',
        'assigned_to_me_description' => 'Nombre de tickets actuellement assignés à vous (ouverts ou fermés).',
    ],

    /*
    |--------------------------------------------------------------------------
    | Global Actions & Labels
    |--------------------------------------------------------------------------
    */
    'search' => [
        'placeholder' => 'Rechercher des tickets...',
    ],
    'controller' => [
        'attachments_limit' => 'Vous ne pouvez pas avoir plus de 10 pièces jointes par ticket.',
    ],
    'filters' => [
        'status' => 'Statut',
        'priority' => 'Priorité',
        'assignee' => 'Assigné à',
        'equipment' => 'Équipement',
        'category' => 'Catégorie',
        'clear' => 'Effacer les filtres',
    ],
    'fields' => [
        'id' => 'ID',
        'title' => 'Titre',
        'status' => 'Statut',
        'priority' => 'Priorité',
        'author' => 'Auteur',
        'updated_at' => 'Mis à jour le',
    ],
    'status' => [
        'open' => 'Ouvert',
        'closed' => 'Fermé',
    ],
    'priority' => [
        'low' => 'Basse',
        'medium' => 'Moyenne',
        'high' => 'Haute',
    ],

    'archive' => [
        'message' => 'Ce ticket sera archivé. Vous pourrez le restaurer à tout moment.',
        'confirm' => 'Êtes-vous sûr de vouloir archiver ce ticket ?',
    ],
    'unarchive' => [
        'message' => 'Ce ticket sera restauré parmi les tickets actifs.',
        'confirm' => 'Êtes-vous sûr de vouloir désarchiver ce ticket ?',
    ],
    'delete' => [
        'message' => 'Ce ticket sera déplacé vers la corbeille. Vous pourrez le restaurer plus tard.',
        'confirm' => 'Êtes-vous sûr de vouloir supprimer ce ticket ?',
    ],
    'column' => [
        'title' => 'Titre',
        'description' => 'Description',
        'status' => 'Statut',
        'priority' => 'Priorité',
        'category' => 'Catégorie',
        'assignee' => 'Assigné à',
        'author' => 'Auteur',
        'archive_status' => 'Statut d\'archive',
        'updated_at' => 'Mis à jour',
        'created_at' => 'Créé le',
        'actions' => 'Actions',
    ],

    /*
    |--------------------------------------------------------------------------
    | Pages
    |--------------------------------------------------------------------------
    */
    'pages' => [
        'breadcrumbs' => [
            'index' => 'Tickets',
            'create' => 'Créer un ticket',
            'show' => 'Voir le ticket',
            'edit' => 'Modifier le ticket',
        ],
        'index' => [
            'head_title' => 'Tickets',
            'title' => 'Tous les Tickets',
            'description' => 'Visualisez, filtrez et gérez tous les tickets de support.',
            'toolbar' => [
                'search' => 'Rechercher des tickets...',
                'clear' => 'Effacer les filtres',
                'filters' => [
                    'title' => 'Filtres',
                    'status' => 'Statut',
                    'priority' => 'Priorité',
                    'category' => 'Catégorie',
                    'asset' => 'Asset',
                    'solver' => 'Assigné à',
                ],
                'selection' => [
                    'selected' => 'sélectionné(s)',
                    'no_results' => 'Aucun résultat trouvé.',
                ],
            ],
            'buttons' => [
                'create' => 'Créer un Ticket',
                'manage' => 'Gérer mes Tickets',
                'archived' => 'Tickets Archivés',
            ],

            'empty' => [
                'title' => 'Aucun ticket trouvé',
                'description' => 'Aucun ticket ne correspond à vos filtres ou critères de recherche actuels.',
                'button' => 'Effacer les filtres',
            ],
        ],
        'manage' => [
            'head_title' => 'Mes Tickets',
            'title' => 'Mes Tickets',
            'description' => 'Consultez les tickets que vous avez créés ou qui vous sont assignés.',
        ],
        'archived' => [
            'head_title' => 'Tickets Archivés',
            'title' => 'Tickets Archivés',
            'description' => 'Visualisez et gérez les tickets archivés.',
            'list_title' => 'Tickets Archivés',
            'back_to_active' => 'Retour aux Tickets Actifs',
            'stats' => [
                'total' => 'Total Archivés',
                'resolved' => 'Résolus',
                'avg_days' => 'Jours moy. avant archive',
                'last_30_days' => 'Archivés (30 derniers jours)',
                'total_description' => 'Nombre total de tickets archivés visibles selon vos permissions.',
                'resolved_description' => 'Nombre de tickets archivés qui étaient fermés/résolus avant l\'archivage.',
                'avg_days_description' => 'Temps moyen (en jours) entre la création du ticket et son archivage.',
                'last_30_days_description' => 'Nombre de tickets archivés au cours des 30 derniers jours.',
            ],
        ],
        'create' => [
            'head_title' => 'Créer un Ticket',
            'title' => 'Créer un Nouveau Ticket',
            'description' => 'Remplissez le formulaire ci-dessous pour créer un nouveau ticket.',
            'validation_error' => [
                'title' => 'Erreur de Validation',
                'description' => 'Veuillez corriger les erreurs listées ci-dessous avant d\'enregistrer.'
            ],
            'assign' => [
                'title' => 'Assigner le Ticket',
                'description' => 'Sélectionnez les utilisateurs à assigner à ce ticket.',
                'cancel' => 'Annuler',
                'assign_to_me' => 'M\'assigner',
                'add_users' => 'Ajouter un utilisateur'
            ],
        ],
        'form' => [
            'knowledge_base' => [
                'title' => 'Base de connaissances (IA)',
                'description' => 'Marquer comme référence pour améliorer les suggestions automatisées.',
                'status_on' => 'Référencé',
                'status_off' => 'Non référencé',
            ],
            'buttons' => [
                'back' => 'Retour aux tickets',
                'store' => 'Enregistrer le Ticket',
                'update' => 'Mettre à jour le Ticket',
                'delete' => 'Supprimer le Ticket',
                'archive' => 'Archiver le Ticket',
                'unarchive' => 'Désarchiver le Ticket',
                'edit' => 'Modifier le Ticket',
                'back_to_ticket' => 'Retour au Ticket',
                'add' => 'Ajouter un assigné'
            ],
            'tabs' => [
                'informations' => 'Informations',
                'assignees' => 'Responsables',
            ],
            'fields' => [
                'archived_label' => 'Ticket Archivé',
                'active_label' => 'Ticket Actif',
            ],
            'placeholders' => [
                'title' => 'ex: Le serveur ne répond pas',
                'description' => 'Décrivez le problème...',
                'select_priority' => 'Sélectionner la priorité',
                'select_status' => 'Sélectionner le statut',
                'select_category' => 'Sélectionner la catégorie',
                'select_asset' => 'Sélectionner l\'Asset',
            ],
            'users_tab' => [
                'description' => 'Gérez les personnes assignées à ce ticket.',
                'add_button' => 'Ajouter',
                'me_badge' => 'Moi',
                'notifications' => [
                    'added' => 'Assigné ajouté avec succès.',
                    'removed' => 'Assigné retiré avec succès.',
                    'assigned_to_self' => 'Ticket assigné à vous-même.',
                    'last_assignee_removed' => 'Vous vous êtes désassigné de ce ticket.',
                    'admins_notified' => 'Le ticket est maintenant non assigné. Les administrateurs seront notifiés.',
                ],
                'table' => [
                    'assignee' => 'Assigné à',
                    'role' => 'Rôle',
                ],
            ],
            'editor' => [
                'label' => 'Éditeur Markdown',
                'placeholder' => "# Solution Technique...\n\nDécrivez les étapes de résolution.",
                'markdown_active' => 'Markdown supporté',
                'mode_zen' => 'Mode Zen',
                'preview' => 'Aperçu',
                'empty_preview' => 'L\'aperçu apparaîtra ici...',
                'actions' => [
                    'fullscreen' => 'Plein écran',
                    'exit' => 'Quitter',
                ],
                'formatting' => [
                    'bold' => 'Gras',
                    'italic' => 'Italique',
                    'strike' => 'Barré',
                    'h1' => 'Titre 1',
                    'h2' => 'Titre 2',
                    'list' => 'Liste à puces',
                    'ordered_list' => 'Liste ordonnée',
                    'link' => 'Lien',
                    'image' => 'Image',
                    'table' => 'Tableau',
                    'code' => 'Bloc de code',
                    'quote' => 'Citation',
                    'separator' => 'Séparateur',
                ],
            ],
        ],
        'edit' => [
            'title' => 'Modifier le Ticket',
            'description' => 'Mettez à jour les détails et les assignations du ticket.',
            'attachments' => [
                'title' => 'Pièces Jointes',
                'existing_attachments' => 'Pièces jointes existantes',
                'dialog' => [
                    'title' => 'Supprimer la pièce jointe ?',
                    'description' => 'Êtes-vous sûr de vouloir supprimer cette pièce jointe ? Cette action est irréversible.',
                    'cancel' => 'Non',
                    'confirm' => 'Oui, supprimer',
                ],
                'delete_button' => 'Supprimer',
                'view_or_download' => 'Voir ou télécharger'
            ],
        ],
        'delete' => [
            'title' => 'Êtes-vous sûr de vouloir archiver ce ticket ?',
            'description' => 'Cela archivera définitivement le ticket intitulé \':title\'.',
            'buttons' => [
                'cancel' => 'Annuler',
                'confirm' => 'Oui, archiver le ticket',
            ],
        ],
        'show' => [
            'head_title' => 'Ticket',
            'description' => 'Consultez les détails, l\'historique, le planning et les journaux du ticket.',
            'actions' => [
                'pdf' => 'Exporter en PDF',
            ],
            'tabs' => [
                'info' => 'Info',
                'comments' => 'Historique des échanges',
                'calendar' => 'Calendrier',
                'logs' => 'Journaux',
                'info_content' => [
                    'description' => 'Description',
                    'assignees' => 'Assignés à',
                    'no_assignees' => 'Aucun assigné.',
                    'details' => 'Détails',
                    'users' => 'Utilisateurs',
                    'attachments' => 'Pièces Jointes',
                    'no_attachments' => 'Aucune pièce jointe disponible.',
                    'no_desc' => 'Aucune description disponible.',
                    'properties' => 'Propriétés',
                    'history' => 'Historique',
                    'created' => 'Créé le',
                    'updated' => 'Mis à jour le',
                ],
                'logs_content' => [
                    'empty' => 'Aucun historique disponible.',
                    'search_placeholder' => 'Rechercher dans l\'historique...',
                    'no_results' => 'Aucun résultat trouvé pour votre recherche.',
                    'old_value' => 'Ancienne valeur',
                    'new_value' => 'Nouvelle valeur',
                    'empty_value' => 'vide',
                    'pagination_info' => 'Page :current sur :total (:count journaux)',
                    'actions' => [
                        'created' => 'a créé le ticket',
                        'updated' => 'a modifié',
                        'commented' => 'a ajouté un commentaire',
                        'comment_deleted' => 'a supprimé un commentaire',
                        'time_logged' => 'a enregistré du temps',
                        'scheduled' => 'a planifié une intervention',
                        'priority_changed' => 'a changé la priorité',
                        'schedule_updated' => 'a modifié le planning',
                        'assigned' => 'a assigné le ticket',
                        'unassigned' => 'a retiré un assigné',
                    ],
                ],
            ],
            'knowledge_base' => [
                'title' => 'Solution de Référence',
                'badge' => 'Base de connaissances',
                'footer' => 'Validé par l\'équipe technique',
                'verified' => 'Vérifié',
                'collapse' => 'Voir moins',
                'expand' => 'Voir plus',
            ],
            'comments' => [
                'image_modal' => [
                    'title' => 'Aperçu de l\'image',
                    'alt' => 'Aperçu complet de l\'image',
                ],
                'editor' => [
                    'drop_files' => 'Déposez vos fichiers ici',
                    'placeholder' => 'Écrire un commentaire... (Markdown supporté)',
                    'placeholder_edit' => 'Modifier votre commentaire...',
                    'attach_files' => 'Joindre des fichiers',
                    'esc_to_cancel' => 'Échap pour annuler',
                    'save' => 'Enregistrer',
                    'submit' => 'Commenter',
                    'edit_mode' => 'Mode édition',
                    'cancel_edit' => 'Annuler l\'édition',
                    'formatting' => [
                        'bold' => 'Gras',
                        'italic' => 'Italique',
                        'code' => 'Code',
                        'quote' => 'Citation',
                        'link' => 'Lien',
                        'list' => 'Liste',
                        'ordered_list' => 'Liste ordonnée',
                    ],
                ],
                'empty_title' => 'Aucun commentaire',
                'empty_description' => 'Commencez la discussion ici.',
                'new_messages' => 'Nouveaux messages',
                'actions' => [
                    'edit' => 'Modifier',
                    'delete' => 'Supprimer',
                    'cancel' => 'Annuler',
                ],
                'delete_modal' => [
                    'title' => 'Supprimer le commentaire ?',
                    'description' => 'Êtes-vous sûr de vouloir supprimer ce commentaire ? Cette action est irréversible.',
                    'cancel' => 'No',
                    'confirm' => 'Oui, supprimer',
                ],
                'notifications' => [
                    'deleted' => 'Commentaire supprimé',
                    'attachment_deleted' => 'Fichier supprimé',
                    'sent' => 'Commentaire envoyé avec succès',
                    'updated' => 'Commentaire mis à jour avec succès',
                    'error' => 'Une erreur est survenue',
                ],
            ],
            'calendar' => [
                'edit_mode' => 'Modifier',
                'views' => [
                    'day' => 'Jour',
                    'week' => 'Semaine',
                    'month' => 'Mois',
                ],
                'notifications' => [
                    'scheduled' => 'Planifié avec succès',
                    'moved' => 'Déplacé avec succès',
                    'updated' => 'Événement mis à jour',
                    'deleted' => 'Retiré du planning',
                ],
            ],
        ],
        'relations' => [
            'categories' => [
                'validation' => [
                    'title_required' => 'Le titre est obligatoire.',
                    'color_required' => 'La couleur est obligatoire.',
                ],
                'dialog' => [
                    'create_title' => 'Créer une Catégorie',
                    'edit_title' => 'Modifier la Catégorie',
                    'delete_title' => 'Supprimer la Catégorie',

                    'create_description' => 'Remplissez le formulaire ci-dessous pour créer une nouvelle catégorie.',
                    'edit_description' => 'Mettez à jour les détails de la catégorie ci-dessous.',
                    'delete_description' => 'Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible.',

                    'form' => [
                        'title_label' => 'Titre',
                        'title_placeholder' => 'ex: Problème Réseau',
                        'description_label' => 'Description',
                        'description_placeholder' => 'Une brève description de la catégorie.',
                        'icon_label' => 'Icône',
                        'color_label' => 'Couleur',
                        'buttons' => [
                            'close' => 'Fermer',
                            'cancel' => 'Annuler',
                            'update' => 'Modifier la Catégorie',
                            'store' => 'Enregistrer la Catégorie',
                            'delete' => 'Oui, supprimer la catégorie',
                        ],
                    ],
                ],
                'sheet' => [
                    'title' => 'Gérer les catégories',
                    'description' => 'Créez, modifiez et supprimez les catégories pour organiser efficacement vos tickets.',

                    'table' => [
                        'column' => 'Catégorie',
                        'empty' => 'Aucune catégorie trouvée.',
                    ],

                    'buttons' => [
                        'create' => 'Créer une Catégorie',
                        'close' => 'Fermer',
                        'save' => 'Enregistrer les modifications',
                    ]
                ],
            ],
            'priorities' => [
                'validation' => [
                    'title_required' => 'Le titre est obligatoire.',
                    'color_required' => 'La couleur est obligatoire.',
                ],
                'dialog' => [
                    'create_title' => 'Créer une Priorité',
                    'edit_title' => 'Modifier la Priorité',
                    'delete_title' => 'Supprimer la Priorité',

                    'create_description' => 'Remplissez le formulaire ci-dessous pour créer une nouvelle priorité.',
                    'edit_description' => 'Mettez à jour les détails de la priorité ci-dessous.',
                    'delete_description' => 'Êtes-vous sûr de vouloir supprimer cette priorité ? Cette action est irréversible.',

                    'form' => [
                        'title_label' => 'Titre',
                        'title_placeholder' => 'ex: Haute, Moyenne, Basse',
                        'description_label' => 'Description',
                        'description_placeholder' => 'Une brève description de la priorité.',
                        'color_label' => 'Couleur',
                        'buttons' => [
                            'close' => 'Fermer',
                            'cancel' => 'Annuler',
                            'update' => 'Modifier la Priorité',
                            'store' => 'Enregistrer la Priorité',
                            'delete' => 'Oui, supprimer la priorité',
                        ],
                    ],
                ],
                'sheet' => [
                    'title' => 'Gérer les priorités',
                    'description' => 'Créez, modifiez et supprimez les priorités pour organiser efficacement vos tickets.',

                    'table' => [
                        'column' => 'Priorité',
                        'empty' => 'Aucune priorité trouvée.',
                    ],

                    'buttons' => [
                        'create' => 'Créer une Priorité',
                        'close' => 'Fermer',
                        'save' => 'Enregistrer les modifications',
                    ]
                ],
            ],
            'statuses' => [
                'validation' => [
                    'title_required' => 'Le titre est obligatoire.',
                    'color_required' => 'La couleur est obligatoire.',
                ],
                'dialog' => [
                    'create_title' => 'Créer un Statut',
                    'edit_title' => 'Modifier le Statut',
                    'delete_title' => 'Supprimer le Statut',

                    'create_description' => 'Remplissez le formulaire ci-dessous pour créer un nouveau statut.',
                    'edit_description' => 'Mettez à jour les détails du statut ci-dessous.',
                    'delete_description' => 'Êtes-vous sûr de vouloir supprimer ce statut ? Cette action est irréversible.',

                    'form' => [
                        'title_label' => 'Titre',
                        'title_placeholder' => 'ex: À faire, En cours, Terminé',
                        'description_label' => 'Description',
                        'description_placeholder' => 'Une brève description du statut.',

                        'default_label' => 'Par défaut',
                        'default_placeholder' => 'Définir comme statut par défaut pour les nouveaux tickets',
                        'default_yes' => 'Oui',
                        'default_no' => 'Non',

                        'closed_label' => 'Fermé',
                        'closed_placeholder' => 'Marquer les tickets avec ce statut comme fermés',
                        'closed_yes' => 'Oui',
                        'closed_no' => 'Non',

                        'color_label' => 'Couleur',
                        'buttons' => [
                            'close' => 'Fermer',
                            'cancel' => 'Annuler',
                            'update' => 'Modifier le Statut',
                            'store' => 'Enregistrer le Statut',
                            'delete' => 'Oui, supprimer le statut',
                        ],
                    ],
                ],
                'sheet' => [
                    'title' => 'Gérer les statuts',
                    'description' => 'Créez, modifiez et supprimez les statuts pour organiser efficacement vos tickets.',

                    'table' => [
                        'column' => 'Statut',
                        'default' => 'Par défaut',
                        'closed' => 'Fermé',
                        'empty' => 'Aucun statut trouvé.',
                    ],

                    'buttons' => [
                        'create' => 'Créer un Statut',
                        'close' => 'Fermer',
                        'save' => 'Enregistrer les modifications',
                    ]
                ],
            ],
        ],
    ],
    'generated_by' => 'Généré par',
    'on' => 'le',
    'document_footer' => 'Document généré par Ticketack.',
    'pagination' => [
        'showing' => 'Affichage de',
        'of' => 'sur',
        'results' => 'résultats',
        'to' => 'à'
    ],

    /*
    |--------------------------------------------------------------------------
    | PDF Export
    |--------------------------------------------------------------------------
    */
    'pdf' => [
        'document_title' => 'Rapport de Ticket',
        'generated_on' => 'Généré le',
        'by' => 'par',
        'assignees' => 'Assignés à',
        'name' => 'Nom',
        'email' => 'Email',
        'solution' => 'Solution',
        'resolved' => 'Résolu',
        'no_description' => 'Aucune description fournie.',
        'no_comments' => 'Aucun commentaire pour le moment.',
        'anonymous' => 'Anonyme',
        'created_at' => 'Créé le',
        'updated_at' => 'Dernière mise à jour',
        'footer_text' => 'Document généré par',
    ],
    'ai_assistant_title' => 'Assistant IA',
    'ai_summary' => 'Résumé',
    'ai_steps' => 'Étapes Suggérées',
    'btn_accept' => 'Accepter la Solution',
    'btn_reject' => 'Refuser',
    'confirm_modal_title' => 'Valider la Solution',
    'confirm_modal_body' => 'Êtes-vous sûr que cette solution est valide ?',
    'ai_solution_copied' => 'Solution copiée dans le presse-papier',
    'ai_suggestion_accepted_header' => 'Solution IA :',
    'btn_refine' => 'Affiner',
    'ai_refine_label' => 'Précisez votre demande ou corrigez l\'IA',
    'ai_refine_placeholder' => 'Ex: Peux-tu détailler l\'étape 2 ? / L\'erreur est plus simple...',
    'ai_refine_submit' => 'Générer nouvelle solution',
    'ai_thinking_title' => 'L\'IA réfléchit...',
    'ai_analysis' => 'Analyse Technique',
    'ai_missing_info' => 'Informations Manquantes',
];
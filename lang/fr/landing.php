<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Flash messages
    |--------------------------------------------------------------------------
    |
    */

    /*
    |--------------------------------------------------------------------------
    | Pages content
    |--------------------------------------------------------------------------
    |
    */

    'pages' => [
        'title' => "Page d'accueil",

        'buttons' => [
            'dashboard' => 'Tableau de bord',
            'home'=> 'Accueil',
            'login' => 'Se connecter',
            'register' => "S'inscrire",
            'company' => 'Voir plus',
        ],
        'title' => 'Bienvenue sur Ticketack',
        'description' => '',
        'breakout'=> [
            'companyTitle' =>'Imaginé par ID Ingénierie',
            'companyDescription' =>'Spécialiste en développement logiciel sur mesure et en technologies web et mobiles.',
            'teamTitle' => 'Développé par Thyltech',
            'teamDescription' =>"Équipe française d'élèves-ingénieurs de Centrale Lille IG2I"
        ],
        'achievementsTitle' => "Fonctionnalités de Ticketack",
        'achievementsDescription' => 'Ticketack vous permet de centraliser et de simplifier le suivi de tous vos problèmes techniques. Cet outil réduit les difficultés de suivi, la perte d\'information et le manque de visibilité causées par les problèmes rapportés par e-mail.',
        'achievements' => [
            '1' => [
                'label' => 'Gestion des tickets',
                'value' => 'Créer des tickets pour reporter des anomalies, proposer des améliorations, obtenir de l\'aide du support, ou planifier les interventions de maintenance.',
            ],
            '2' => [
                'label' => 'Résolution de tickets',
                'value' => 'Planifier et suivre le temps passé sur la résolution de tickets.',
            ],
            '3' => [
                'label' => 'Gestion des assets',
                'value' => 'Lister et gérer vos assets avec une vue hiérarchique.',
            ],
            '4' => [
                'label' => "Planning d'interventions",
                'value' => 'Les résolveurs peuvent voir et planifier les interventions pour la résolution de tickets.',
            ],
        ],
    ],

];
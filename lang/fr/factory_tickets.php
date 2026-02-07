<?php

return [
    'scenarios' => [
        'server' => [
            ['title' => 'Utilisation CPU élevée en production', 'description' => 'Le serveur web principal affiche une utilisation du CPU de 90 % depuis plus d\'une heure. Nécessite une investigation.'],
            ['title' => 'Expiration du certificat SSL', 'description' => 'Le certificat SSL pour l\'API interne expirera dans 3 jours. Veuillez le renouveler.'],
            ['title' => 'Espace disque insuffisant', 'description' => 'La partition /var/log est pleine à 95 %. Les anciens logs pourraient nécessiter une rotation ou une suppression.'],
        ],
        'laptop' => [
            ['title' => 'Écran cassé', 'description' => 'L\'utilisateur a fait tomber l\'ordinateur portable et l\'écran scintille ou est totalement noir.'],
            ['title' => 'Liquide renversé sur le clavier', 'description' => 'Du café a été renversé sur le clavier. Certaines touches ne répondent plus.'],
            ['title' => 'La batterie ne charge pas', 'description' => 'L\'appareil ne fonctionne que lorsqu\'il est branché. L\'état de la batterie reste à 0 %.'],
        ],
        'router' => [
            ['title' => 'Perte de signal Wi-Fi', 'description' => 'Les utilisateurs de l\'aile Sud signalent des déconnexions fréquentes du Wi-Fi du bureau.'],
            ['title' => 'Accès VPN hors service', 'description' => 'Le tunnel pour les travailleurs à distance ne s\'établit pas. Erreur 403 lors de la connexion.'],
        ],
        'wrench' => [
            ['title' => 'Imprimante en panne', 'description' => 'L\'imprimante n\'imprime pas.'],
            ['title' => 'Remplacement d\'encre requis', 'description' => 'L\'imprimante est à court d\'encre.'],
            ['title' => 'Imprimante à remplacer', 'description' => 'L\'imprimante n\'est plus fonctionnelle.'],
        ],
        'cube' => [
            ['title' => 'Lenteur du module virtuel', 'description' => 'Le module virtuel subit une latence élevée.'],
            ['title' => 'Échec du démarrage du module virtuel', 'description' => 'Le module virtuel ne démarre pas.'],
            ['title' => 'Module virtuel ne répond pas', 'description' => 'Le module virtuel ne répond pas.'],
        ],
        'box' => [
            ['title' => 'Surchauffe du boîtier réseau', 'description' => 'Le boîtier réseau surchauffe et cause des problèmes de connectivité intermittents.'],
            ['title' => 'Mise à jour du firmware du boîtier réseau', 'description' => 'Une mise à jour critique du firmware est disponible pour le boîtier réseau.'],
            ['title' => 'Panne d\'alimentation du boîtier réseau', 'description' => 'Le boîtier réseau n\'est plus alimenté et doit être redémarré.'],
        ],
    ],
    'generic' => [
        ['title' => 'Demande de maintenance générale', 'description' => 'Vérification standard requise pour cet asset afin d\'assurer des performances optimales.'],
        ['title' => 'Installation de logiciel nécessaire', 'description' => 'Demande d\'installation de logiciels nécessaires sur l\'asset.'],
        ['title' => 'Problèmes de performance signalés', 'description' => 'L\'utilisateur signale que l\'asset fonctionne plus lentement que d\'habitude.'],
    ]
];
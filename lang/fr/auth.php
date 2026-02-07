<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Flash messages
    |--------------------------------------------------------------------------
    |
    */
    'flash' => [

        'login' => [
            'invalid_credentials' => 'Les identifiants de connexion fournis sont incorrects.',
            'success' => 'Connexion réussie.',
        ],

        'logout' => [
            'success' => 'Déconnexion réussie.',
        ],

        'register' => [
            'success' => 'Inscription réussie !',
        ],

        'password' => [
            'reset_link_sent' => 'Un lien de réinitialisation vous sera envoyé si le compte existe.',
            'user_not_found' => 'Utilisateur non trouvé.',
            'token_missing' => 'Le token n\'existe pas.',
            'token_expired' => 'Token expiré.',
            'token_mismatch' => 'Le token ne correspond pas.',
            'reset_success' => 'Réinitialisation du mot de passe réussie !',
        ],

        'verification' => [
            'link_sent' => 'Un lien de vérification a été envoyé à votre adresse e-mail.',
            'invalid_token' => 'Token de vérification invalide.',
            'verified_success' => 'Adresse e-mail vérifié avec succès.',
        ],

        'middleware' => [
            'auth_required' => 'Vous devez être connecté pour accéder à cette ressource.',
            'guest_only' => 'Vous êtes déjà connecté.',
            'verified_required' => 'Vous devez vérifier votre e-mail pour accéder à cette ressource.',
        ],

        'email' => [
            'no_change' => 'La nouvelle adresse e-mail est la même que l\'actuelle.',
            'change' => 'Adresse e-mail mise à jour avec succès !',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Pages content
    |--------------------------------------------------------------------------
    |
    */

    'layout' => [
        'description' => 'Une brève description de l\'application.',
    ],

    'pages' => [

        'login' => [
            'header' => 'Se connecter',
            'title' => 'Connectez-vous à votre compte',
            'description' => 'Veuillez entrer vos identifiants pour accéder à votre compte.',
            'email_label' => 'Adresse e-mail',
            'password_label' => 'Mot de passe',
            'password_placeholder' => 'Entrez votre mot de passe',
            'remember_label' => 'Se souvenir de moi',
            'forgot_password' => 'Mot de passe oublié ?',
            'submit_button' => 'Se connecter',
            'home_link' => 'Aller à la page d\'accueil',
            'register_link' => "Créer un compte",
            'register_link_text' => 'S\'inscrire',
        ],

        'change_email' => [
            'header' => 'Modifier l\'e-mail',
            'title' => 'Modifier l\'adresse e-mail',
            'description' => 'Mettez à jour votre adresse e-mail pour garder votre compte sécurisé ou si celle actuelle n\'est plus accessible.',
            'email_label' => 'Adresse e-mail',
            'password_label' => 'Mot de passe',
            'password_placeholder' => 'Mot de passe',
            'submit_button' => 'Modifier l\'adresse e-mail',
            'verify_button' => 'vérifier l\'adresse e-mail',
            'logout_link' => 'Se déconnecter',
        ],

        'email_verified' => [
            'header' => 'E-mail vérifié',
            'title' => 'E-mail vérifié!',
            'description' => 'Votre adresse e-mail a été vérifiée avec succès.',
            'login_button' => 'Se connecter',
            'home_button' => 'Acceuil',
        ],

        'forgot_password' => [
            'header' => 'Mot de passe oublié',
            'title' => 'Mot de passe oublié!',
            'description' => 'Entrez votre e-mail pour recevoir un lien de réinitialisation de mot de passe.',
            'email_label' => 'Adresse e-mail',
            'submit_button' => 'Envoyer le lien de réinitialisation',
            'return_text' => 'Ou, retour à',
            'login_link' => 'Se connecter',
        ],

        'register' => [
            'header' => 'S\'inscrire',
            'title' => 'Créer un compte',
            'description' => 'Ecrire les détails en dessous pour créer votre compte',
            'name_label' => 'Nom',
            'name_placeholder' => 'Nom complet',
            'email_label' => 'Adresse e-mail',
            'password_label' => 'Mot de passe',
            'password_placeholder' => 'Mot de passe',
            'password_confirm_label' => 'Confirmer le mot de passe',
            'password_confirm_placeholder' => 'Confirmer le mot de passe',
            'submit_button' => 'Créer le compte',
            'already_text' => 'Déjà un compte',
            'login_link' => 'Se connecter',
        ],

        'reset_password' => [
            'header' => 'réinitialiser votre mot de passe',
            'title' => 'réinitialiser votre mot de passe',
            'description' => 'Veuillez entrer votre nouveau mot de passe',
            'email_label' => 'E-mail',
            'password_label' => 'Mot de passe',
            'password_placeholder' => 'Mot de passe',
            'password_confirm_label' => 'Confirmer le mot de passe',
            'password_confirm_placeholder' => 'Confirmer le mot de passe',
            'submit_button' => 'Mettre à jour le mot de passe',
            'return_text' => 'Ou retourner à',
            'login_link' => 'Se connecter',
        ],

        'verify_email' => [
            'header' => 'Vérification de l\'adresse e-mail',
            'title' => 'Vérifier votre adresse e-mail',
            'description' => 'Veuillez cliquer sur le bouton ci-dessous pour recevoir un mail permettant de vérifier votre adresse e-mail.',
            'email_label' => 'Adresse e-mail',
            'submit_button' => 'Envoyer un e-mail de vérification',
            'change_email_button' => 'Changer votre adresse e-mail',
            'logout_link' => 'Se déconnecter',
        ],

    ],

];

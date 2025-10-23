<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Mail Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines are used during mail sending for various
    | messages that we need to display to the user. You are free to modify
    | these language lines according to your application's requirements.
    |
    */

    'greeting' => 'Hello :name,',
    'thanks' => 'Thanks for your trust,',
    'team' => 'The :app Team',

    'password_reset' => [
        'subject' => ':app — Reset your password',
        'title' => 'Reset your password',
        'intro' => 'You requested a password reset. Click the button below.',
        'expires' => 'This link will expire in 60 minutes.',
        'button' => 'Reset my password',
        'ignore' => 'If you did not request this, please ignore this email.',
    ],

    'registered' => [
        'subject' => ':app — Welcome!',
        'title' => 'Welcome to :app!',
        'intro' => 'Your account has been successfully created on :app. We’re glad to have you on board.',
        'button' => 'Log in to my account',
        'body' => 'You can now log in and start using all features of the platform.',
    ],

    'verify_email' => [
        'subject' => ':app — Verify your email address',
        'title' => 'Verify your email address',
        'intro' => 'Thanks for signing up on :app. To complete your registration, please verify your email address by clicking the button below.',
        'button' => 'Verify my email address',
        'ignore' => 'If you did not create an account on :app, please ignore this email.',
    ],
];

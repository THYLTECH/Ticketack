<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Authentication Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines are used during authentication for various
    | messages that we need to display to the user. You are free to modify
    | these language lines according to your application's requirements.
    |
    */

    'login' => [
        'invalid_credentials' => 'The provided credentials are incorrect.',
        'success' => 'Logged in successfully.',
    ],

    'logout' => [
        'success' => 'Logged out successfully.',
    ],

    'register' => [
        'success' => 'Registered successfully!',
    ],

    'password' => [
        'reset_link_sent' => 'A reset link will be sent if the account exists.',
        'user_not_found' => 'User not found.',
        'token_missing' => 'Token does not exist.',
        'token_expired' => 'Token expired.',
        'token_mismatch' => 'Token does not match.',
        'reset_success' => 'Password reset successfully!',
    ],

    'verification' => [
        'link_sent' => 'A new verification link has been sent to the email address you provided during registration.',
        'invalid_token' => 'Invalid verification token.',
        'verified_success' => 'Email verified successfully.',
    ],

    'middleware' => [
        'auth_required' => 'You must be logged in to access this resource.',
        'guest_only' => 'You are already logged in.',
        'verified_required' => 'You must verify your email to access this resource.',
    ],

];

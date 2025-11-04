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
            'link_sent' => 'A verification link has been sent to your email address.',
            'invalid_token' => 'Invalid verification token.',
            'verified_success' => 'Email verified successfully.',
        ],

        'middleware' => [
            'auth_required' => 'You must be logged in to access this resource.',
            'guest_only' => 'You are already logged in.',
            'verified_required' => 'You must verify your email to access this resource.',
        ],

        'email' => [
            'no_change' => 'The new email address is the same as the current one.',
            'change' => 'Email address successfully updated!',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Pages content
    |--------------------------------------------------------------------------
    |
    */

    'pages' => [

        'login' => [
            'header' => 'Log in',
            'title' => 'Login to your account',
            'description' => 'Enter your email and password below to log in',
            'email_label' => 'Email Address',
            'password_label' => 'Password',
            'remember_label' => 'Remember me',
            'forgot_password' => 'Forgot your password?',
            'submit_button' => 'Log in',
            'home_link' => 'Go to homepage',
            'register_link' => "Don't have an account?",
            'register_link_text' => 'Sign up',
        ],
    ],

];

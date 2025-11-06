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

    'layout' => [
        'description' => 'A brief description of the application.'
    ],

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

        'change_email' => [
            'header' => 'Change email',
            'title' => 'Change your email address',
            'description' => 'Update your email address to keep your account secure or if your current one is invalid.',
            'email_label' => 'Email Address',
            'password_label' => 'Password',
            'password_placeholder' => 'Password',
            'submit_button' => 'Change email address',
            'verify_button' => 'Verify email address',
            'logout_link' => 'Log out',
        ],

        'email_verified' => [
            'header' => 'Email verified',
            'title' => 'Email verified!',
            'description' => 'Your email address has been successfully verified.',
            'login_button' => 'Log in',
            'home_button' => 'Go to homepage',
        ],

        'forgot_password' => [
            'header' => 'Forgot password',
            'title' => 'Forgot password',
            'description' => 'Enter your email to receive a password reset link.',
            'email_label' => 'Email address',
            'submit_button' => 'Send reset link',
            'return_text' => 'Or, return to',
            'login_link' => 'log in',
        ],

        'register' => [
            'header' => 'Register',
            'title' => 'Create an account',
            'description' => 'Enter your details below to create your account.',
            'name_label' => 'Name',
            'name_placeholder' => 'Full name',
            'email_label' => 'Email address',
            'password_label' => 'Password',
            'password_placeholder' => 'Password',
            'password_confirm_label' => 'Confirm password',
            'password_confirm_placeholder' => 'Confirm password',
            'submit_button' => 'Create account',
            'already_text' => 'Already have an account?',
            'login_link' => 'Log in',
        ],

        'reset_password' => [
            'header' => 'Reset password',
            'title' => 'Reset password',
            'description' => 'Please enter your new password below.',
            'email_label' => 'Email',
            'password_label' => 'Password',
            'password_placeholder' => 'Password',
            'password_confirm_label' => 'Confirm password',
            'password_confirm_placeholder' => 'Confirm password',
            'submit_button' => 'Reset password',
            'return_text' => 'Or, return to',
            'login_link' => 'log in',
        ],

        'verify_email' => [
            'header' => 'Email verification',
            'title' => 'Verify your email address',
            'description' => 'Please click on the button below to receive an email to verify your email address.',
            'email_label' => 'Email address',
            'submit_button' => 'Send verification email',
            'change_email_button' => 'Change email address',
            'logout_link' => 'Log out',
        ],

    ],

];

<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Locals & Timezones
    |--------------------------------------------------------------------------
    |
    */

    // Returns +400 timezones, too many for a simple select
    // $timezones = DateTimeZone::listIdentifiers();

    'languages' => [
        ['code' => 'en', 'name' => 'English'],
        ['code' => 'fr', 'name' => 'Français'],
        ['code' => 'de', 'name' => 'Deutsch'],
    ],

    'timezones' => [
        ['value' => 'UTC', 'utc' => '±00:00'],
        ['value' => 'Europe/London', 'utc' => '+00:00'],
        ['value' => 'Europe/Paris', 'utc' => '+01:00'],
        ['value' => 'Europe/Berlin', 'utc' => '+01:00'],
        ['value' => 'Europe/Madrid', 'utc' => '+01:00'],
        ['value' => 'Europe/Rome', 'utc' => '+01:00'],
        ['value' => 'Europe/Athens', 'utc' => '+02:00'],
        ['value' => 'Europe/Moscow', 'utc' => '+03:00'],
        ['value' => 'Africa/Cairo', 'utc' => '+02:00'],
        ['value' => 'Africa/Casablanca', 'utc' => '+01:00'],
        ['value' => 'Africa/Johannesburg', 'utc' => '+02:00'],
        ['value' => 'America/New_York', 'utc' => '-05:00'],
        ['value' => 'America/Chicago', 'utc' => '-06:00'],
        ['value' => 'America/Denver', 'utc' => '-07:00'],
        ['value' => 'America/Los_Angeles', 'utc' => '-08:00'],
        ['value' => 'America/Sao_Paulo', 'utc' => '-03:00'],
        ['value' => 'America/Mexico_City', 'utc' => '-06:00'],
        ['value' => 'America/Toronto', 'utc' => '-05:00'],
        ['value' => 'Asia/Dubai', 'utc' => '+04:00'],
        ['value' => 'Asia/Kolkata', 'utc' => '+05:30'],
        ['value' => 'Asia/Singapore', 'utc' => '+08:00'],
        ['value' => 'Asia/Hong_Kong', 'utc' => '+08:00'],
        ['value' => 'Asia/Tokyo', 'utc' => '+09:00'],
        ['value' => 'Asia/Seoul', 'utc' => '+09:00'],
        ['value' => 'Asia/Shanghai', 'utc' => '+08:00'],
        ['value' => 'Australia/Sydney', 'utc' => '+10:00'],
        ['value' => 'Pacific/Auckland', 'utc' => '+12:00'],
    ],

    /*
    |--------------------------------------------------------------------------
    | Themes & Colors
    |--------------------------------------------------------------------------
    |
    */

    'themes' => [
        ['value' => 'light'],
        ['value' => 'dark'],
        ['value' => 'system'],
    ],

    'colors' => [
        ['value' => 'default', 'color' => 'oklch(0.205 0 0)'],
        ['value' => 'blue', 'color' => 'oklch(0.488 0.243 264.376)'],
        ['value' => 'red', 'color' => 'oklch(0.577 0.245 27.325)'],
        ['value' => 'green', 'color' => 'oklch(0.648 0.2 131.684)'],
        ['value' => 'orange', 'color' => 'oklch(0.646 0.222 41.116)'],
        ['value' => 'rose', 'color' => 'oklch(0.586 0.253 17.585)'],
        ['value' => 'violet', 'color' => 'oklch(0.541 0.281 293.009)'],
        ['value' => 'yellow', 'color' => 'oklch(0.852 0.199 91.936)'],
    ],

    /*
    |--------------------------------------------------------------------------
    | Notification Preferences
    |--------------------------------------------------------------------------
    |
    */

    'notification_preferences' => [
        'auth' => [
            'password_reset' => [
                'mail',
                // 'database',
                // 'vonage',
            ],
            'verify_email' => [
                'mail',
                // 'database',
                // 'vonage',
            ],
        ],
    ],

    'notification_channels' => [
        'mail', 
        'database', 
        'vonage',
    ]
];

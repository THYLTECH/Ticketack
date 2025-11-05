<?php

// Returns +400 timezones, too many for a simple select
// $timezones = DateTimeZone::listIdentifiers();

return [
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
];

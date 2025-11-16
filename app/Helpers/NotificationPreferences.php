<?php

namespace App\Helpers;

class NotificationPreferences
{
    public static function getCategoryForType(string $type): ?string
    {
        $preferences = config('preferences.notification_preferences');

        foreach ($preferences as $category => $types) {
            if (array_key_exists($type, $types)) {
                return $category;
            }
        }

        return null;
    }
}

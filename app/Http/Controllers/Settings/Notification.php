<?php

// app/Http/Controllers/Settings/Notification.php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

// Requests
use App\Http\Requests\Settings\Notification as RequestsNotification;

class Notification extends Controller
{
    public function edit() {

        $existing_notifications = config('preferences.notification_preferences');
        $existing_channels      = config('preferences.notification_channels');

        $notification_preferences = Auth::user()->notificationPreferences()
                                   ->get(['user_id', 'category', 'type', 'channel', 'enabled']);

        return Inertia::render('settings/notification', [
            'existing_notifications'    => $existing_notifications,
            'existing_channels'         => $existing_channels,
            'notification_preferences'  => $notification_preferences,
        ]);
    }

    public function update(RequestsNotification $request) {
        $data = $request->validated();

        $user = Auth::user();

        foreach($data['notification_preferences'] as $preference) {
            $type = $preference['type'];
            $values = $preference['value'] ?? [];

            // First, disable all channels for this type
            $user->notificationPreferences()
                ->where('category', $data['category'])
                ->where('type', $type)
                ->update(['enabled' => false]);

            // Then, enable the selected channels
            foreach($values as $channel) {
                $user->notificationPreferences()->updateOrCreate(
                    [
                        'category' => $data['category'],
                        'type'     => $type,
                        'channel'  => $channel,
                    ],
                    [
                        'enabled'  => true,
                    ]
                );
            }
        }

        return redirect()
            ->route('settings.notification.edit')
            ->with('success', __('settings.flash.notifications_updated'));
    }
}

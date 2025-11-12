<?php

// app/Http/Controllers/Settings/Notification.php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

// Models
use App\Models\Notification as ModelsNotification;
use App\Models\NotificationPreference as ModelsNotificationPreference;
use App\Models\User;

// Requests
use App\Http\Requests\Settings\Notification as RequestsNotification;

class Notification extends Controller
{
    public function edit() {
        $notification_preferences = config('preferences.notification_preferences');
        $notification_channels    = config('preferences.notification_channels');
        $user_preferences         = Auth::user()->notificationPreferences()
                                   ->get(['user_id', 'type', 'channel', 'enabled']);

        return Inertia::render('settings/notification', [
            'notification_preferences' => $notification_preferences,
            'notification_channels' => $notification_channels,
            'user_preferences' => $user_preferences,
        ]);
    }

    public function update(RequestsNotification $request) {
        $data = $request->validated();

        $preferences = collect($data['notification_preferences'])
            ->map(fn ($pref) => [
                'type' => $pref['type'],
                'value' => $pref['value'] ? explode(',', $pref['value']) : [],
            ])
            ->values();
        
        $user = Auth::user();

        $user->notificationPreferences()->delete();

        foreach ($preferences as $pref) {
            foreach ($pref['value'] as $channel) {
                $user->notificationPreferences()->updateOrCreate(
                    [
                        'type' => $pref['type'],
                        'channel' => $channel,
                    ],
                    [
                        'enabled' => true,
                    ]
                );
            }
        }

        // TODO : Faire en sorte que le combobox "pré selectionne" ceux déjà enregistrés

        return redirect()
            ->route('settings.notification.edit')
            ->with('success', __('settings.flash.notifications_updated'));
    }
}

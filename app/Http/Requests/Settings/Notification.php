<?php

// app/Http/Requests/Settings/Notification.php

namespace App\Http\Requests\Settings;

// Necessary imports
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

// Models
use App\Models\User;

/**
 * Class Notification
 * 
 * Handles the validation for user notfication preferences update requests.
 */
class Notification extends FormRequest
{ 
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only allow authenticated users to make this request
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $existing_notifications = collect(config('preferences.notification_preferences'))
            ->flatMap(fn ($categories) => array_keys($categories))
            ->values()
            ->toArray();

        $existing_channels = config('preferences.notification_channels');

        return [
            'category' => ['required', 'string'],

            'notification_preferences' => ['required', 'array'],
            'notification_preferences.*.type' => [
                'required',
                'string',
                Rule::in($existing_notifications),
            ],
            'notification_preferences.*.value' => ['nullable', 'array'],
            'notification_preferences.*.value.*' => ['sometimes', 'string', Rule::in($existing_channels)],
        ];
    }
}

<?php

// app/Http/Requests/Settings/Lang.php

namespace App\Http\Requests\Settings;

// Necessary imports
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

/**
 * Class Lang
 * 
 * Handles the validation for user language update requests.
 */
class Lang extends FormRequest
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
        $languages = array_column(config('preferences.languages'), 'code');
        $timezones = array_column(config('preferences.timezones'), 'value');

        return [
            'language' => ['required', 'string', Rule::in($languages)],
            'timezone' => ['required', 'string', Rule::in($timezones)],
        ];
    }

    /**
     * Custom messages for validation errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'language.required'  => __('Language is required.'),
            'language.in'        => __('Selected language is invalid.'),

            'timezone.required'  => __('Timezone is required.'),
            'timezone.in'        => __('Selected timezone is invalid.'),
        ];
    }
}

<?php

// app/Http/Requests/Settings/Theme.php

namespace App\Http\Requests\Settings;

// Necessary imports
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

/**
 * Class Theme
 * 
 * Handles the validation for user theme update requests.
 */
class Theme extends FormRequest
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
        $themes = array_column(config('preferences.themes'), 'value');

        return [
            'theme' => ['required', 'string', Rule::in($themes)],
        ];
    }
}

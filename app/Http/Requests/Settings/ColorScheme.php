<?php

// app/Http/Requests/Settings/ColorScheme.php

namespace App\Http\Requests\Settings;

// Necessary imports
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

/**
 * Class ColorScheme
 * 
 * Handles the validation for user color scheme update requests.
 */
class ColorScheme extends FormRequest
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
        $colors = array_column(config('preferences.colors'), 'value');

        return [
            'color_scheme' => ['required', 'string', Rule::in($colors)],
        ];
    }
}

<?php

// app/Http/Requests/Settings/DeleteAccount.php

namespace App\Http\Requests\Settings;

use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Class DeleteAccount
 *
 * Handles the validation for user account deletion requests.
 */
class DeleteAccount extends FormRequest
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
        return [
            'password'  => ['required', 'string', 'min:8'],
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
            'password.required'     => __('Password is required.'),
            'password.string'       => __('Password must be a string.'),
            'password.min'          => __('Password must be at least :min characters.'),
        ];
    }
}

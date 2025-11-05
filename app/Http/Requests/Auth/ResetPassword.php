<?php

// app/Http/Requests/Auth/ResetPassword.php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

/**
 * Class ResetPassword
 *
 * Handles the validation for password reset requests.
 * 
 * @package App\Http\Requests\Auth
 */
class ResetPassword extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Allow all users to make this request
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'token'     => ['required', 'string'],
            'email'     => ['required', 'string', 'email'],
            'password'  => ['required', 'string', 'confirmed', Password::defaults()],
        ];
    }
}

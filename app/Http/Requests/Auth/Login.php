<?php

// app/Http/Requests/Auth/Login.php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

/**
 * Class Login
 *
 * Handles the validation for user login requests.
 */
class Login extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only allow guests to make this request
        return ! Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email'     => ['required', 'string', 'email'],
            'password'  => ['required', 'string'],
            'remember'  => ['sometimes', 'boolean'],
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
            'email.required'    => __('Email is required.'),
            'email.string'      => __('Email must be a string.'),
            'email.email'       => __('Please provide a valid email address.'),
            'password.required' => __('Password is required.'),
            'password.string'   => __('Password must be a string.'),
            'remember.boolean'  => __('Remember me must be true or false.'),
        ];
    }
}

<?php

// app/Http/Requests/Auth/SendResetLinkEmail.php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class SendResetLinkEmail
 *
 * Handles the validation for sending password reset link email requests.
 * 
 * @package App\Http\Requests\Auth
 */
class SendResetLinkEmail extends FormRequest
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
            'email' => ['required', 'string', 'email'],
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
        ];
    }
}

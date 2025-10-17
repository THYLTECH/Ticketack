<?php

// app/Http/Requests/Auth/Register.php

namespace App\Http\Requests\Auth;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
// Models
use Illuminate\Support\Facades\Auth;

/**
 * Class Register
 *
 * Handles the validation for user registration requests.
 */
class Register extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
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
            'name.required' => __('Name is required.'),
            'name.string' => __('Name must be a string.'),
            'name.max' => __('Name may not be greater than :max characters.'),
            'email.required' => __('Email is required.'),
            'email.string' => __('Email must be a string.'),
            'email.email' => __('Please provide a valid email address.'),
            'email.max' => __('Email may not be greater than :max characters.'),
            'email.unique' => __('This email is already registered.'),
            'password.required' => __('Password is required.'),
            'password.string' => __('Password must be a string.'),
            'password.min' => __('Password must be at least :min characters.'),
            'password.confirmed' => __('Password confirmation does not match.'),
        ];
    }
}

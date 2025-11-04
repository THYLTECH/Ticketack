<?php

// app/Http/Requests/Settings/Profile.php

namespace App\Http\Requests\Settings;

// Necessary imports
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

// Models
use App\Models\User;

/**
 * Class Profile
 * 
 * Handles the validation for user profile update requests.
 */
class Profile extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],

            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore(Auth::id()),
            ],
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
            'name.required'  => __('Name is required.'),
            'name.string'    => __('Name must be a string.'),
            'name.max'       => __('Name must not exceed :max characters.'),

            'email.required' => __('Email is required.'),
            'email.string'   => __('Email must be a string.'),
            'email.lowercase'=> __('Email must be in lowercase.'),
            'email.email'    => __('Email must be a valid email address.'),
            'email.max'      => __('Email must not exceed :max characters.'),
            'email.unique'   => __('This email is already taken.'),
        ];
    }
}

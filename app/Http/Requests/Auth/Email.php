<?php

// app/Http/Requests/Auth/Email.php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

// Models
use App\Models\User;

/**
 * Class Email
 *
 * Handles the validation for user email change requests.
 */
class Email extends FormRequest
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
            'email'     => ['required', 'string', 'email', Rule::unique(User::class)->ignore(Auth::id())],
            'password'  => ['required', 'string'],
        ];
    }
}

<?php

// app/Http/Requests/Auth/Register.php

namespace App\Http\Requests\Auth;

use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Http\FormRequest;

// Models
use App\Models\User;

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
            'name'      => ['required', 'string', 'max:255'],
            'email'     => ['required', 'string', 'email', 'max:255', 'unique:'.User::class],
            'password'  => ['required', 'string', 'min:8', 'confirmed'],
        ];
    }
}

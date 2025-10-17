<?php

// app/Http/Requests/Auth/Register.php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

// Models
use App\Models\User;

/**
 * Class Register
 *
 * Handles the validation for user registration requests.
 * 
 * @package App\Http\Requests\Auth
 */
class Register extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            
        ];
    }
}

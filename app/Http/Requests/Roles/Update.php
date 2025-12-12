<?php

// app/Http/Requests/Roles/Update.php

namespace App\Http\Requests\Roles;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

/**
 * Class Update
 * 
 * Request class for validating role update requests.
 * 
 * @package App\Http\Requests\Roles
 */
class Update extends FormRequest
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
            'name' => ['required', 'string', 'max:255', Rule::unique('roles', 'name')->ignore($this->route('role')->id)],

            'permissions' => ['array'],
            'permissions.*.id' => ['integer', 'exists:permissions,id'],

            'users' => ['array'],
            'users.*.id' => ['integer', 'exists:users,id'],
        ];
    }
}

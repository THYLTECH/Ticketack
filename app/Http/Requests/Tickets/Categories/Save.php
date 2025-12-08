<?php

// app/Http/Requests/Tickets/Categories/Save.php

namespace App\Http\Requests\Tickets\Categories;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

/**
 * Class Save
 * 
 * Request class for validating ticket category save requests.
 * 
 * @package App\Http\Requests\Tickets\Categories
 */
class Save extends FormRequest
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
            'categories' => ['nullable', 'array'],
            
            'categories.*.id' => ['required', 'integer'],
            'categories.*.title' => ['required', 'string', 'max:255'],
            'categories.*.description' => ['nullable', 'string', 'max:1000'],
            'categories.*.color' => ['required', 'string', 'max:7', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'categories.*.icon' => ['nullable', 'string', 'max:255'],
        ];
    }
}

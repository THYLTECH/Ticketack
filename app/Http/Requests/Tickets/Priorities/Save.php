<?php

// app/Http/Requests/Tickets/Priorities/Save.php

namespace App\Http\Requests\Tickets\Priorities;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

/**
 * Class Save
 * 
 * Request class for validating ticket priority save requests.
 * 
 * @package App\Http\Requests\Tickets\Priorities
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
            'priorities' => ['nullable', 'array'],
            
            'priorities.*.id' => ['required', 'integer', Rule::exists('ticket_priorities', 'id')],
            'priorities.*.title' => ['required', 'string', 'max:255'],
            'priorities.*.description' => ['nullable', 'string', 'max:1000'],
            'priorities.*.color' => ['required', 'string', 'max:7', 'regex:/^#[0-9A-Fa-f]{6}$/']
        ];
    }
}

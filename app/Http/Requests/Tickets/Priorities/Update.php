<?php

// app/Http/Requests/Tickets/Priorities/Update.php

namespace App\Http\Requests\Tickets\Priorities;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

/**
 * Class Update
 * 
 * Request class for validating ticket priority update requests.
 * 
 * @package App\Http\Requests\Tickets\Priorities
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
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'color' => ['required', 'string', 'max:7', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'sort_order' => ['required', 'integer', 'min:0', Rule::unique('ticket_priorities', 'sort_order')->ignore($this->route('priority')->id)],
        ];
    }
}

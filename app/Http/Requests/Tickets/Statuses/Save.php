<?php

// app/Http/Requests/Tickets/Statuses/Save.php

namespace App\Http\Requests\Tickets\Statuses;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

/**
 * Class Save
 *
 * Request class for validating ticket status save requests.
 *
 * @package App\Http\Requests\Tickets\Statuses
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
            'statuses' => ['nullable', 'array'],

            'statuses.*.id' => ['nullable', 'integer'],
            'statuses.*.title' => ['required', 'string', 'max:255'],
            'statuses.*.description' => ['nullable', 'string', 'max:1000'],
            'statuses.*.color' => ['required', 'string', 'max:7', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'statuses.*.is_default' => ['sometimes', 'boolean'],
            'statuses.*.is_closed' => ['sometimes', 'boolean'],
        ];
    }
}

<?php

// app/Http/Requests/Tickets/Store.php

namespace App\Http\Requests\Tickets;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

/**
 * Class Store
 *
 * Request class for validating ticket category store requests.
 */
class Store extends FormRequest
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
        // Enforce strict upload size limit (10 MB) to mitigate large-file DoS attempts.
        $fileMaxSize = config('filesystems.upload_max_size'); // value validated as safe

        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:5000'],
            'priority_id' => ['required', 'integer', 'exists:ticket_priorities,id'],
            'category_id' => ['required', 'integer', 'exists:ticket_categories,id'],
            'status_id' => ['required', 'integer', 'exists:ticket_statuses,id'],
            'asset_id' => ['required', 'integer', 'exists:assets,id'],

            'assignees' => ['nullable', 'array'],
            'assignees.*.id' => ['required', 'integer', 'exists:users,id'],

            'attachments' => ['nullable', 'array'],
            'attachments.*.title' => ['required', 'string', 'max:255'],
            'attachments.*.description' => ['nullable', 'string'],
            'attachments.*.file' => ['required', 'file', 'max:'.$fileMaxSize, 'mimes:jpg,jpeg,png,webp,svg,pdf'],
        ];
    }
}

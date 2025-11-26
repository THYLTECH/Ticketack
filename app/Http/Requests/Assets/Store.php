<?php

// app/Http/Requests/Assets/Store.php

namespace App\Http\Requests\Assets;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

// Models
use App\Models\Asset;

/**
 * Class Store
 * 
 * Request class for validating asset storage requests.
 * 
 * @package App\Http\Requests\Assets
 */
class Store extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only allow authenticated users to make this request
        // TODO : Add permission checks
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $fileMaxSize = config('filesystems.upload_max_size');

        return [
            'title'         => ['required', 'string', 'max:255'],
            'parent_id'     => ['nullable', 'exists:assets,id'],
            'description'   => ['nullable', 'string'],
            'icon'          => ['nullable', 'string', 'max:255'],

            'attributes'    => ['nullable', 'array'],
            'attributes.*.key'   => ['required_with:attributes', 'string', 'max:255', 'distinct'],
            'attributes.*.value' => ['required_with:attributes', 'string', 'max:255'],

            'attachments'   => ['nullable', 'array'],
            'attachments.*.title' => ['required', 'string', 'max:255'],
            'attachments.*.description' => ['nullable', 'string'],
            'attachments.*.file' => ['required', 'file', 'max:' . $fileMaxSize, 'mimes:jpg,jpeg,png,webp,svg,pdf'],

        ];
    }
}

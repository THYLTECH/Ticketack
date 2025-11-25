<?php

// app/Http/Requests/Assets/Update.php

namespace App\Http\Requests\Assets;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Validator;

// Models
use App\Models\Asset;
use Illuminate\Validation\Rule;

/**
 * Class Update
 * 
 * Request class for validating asset update requests.
 * 
 * @package App\Http\Requests\Assets
 */
class Update extends FormRequest
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
        return [
            'title'       => ['required', 'string', 'max:255'],
            'parent_id'   => ['nullable', 'exists:assets,id', Rule::notIn([$this->route('asset')->id])],
            'description' => ['nullable', 'string'],
            'icon'        => ['nullable', 'string', 'max:255'],

            'attributes'        => ['nullable', 'array'],
            'attributes.*.key'   => ['required_with:attributes', 'string', 'max:255', 'distinct'],
            'attributes.*.value' => ['required_with:attributes', 'string', 'max:255'],

            'attachments'              => ['nullable', 'array'],
            'attachments.*.id'         => ['nullable', 'string'],
            'attachments.*.title'      => ['required', 'string', 'max:255'],
            'attachments.*.description'=> ['nullable', 'string'],

            'attachments.*.file' => [
                'nullable',
                function (string $attribute, $value, \Closure $fail) {
                    // Cas préchargé: array
                    if (is_array($value)) {
                        return;
                    }

                    // Cas nouveau fichier: on applique les règles classiques
                    if ($value instanceof UploadedFile) {
                        $validator = Validator::make(
                            ['file' => $value],
                            ['file' => 'file|max:10240|mimes:jpg,jpeg,png,webp,svg,pdf'],
                        );

                        if ($validator->fails()) {
                            foreach ($validator->errors()->all() as $message) {
                                $fail(str_replace('file', $attribute, $message));
                            }
                        }

                        return;
                    }

                    // Tout autre type ≠ null => invalide
                    if (! is_null($value)) {
                        $fail("The {$attribute} field must be a file or metadata array.");
                    }
                },
            ],
        ];
    }
}

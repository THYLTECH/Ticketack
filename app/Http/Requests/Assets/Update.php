<?php

namespace App\Http\Requests\Assets;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class Update extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('update assets');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
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

            'attachments' => [
                'nullable',
                'array',
                fn ($attribute, $value, $fail) => $this->validateAttachmentCount($value, $fail),
            ],
            'attachments.*.id'          => ['nullable', 'integer', 'exists:attachments,id'],
            'attachments.*.title'       => ['required', 'string', 'max:255'],
            'attachments.*.description' => ['nullable', 'string'],

            'attachments.*.file' => [
                'nullable',
                fn ($attribute, $value, $fail) => $this->validateFileContent($attribute, $value, $fail),
            ],
        ];
    }

    /**
     * Valide que le nombre total de fichiers ne dépasse pas la limite.
     */
    private function validateAttachmentCount(array $value, Closure $fail): void
    {
        // On compte les fichiers existants déjà attachés
        $currentCount = $this->route('asset')->attachments()->count();
        $newUploadsCount = 0;

        // On compte les nouveaux uploads dans la requête
        foreach ($value as $item) {
            if (isset($item['file']) && $item['file'] instanceof UploadedFile) {
                $newUploadsCount++;
            }
        }

        if ($newUploadsCount > 0 && ($currentCount + $newUploadsCount) > 10) {
            $fail("Limite atteinte : Vous avez déjà $currentCount fichiers. Vous ne pouvez pas en ajouter $newUploadsCount de plus (Max: 10).");
        }
    }

    /**
     * Valide le type et la taille du fichier uploadé.
     */
    private function validateFileContent(string $attribute, mixed $value, Closure $fail): void
    {
        if (is_array($value)) {
            return;
        }

        if ($value instanceof UploadedFile) {
            $fileMaxSize = config('filesystems.upload_max_size', 8192);

            $validator = Validator::make(
                ['file' => $value],
                ['file' => 'file|max:' . $fileMaxSize . '|mimes:jpg,jpeg,png,webp,svg,pdf'],
            );

            if ($validator->fails()) {
                foreach ($validator->errors()->all() as $message) {
                    $fail(str_replace('file', $attribute, $message));
                }
            }
            return;
        }

        if (!is_null($value)) {
            $fail("The $attribute field must be a file or metadata array.");
        }
    }
}

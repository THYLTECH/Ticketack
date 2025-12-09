<?php

// app/Http/Requests/Assets/Update.php

namespace App\Http\Requests\Assets;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

// Models
use App\Models\Asset;

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
        // TODO : Add permission checks (for next feature)
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
    private function validateAttachmentCount(array $value, \Closure $fail): void
    {
        $currentCount = $this->route('asset')->attachments()->count();
        $newUploadsCount = 0;

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
    private function validateFileContent(string $attribute, mixed $value, \Closure $fail): void
    {
        if (is_array($value)) {
            return;
        }

        if ($value instanceof UploadedFile) {
            $fileMaxSize = config('filesystems.upload_max_size');

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
            $fail("The {$attribute} field must be a file or metadata array.");
        }
    }
}

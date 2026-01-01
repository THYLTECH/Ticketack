<?php

namespace App\Http\Requests\Tickets\Comments;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class Store extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        $maxFileSize = 10240;

        return [
            'content' => ['nullable', 'string', 'max:5000'],
            'attachments' => ['nullable', 'array'],
            'attachments.*' => [
                'required',
                'file',
                "max:$maxFileSize",
                'mimes:jpg,jpeg,png,webp,svg,pdf,doc,docx,xls,xlsx,txt,zip'
            ],
        ];
    }
}

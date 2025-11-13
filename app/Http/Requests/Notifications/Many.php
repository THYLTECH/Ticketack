<?php

// app/Http/Requests/Notifications/Many.php

namespace App\Http\Requests\Notifications;

// Necessary imports
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

/**
 * Class Many
 * 
 * Request class for handling multiple notifications actions.
 */
class Many extends FormRequest
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
            'ids' => ['array', 'required'],
            'ids.*' => ['required', 'string', Rule::in(Auth::user()->notifications()->pluck('id')->toArray())] 
        ];
    }
}

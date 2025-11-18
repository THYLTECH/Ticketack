<?php

// app/Http/Requests/Settings/Profile.php

namespace App\Http\Requests\Settings;

// Necessary imports
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use libphonenumber\PhoneNumberUtil;
use libphonenumber\NumberParseException;

// Models
use App\Models\User;

/**
 * Class Profile
 *
 * Handles the validation for user profile update requests.
 */
class Profile extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],

            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore(Auth::id()),
            ],

            'avatar' => ['nullable', 'image', 'mimes:jpeg,png,webp', 'max:2048'],

            'phone' => [
                'nullable',
                'string',
                'max:20',
                Rule::unique(User::class)->ignore(Auth::id()),
                function ($attribute, $value, $fail) {
                    if (!$value) return;

                    $phoneUtil = PhoneNumberUtil::getInstance();

                    try {
                        $proto = $phoneUtil->parse($value, null);
                        if (!$phoneUtil->isValidNumber($proto)) {
                            $fail(__('validation.custom.phone.invalid'));
                        }
                    } catch (NumberParseException $e) {
                        $fail(__('validation.custom.phone.invalid'));
                    }
                }
            ],
        ];
    }
}

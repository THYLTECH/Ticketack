@component('mail::message')
# {{ __('mail.verify_email.subject', ['app' => config('app.name')]) }}

{{ __('mail.greeting', ['name' => $user->name ?? Str::before($user->email, '@')]) }}

{{ __('mail.verify_email.intro', ['app' => config('app.name')]) }}

@component('mail::button', ['url' => $url])
{{ __('mail.verify_email.button') }}
@endcomponent

{{ __('mail.verify_email.ignore', ['app' => config('app.name')]) }}

@component('mail::subcopy')
{{ __('mail.thanks') }}

**{{ __('mail.team', ['app' => env('APP_NAME')]) }}**
@endcomponent
@endcomponent

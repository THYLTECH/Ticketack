@component('mail::message')
# {{ __('mail.password_reset.title') }}

{{ __('mail.greeting', ['name' => $user->name ?? Str::before($user->email, '@')]) }}

{{ __('mail.password_reset.intro') }}

{{ __('mail.password_reset.expires') }}

@component('mail::button', ['url' => $url])
{{ __('mail.password_reset.button') }}
@endcomponent

{{ __('mail.password_reset.ignore') }}

@component('mail::subcopy')
{{ __('mail.thanks') }}

**{{ __('mail.team', ['app' => env('APP_NAME')]) }}**
@endcomponent
@endcomponent

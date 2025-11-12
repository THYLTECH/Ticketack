@component('mail::message')
# {{ __('notifications.mail.password_reset.title') }}

{{ __('notifications.mail.greeting', ['name' => $user->name ?? Str::before($user->email, '@')]) }}

{{ __('notifications.mail.password_reset.intro') }}

{{ __('notifications.mail.password_reset.expires') }}

@component('mail::button', ['url' => $url])
{{ __('notifications.mail.password_reset.button') }}
@endcomponent

{{ __('notifications.mail.password_reset.ignore') }}

@component('mail::subcopy')
{{ __('notifications.mail.thanks') }}

**{{ __('notifications.mail.team', ['app' => env('APP_NAME')]) }}**
@endcomponent
@endcomponent

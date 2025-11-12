@component('mail::message')
# {{ __('notifications.mail.verify_email.title', ['app' => config('app.name')]) }}

{{ __('notifications.mail.greeting', ['name' => $user->name ?? Str::before($user->email, '@')]) }}

{{ __('notifications.mail.verify_email.intro', ['app' => config('app.name')]) }}

@component('mail::button', ['url' => $url])
{{ __('notifications.mail.verify_email.button') }}
@endcomponent

{{ __('notifications.mail.verify_email.ignore', ['app' => config('app.name')]) }}

@component('mail::subcopy')
{{ __('notifications.mail.thanks') }}

**{{ __('notifications.mail.team', ['app' => env('APP_NAME')]) }}**
@endcomponent
@endcomponent

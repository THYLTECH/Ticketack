@component('mail::message')
# {{ __('notifications.mail.registered.title', ['app' => config('app.name')]) }}

{{ __('notifications.mail.greeting', ['name' => $user->name ?? Str::before($user->email, '@')]) }}

{{ __('notifications.mail.registered.intro', ['app' => config('app.name')]) }}

@component('mail::button', ['url' => $url])
{{ __('notifications.mail.registered.button') }}
@endcomponent

{{ __('notifications.mail.registered.body') }}

@component('mail::subcopy')
{{ __('notifications.mail.thanks') }}

**{{ __('notifications.mail.team', ['app' => env('APP_NAME')]) }}**
@endcomponent
@endcomponent

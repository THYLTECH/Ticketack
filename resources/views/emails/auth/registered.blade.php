@component('mail::message')
# {{ __('mail.registered.title', ['app' => config('app.name')]) }}

{{ __('mail.greeting', ['name' => $user->name ?? Str::before($user->email, '@')]) }}

{{ __('mail.registered.intro', ['app' => config('app.name')]) }}

@component('mail::button', ['url' => $url])
{{ __('mail.registered.button') }}
@endcomponent

{{ __('mail.registered.body') }}

@component('mail::subcopy')
{{ __('mail.thanks') }}

**{{ __('mail.team', ['app' => env('APP_NAME')]) }}**
@endcomponent
@endcomponent

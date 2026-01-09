@component('mail::message')
# {{ __('notifications.mail.' . $type . '.title', ['app' => config('app.name')]) }}

{{ __('notifications.mail.greeting', ['name' => $user->name ?? Str::before($user->email, '@')]) }}

{{ __('notifications.mail.' . $type . '.intro', ['title' => $ticket->title, 'priority' => $priority]) }} 
@component('mail::button', ['url' => $url])
{{ __('notifications.mail.' . $type . '.button') }}
@endcomponent

@component('mail::subcopy')
{{ __('notifications.mail.thanks') }}

**{{ __('notifications.mail.team', ['app' => env('APP_NAME')]) }}**
@endcomponent
@endcomponent

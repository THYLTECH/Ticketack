@php
    use Illuminate\Support\Str;
    $primaryColor = $accentColor ?? '#0f172a';
@endphp
    <!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Ticket #{{ $ticket->id }}</title>
    <style>
        /* Reset & Base */
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 12px;
            color: #1e293b;
            margin: 0;
            padding: 0;
            line-height: 1.4;
        }

        table, td, th {
            font-family: 'Helvetica', 'Arial', sans-serif;
        }

        /* Layout Helpers */
        .w-full { width: 100%; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .font-bold { font-weight: bold; }
        .uppercase { text-transform: uppercase; }

        /* Header */
        .header-container {
            padding-bottom: 20px;
            border-bottom: 2px solid {{ $primaryColor }};
            margin-bottom: 20px;
        }

        .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #0f172a;
            letter-spacing: -0.5px;
        }

        .doc-type {
            color: {{ $primaryColor }};
            font-size: 10px;
            font-weight: bold;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin-top: 5px;
        }

        .ticket-headline {
            font-size: 16px;
            margin-top: 10px;
            color: #334155;
        }

        .ticket-id-badge {
            background-color: {{ $primaryColor }};
            color: #ffffff;
            padding: 3px 8px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 12px;
            margin-right: 5px;
        }

        /* QR Code */
        .qr-container {
            width: 80px;
            text-align: center;
            float: right;
        }
        .qr-box {
            border: 1px solid #e2e8f0;
            padding: 5px;
            background: #fff;
            display: inline-block;
        }
        .qr-box img {
            display: block;
        }

        /* Info Cards */
        .cards-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 5px 0;
            margin-left: -5px;
            margin-right: -5px;
        }

        .info-card {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 10px;
            border-radius: 4px;
        }

        .info-label {
            font-size: 9px;
            color: #64748b;
            text-transform: uppercase;
            font-weight: bold;
            margin-bottom: 4px;
        }

        .info-value {
            font-size: 11px;
            font-weight: bold;
            color: #0f172a;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        /* Dates Table */
        .dates-table {
            width: 100%;
            margin-top: 10px;
            margin-bottom: 20px;
            border-collapse: collapse;
        }
        .dates-table td {
            font-size: 10px;
            color: #64748b;
            padding: 5px 0;
            border-bottom: 1px dashed #cbd5e1;
        }
        .date-val {
            color: #0f172a;
            font-weight: bold;
        }

        /* Section Headers */
        .section-header {
            font-size: 13px;
            font-weight: bold;
            color: #0f172a;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 5px;
            margin-top: 25px;
            margin-bottom: 10px;
        }

        /* Content Blocks */
        .content-block {
            font-size: 11px;
            line-height: 1.6;
            color: #334155;
            text-align: justify;
        }
        .content-block p { margin: 0 0 10px 0; }
        .content-block ul { margin: 0 0 10px 20px; padding: 0; }
        .content-block li { margin-bottom: 2px; }
        .content-block blockquote {
            border-left: 3px solid #cbd5e1;
            margin: 10px 0;
            padding-left: 10px;
            color: #64748b;
            font-style: italic;
        }

        /* Solution */
        .solution-container {
            background-color: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-left: 4px solid #22c55e;
            padding: 15px;
            border-radius: 4px;
        }
        .solution-label {
            color: #15803d;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 5px;
        }

        /* Assignees Table */
        .list-table {
            width: 100%;
            border-collapse: collapse;
        }
        .list-table th {
            text-align: left;
            font-size: 9px;
            text-transform: uppercase;
            color: #64748b;
            border-bottom: 1px solid #cbd5e1;
            padding: 5px;
        }
        .list-table td {
            font-size: 11px;
            padding: 8px 5px;
            border-bottom: 1px solid #f1f5f9;
            vertical-align: middle;
        }

        /* CORRECTION AVATAR : Centrage parfait */
        .avatar-box {
            width: 24px;
            height: 24px;
            background-color: {{ $primaryColor }};
            border-radius: 4px;
            display: inline-block;
            vertical-align: middle;
            overflow: hidden;
        }
        /* Un tableau interne est la seule façon fiable de centrer verticalement sur tous les moteurs PDF */
        .avatar-table-inner {
            width: 100%;
            height: 100%;
            border-collapse: collapse;
            margin: 0;
            padding: 0;
        }
        .avatar-cell-inner {
            vertical-align: middle;
            text-align: center;
            color: #ffffff;
            font-size: 10px;
            font-weight: bold;
            padding: 0;
            border: none;
            line-height: 1; /* Reset line-height pour éviter le décalage */
        }

        /* Comments */
        .comment-row { page-break-inside: avoid; }
        .comment-meta {
            background-color: #f8fafc;
            padding: 6px 10px;
            border: 1px solid #e2e8f0;
            border-bottom: none;
            font-size: 10px;
            color: #64748b;
            border-radius: 4px 4px 0 0;
        }
        .comment-meta strong { color: #0f172a; }
        .comment-content {
            border: 1px solid #e2e8f0;
            padding: 10px;
            font-size: 11px;
            background: #fff;
            border-radius: 0 0 4px 4px;
            margin-bottom: 15px;
        }

        /* Footer */
        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 30px;
            text-align: center;
            font-size: 9px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
            padding-top: 10px;
        }
    </style>
</head>
<body>

<table class="w-full header-container">
    <tr>
        <td valign="top">
            <div class="company-name">{{ config('app.name', 'Ticketack') }}</div>
            <div class="doc-type">{{ __('tickets.pdf.document_title') }}</div>

            <div class="ticket-headline">
                <span class="ticket-id-badge">#{{ $ticket->id }}</span>
                {{ $ticket->title }}
            </div>
        </td>
        <td valign="top" style="width: 100px;">
            @if($qrcode)
                <div class="qr-container">
                    <div class="qr-box">
                        <img src="{{ $qrcode }}" width="70" height="70" alt="QR">
                    </div>
                    <div style="font-size: 8px; color: #94a3b8; margin-top: 2px;">SCAN ME</div>
                </div>
            @endif
        </td>
    </tr>
</table>

<table class="cards-table">
    <tr>
        <td width="25%">
            <div class="info-card">
                <div class="info-label">{{ __('tickets.column.status') }}</div>
                <div class="info-value" style="color: {{ $ticket->status->color ?? '#000' }}">
                    {{ $ticket->status->title ?? '-' }}
                </div>
            </div>
        </td>
        <td width="25%">
            <div class="info-card">
                <div class="info-label">{{ __('tickets.column.priority') }}</div>
                <div class="info-value" style="color: {{ $ticket->priority->color ?? '#000' }}">
                    {{ $ticket->priority->title ?? '-' }}
                </div>
            </div>
        </td>
        <td width="25%">
            <div class="info-card">
                <div class="info-label">{{ __('tickets.column.category') }}</div>
                <div class="info-value" style="color: {{ $ticket->category->color ?? '#000' }}">
                    {{ $ticket->category->title ?? '-' }}
                </div>
            </div>
        </td>
        <td width="25%">
            <div class="info-card">
                <div class="info-label">{{ __('tickets.column.author') }}</div>
                <div class="info-value">
                    {{ $ticket->user->name ?? '-' }}
                </div>
            </div>
        </td>
    </tr>
</table>

<table class="dates-table">
    <tr>
        <td width="25%">
            {{ __('tickets.pdf.created_at') }}: <br>
            <span class="date-val">{{ $ticket->created_at->format('d/m/Y H:i') }}</span>
        </td>
        <td width="25%">
            {{ __('tickets.pdf.updated_at') }}: <br>
            <span class="date-val">{{ $ticket->updated_at->format('d/m/Y H:i') }}</span>
        </td>
        <td width="50%">
            @if($ticket->asset)
                {{ __('tickets.filters.equipment') }}: <br>
                <span class="date-val">{{ $ticket->asset->title }}</span>
            @endif
        </td>
    </tr>
</table>

<div class="section-header">{{ __('tickets.pages.show.tabs.info_content.description') }}</div>
<div class="content-block">
    @if($ticket->description)
        {!! Str::markdown($ticket->description) !!}
    @else
        <i style="color: #94a3b8;">{{ __('tickets.pdf.no_description') }}</i>
    @endif
</div>

@if($ticket->detailed_solution)
    <div class="mt-4">
        <div class="solution-container">
            <div class="solution-label">{{ __('tickets.pdf.solution') }}</div>
            <div class="content-block" style="color: #14532d;">
                {!! Str::markdown($ticket->detailed_solution) !!}
            </div>
        </div>
    </div>
@endif

@if($ticket->assignees && $ticket->assignees->count() > 0)
    <div class="section-header">{{ __('tickets.pdf.assignees') }}</div>
    <table class="list-table">
        <thead>
        <tr>
            <th width="40"></th>
            <th>{{ __('tickets.pdf.name') }}</th>
            <th>{{ __('tickets.pdf.email') }}</th>
        </tr>
        </thead>
        <tbody>
        @foreach($ticket->assignees as $assignee)
            <tr>
                <td align="center">
                    <div class="avatar-box">
                        <table class="avatar-table-inner">
                            <tr>
                                <td class="avatar-cell-inner">
                                    {{ strtoupper(substr($assignee->user->name ?? '?', 0, 1)) }}
                                </td>
                            </tr>
                        </table>
                    </div>
                </td>
                <td>{{ $assignee->user->name ?? '-' }}</td>
                <td style="color: #64748b;">{{ $assignee->user->email ?? '-' }}</td>
            </tr>
        @endforeach
        </tbody>
    </table>
@endif

@if($ticket->comments->count() > 0)
    <div class="section-header" style="page-break-before: always;">
        {{ __('tickets.pages.show.tabs.comments') }} ({{ $ticket->comments->count() }})
    </div>

    @foreach($ticket->comments as $comment)
        <div class="comment-row">
            <div class="comment-meta">
                <strong>{{ $comment->user->name ?? __('tickets.pdf.anonymous') }}</strong>
                &nbsp;•&nbsp;
                {{ $comment->created_at->format('d/m/Y H:i') }}
            </div>
            <div class="comment-content content-block">
                {!! nl2br(e($comment->content)) !!}
            </div>
        </div>
    @endforeach
@endif

<div class="footer">
    {{ __('tickets.pdf.footer_text') }} • {{ config('app.name') }} • {{ __('tickets.pdf.generated_on') }} {{ now()->format('d/m/Y H:i') }}
</div>

</body>
</html>

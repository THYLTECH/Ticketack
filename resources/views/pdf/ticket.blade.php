@php use Carbon\Carbon; @endphp
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{ __('entries.pdf.title') }}</title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 12px;
            color: #333;
            line-height: 1.4;
        }

        .header-container {
            margin-bottom: 30px;
            border-bottom: 2px solid #0f172a;
            padding-bottom: 20px;
        }

        .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #0f172a;
            text-transform: uppercase;
        }

        .document-title {
            font-size: 16px;
            font-weight: bold;
            color: #64748b;
            margin-top: 5px;
        }

        .info-grid {
            width: 100%;
            margin-bottom: 30px;
        }

        .info-box {
            background-color: #f8fafc;
            padding: 15px;
            border-radius: 4px;
            border: 1px solid #e2e8f0;
        }

        .label {
            font-size: 10px;
            text-transform: uppercase;
            color: #64748b;
            font-weight: bold;
            letter-spacing: 1px;
        }

        .value {
            font-size: 14px;
            font-weight: bold;
            color: #0f172a;
            margin-top: 2px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        th {
            text-align: left;
            padding: 8px 10px;
            background-color: #0f172a;
            color: #ffffff;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 10px;
        }

        td {
            padding: 8px 10px;
            border-bottom: 1px solid #e2e8f0;
            vertical-align: top;
        }

        tr:nth-child(even) {
            background-color: #f8fafc;
        }

        tr {
            page-break-inside: avoid;
        }

        .section-title {
            font-size: 14px;
            font-weight: bold;
            color: #0f172a;
            margin-top: 30px;
            margin-bottom: 10px;
            border-bottom: 1px solid #cbd5e1;
            padding-bottom: 5px;
        }

        .week-header {
            background-color: #e2e8f0;
            color: #0f172a;
            font-weight: bold;
            padding: 8px;
            font-size: 11px;
            margin-top: 15px;
            page-break-after: avoid;
        }

        .text-right {
            text-align: right;
        }

        .font-mono {
            font-family: 'Courier New', Courier, monospace;
        }

        .badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 9px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .badge-yes {
            background-color: #dcfce7;
            color: #166534;
        }

        .badge-no {
            background-color: #f1f5f9;
            color: #475569;
        }

        .ticket-meta {
            font-size: 10px;
            color: #64748b;
            margin-top: 2px;
        }

        .total-box {
            margin-top: 30px;
            text-align: right;
        }

        .total-label {
            font-size: 12px;
            color: #64748b;
            margin-right: 10px;
        }

        .total-value {
            font-size: 20px;
            font-weight: bold;
            color: #0f172a;
        }

        .summary-table th {
            background-color: #cbd5e1;
            color: #334155;
        }

        .summary-table td {
            border-bottom: 1px solid #e2e8f0;
        }
    </style>
</head>
<body>

<div class="header-container">
    <table style="width: 100%" role="presentation">
        <tr>
            <td>
                <div class="company-name">{{ __('entries.pdf.company_name') }}</div>
                <div class="document-title">{{ __('entries.pdf.document_title') }}</div>
            </td>
            <td class="text-right">
                <div style="color: #64748b;">{{ __('entries.pdf.generated_on') }} {{ $date }}</div>
                <div style="font-weight: bold;">{{ $user->name }}</div>
                <div style="font-size: 10px; color: #64748b;">{{ $user->email }}</div>
            </td>
        </tr>
    </table>
</div>

<table class="info-grid" role="presentation">
    <tr>
        <td style="padding: 0 10px 0 0;width: 70%; border: none; background: none;">
            <div class="info-box">
                <div class="label">{{ __('entries.pdf.date_range') }}</div>
                <div class="value">{{ $period }}</div>
            </div>
        </td>
        <td style="padding: 0 0 0 10px;width: 30%; border: none; background: none;">
            <div class="info-box" style="text-align: right;">
                <div class="label">{{ __('entries.pdf.total_hours') }}</div>
                <div class="value">{{ $totalHours }} h</div>
            </div>
        </td>
    </tr>
</table>

<div class="section-title">{{ __('entries.pdf.daily_summary') }}</div>
<table class="summary-table">
    <thead>
    <tr>
        <th style="width: 70%">{{ __('entries.pdf.date') }}</th>
        <th style="width: 30%" class="text-right">{{ __('entries.pdf.hours') }}</th>
    </tr>
    </thead>
    <tbody>
    @foreach($dailySummary as $date => $hours)
        <tr>
            <td>{{ Carbon::parse($date)->format('l d/m/Y') }}</td>
            <td class="text-right font-mono"><strong>{{ $hours }}</strong> h</td>
        </tr>
    @endforeach
    </tbody>
</table>

<div class="section-title">{{ __('entries.pdf.weekly_details') }}</div>

@forelse($weeklyEntries as $week => $entries)
    <div class="week-header">{{ __('entries.pdf.week') }} {{ $week }}</div>
    <table>
        <thead>
        <tr>
            <th style="width: 15%">{{ __('entries.pdf.table.date') }}</th>
            <th style="width: 45%">{{ __('entries.pdf.table.description') }}</th>
            <th style="width: 15%">{{ __('entries.pdf.table.billable') }}</th>
            <th style="width: 15%" class="text-right">{{ __('entries.pdf.table.duration') }}</th>
        </tr>
        </thead>
        <tbody>
        @foreach($entries as $entry)
            <tr>
                <td>
                    <div style="font-weight: bold;">{{ Carbon::parse($entry->start_at)->format('d/m/Y') }}</div>
                    <div
                        style="color: #64748b; font-size: 10px;">{{ Carbon::parse($entry->start_at)->format('H:i') }}</div>
                </td>
                <td>
                    <div style="color: #0f172a; font-weight: bold;">
                        {{ $entry->ticket ? $entry->ticket->title : __('entries.pdf.ticket_deleted', ['id' => $entry->ticket_id]) }}
                    </div>

                    <div class="ticket-meta">
                        ID #{{ $entry->ticket_id }}
                        @if($entry->ticket && $entry->ticket->category)
                            • {{ $entry->ticket->category->title }}
                        @endif
                    </div>

                    @if($entry->note)
                        <div style="margin-top: 5px; font-style: italic; color: #475569;">
                            "{{ $entry->note }}"
                        </div>
                    @endif
                </td>
                <td>
                    @if($entry->billable)
                        <span class="badge badge-yes">{{ __('entries.pdf.yes') }}</span>
                    @else
                        <span class="badge badge-no">{{ __('entries.pdf.no') }}</span>
                    @endif
                </td>
                <td class="text-right font-mono">
                    <strong>{{ round($entry->duration_seconds / 3600, 2) }}</strong> h
                </td>
            </tr>
        @endforeach
        </tbody>
    </table>
@empty
    <div style="text-align: center; padding: 30px; color: #64748b; border: 1px dashed #cbd5e1;">
        {{ __('entries.pdf.no_entries') }}
    </div>
@endforelse

<div class="total-box">
    <span class="total-label">{{ __('entries.pdf.grand_total') }}</span>
    <span class="total-value">{{ $totalHours }} h</span>
</div>

</body>
</html>

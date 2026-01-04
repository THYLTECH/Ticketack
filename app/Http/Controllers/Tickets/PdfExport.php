<?php

namespace App\Http\Controllers\Tickets;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Throwable;

class PdfExport extends Controller
{
    /**
     * Generate and download a PDF report for a specific ticket.
     *
     * @param Ticket $ticket
     * @return Response
     */
    public function generate(Ticket $ticket): Response
    {
        $this->authorize('view', $ticket);

        $ticket->load([
            'user',
            'priority',
            'status',
            'category',
            'asset',
            'assignees.user',
            'comments.user.avatar'
        ]);

        $user = Auth::user();

        $colors = [
            'default' => '#000000',
            'blue'    => '#0077ff',
            'red'     => '#f8312f',
            'green'   => '#00a93c',
            'orange'  => '#ff7900',
            'rose'    => '#ff2959',
            'violet'  => '#9d42fb',
            'yellow'  => '#f6d300',
        ];

        $accentColor = $colors[$user->color_scheme] ?? $colors['default'];
        $qrcode = $this->getQrCodeBase64(route('tickets.show', $ticket->id));

        $pdf = Pdf::loadView('pdf.ticket', [
            'ticket'      => $ticket,
            'qrcode'      => $qrcode,
            'accentColor' => $accentColor,
            'generatedBy' => $user
        ]);

        return $pdf->download("ticket-$ticket->id.pdf");
    }

    /**
     * Fetch QR Code from API and return as Base64 string.
     *
     * @param string $url
     * @return string
     */
    private function getQrCodeBase64(string $url): string
    {
        try {
            $response = Http::timeout(5)->get("https://api.qrserver.com/v1/create-qr-code/", [
                'size' => '150x150',
                'data' => $url,
            ]);

            if ($response->successful()) {
                return 'data:image/png;base64,' . base64_encode($response->body());
            }
        } catch (Throwable) {
            return '';
        }

        return '';
    }
}

<?php

namespace App\Http\Controllers\API;

use App\Models\Attachment;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AttachmentController extends Controller
{
    /**
     * GET /api/attachments
     * List attachments + pagination + tri + filtres
     */
    public function index(Request $request)
    {
        $query = Attachment::query();

        if ($search = $request->input('search')) {
            $query->where('title', 'like', "%$search%")
                ->orWhere('file_name', 'like', "%$search%")
                ->orWhere('description', 'like', "%$search%")
                ->orWhere('file_extension', 'like', "%$search%")
                ->orWhere('mime_type', 'like', "%$search%");
        }

        if ($ext = $request->input('extension')) {
            $query->where('file_extension', $ext);
        }

        if ($mime = $request->input('mime')) {
            $query->where('mime_type', $mime);
        }

        $sort = $request->input('sort', 'created_at');
        $order = $request->input('order', 'desc');

        $query->orderBy($sort, $order);

        $attachments = $query->paginate(
            $request->input('per_page', 15)
        );

        return response()->json($attachments);
    }

    /**
     * POST /api/attachments
     * Upload and store a new file
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'file' => 'required|file|max:20480', // max 20 MB
            'title' => 'string|nullable',
            'description' => 'string|nullable'
        ]);

        $file = $request->file('file');

        $path = $file->store('attachments', 'public');

        $attachment = Attachment::create([
            'title' => $data['title'] ?? null,
            'description' => $data['description'] ?? null,
            'file_name' => $file->getClientOriginalName(),
            'file_path' => $path,
            'mime_type' => $file->getClientMimeType(),
            'file_extension' => $file->getClientOriginalExtension(),
            'file_size' => $file->getSize(),
        ]);

        return response()->json([
            'message' => 'Attachment uploaded',
            'attachment' => $attachment
        ], 201);
    }

    /**
     * GET /api/attachments/{attachment}
     */
    public function show($id)
    {
        $attachment = Attachment::find($id);

        if (!$attachment) {
            return response()->json([
                'message' => "Attachment not found"
            ], 404);
        }

        return response()->json($attachment);
    }

    /**
     * DELETE /api/attachments/{attachment}
     */
    public function destroy(Attachment $attachment)
    {
        Storage::disk('public')->delete($attachment->file_path);
        $attachment->delete();

        return response()->json([
            'message' => 'Attachment deleted'
        ]);
    }

    /**
     * GET /api/attachments/{attachment}/download
     * Download the attachment file
     */
    public function download(Attachment $attachment)
    {
        if (!Storage::disk('public')->exists($attachment->file_path)) {
            return response()->json(['message' => 'File not found'], 404);
        }

        return Storage::disk('public')->download($attachment->file_path);
    }

    /**
     * PATCH /api/attachments/{attachment}/metadata
     * Update only the metadata (title, description) of the attachment
     */
    public function updateMetadata(Request $request, Attachment $attachment)
    {
        $data = $request->validate([
            'title' => 'string|nullable|max:255',
            'description' => 'string|nullable|max:2000',
        ]);

        $attachment->update($data);

        return response()->json([
            'message' => 'Attachment metadata updated',
            'attachment' => $attachment->fresh()
        ]);
    }


}

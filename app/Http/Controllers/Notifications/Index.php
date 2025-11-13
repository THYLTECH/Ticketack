<?php

// app/Http/Controllers/Notifications/Index.php

namespace App\Http\Controllers\Notifications;

// Necessary imports
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Notifications\DatabaseNotification;

// Requests
use App\Http\Requests\Notifications\Search as RequestsSearch;
use App\Http\Requests\Notifications\Many as RequestsMany;

/**
 * Class Index
 * 
 * Controller for managing user notifications.
 * 
 * @package App\Http\Controllers\Notifications
 */
class Index extends Controller
{
    /**
     * Display a listing of the user's notifications.
     */
    public function index(RequestsSearch $request) {

        $data = $request->validated();

        if($data['search'] ?? false) {
            $notifications = Auth::user()->notifications()
                ->where('data->message', 'like', '%' . $data['search'] . '%')
                ->orwhere('data->title', 'like', '%' . $data['search'] . '%')
                ->orwhere('data->type', 'like', '%' . __($data['search']) . '%')
                ->paginate(20);
        } else {
            $notifications = Auth::user()->notifications()->paginate(20);
        }

        $total_notifications = Auth::user()->notifications()->count();

        return Inertia::render('notifications/index', [
            'notifications' => $notifications,
            'search' => $data['search'] ?? null,
            'total_notifications' => $total_notifications,
        ]);
    }

    /**
     * Mark a specific notification as read.
     * 
     * @param \Illuminate\Notifications\DatabaseNotification $notification
     */
    public function markAsRead(DatabaseNotification $notification) {

        if ($notification->notifiable_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $notification->markAsRead();

        return redirect()->back()->with(['success' => 'Notification marked as read.']);
    }

    /**
     * Mark many notifications as read
     * 
     * @param \App\Http\Requests\Notifications\Many $request
     */
    public function markManyAsRead(RequestsMany $request) {
        $data = $request->validated();

        foreach($data['ids'] as $notification) {

            $notification = DatabaseNotification::find($notification);

            if( !$notification ) continue;

            if ( $notification->notifiable_id !== Auth::id() ) continue;

            $notification->markAsRead();
        }

        return redirect()->back()->with(['success' => count($data['ids']) . ' notifications marked as read.']);
    }

    /**
     * Delete a specific notification.
     * 
     * @param \Illuminate\Notifications\DatabaseNotification $notification
     */
    public function destroy(DatabaseNotification $notification) {

        if ($notification->notifiable_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $notification->delete();

        return redirect()->back()->with(['success' => 'Notification deleted successfully.']);
    }

    /**
     * Delete many notifications
     * 
     * @param \App\Http\Requests\Notifications\Many $request
     */
    public function destroyMany(RequestsMany $request) {
        $data = $request->validated();

        foreach($data['ids'] as $notification) {
            $notification = DatabaseNotification::find($notification);

            if( !$notification ) continue;

            if ( $notification->notifiable_id !== Auth::id() ) continue;

            $notification->delete();
        }

        return redirect()->back()->with(['success' => count($data['ids']) . ' notifications deleted successfully.']);
    }
}

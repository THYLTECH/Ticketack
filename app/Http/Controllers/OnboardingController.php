<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class OnboardingController extends Controller
{
    /**
     * List of valid onboarding pages.
     */
    private const ONBOARDING_PAGES = [
        'welcome',
        'home',
        'tickets',
        'ticket_detail',
        'create_ticket',
        'notifications',
        'settings',
        'settings_appearance',
        'settings_notifications',
        'archived_tickets',
        'planning',
        'time_entries',
        'knowledge',
        'assignment',
        'assets',
        'users',
        'roles',
        'trash',
    ];

    public function markPageSeen(Request $request): RedirectResponse
    {
        $request->validate([
            'page' => 'required|string|in:' . implode(',', self::ONBOARDING_PAGES),
        ]);

        $user = $request->user();
        $state = $user->onboarding_state ?? [];
        $state[$request->page] = true;
        
        $user->update([
            'onboarding_state' => $state,
        ]);

        return back();
    }

    public function skipAll(Request $request): RedirectResponse
    {
        $user = $request->user();
        
        $user->update([
            'onboarding_state' => array_fill_keys(self::ONBOARDING_PAGES, true),
        ]);

        return back();
    }

    public function reset(Request $request): RedirectResponse
    {
        $user = $request->user();
        
        $user->update([
            'onboarding_state' => null,
        ]);

        return back();
    }
}


<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Display the user's profile page with all sections.
     */
    public function show(Request $request): Response
    {
        $user = $request->user();
        
        return Inertia::render('Perfil', [
            'auth' => [
                'user' => $user
            ],
            'user' => $user,
            'talleres' => $user->talleres()->with('taller')->get(),
            'compras' => $user->compras()->with('producto')->get(),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.show')->with('status', 'success');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    /**
     * Show user's workshops.
     */
    public function talleres(Request $request): Response
    {
        $talleres = $request->user()->talleres()
            ->with('taller')
            ->latest()
            ->paginate(10);

        return Inertia::render('Profile/Talleres', [
            'talleres' => $talleres,
        ]);
    }

    /**
     * Show user's purchases.
     */
    public function compras(Request $request): Response
    {
        $compras = $request->user()->compras()
            ->with('producto')
            ->latest()
            ->paginate(10);

        return Inertia::render('Profile/Compras', [
            'compras' => $compras,
        ]);
    }
}
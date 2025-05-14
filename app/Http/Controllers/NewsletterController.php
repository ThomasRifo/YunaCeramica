<?php

namespace App\Http\Controllers;

use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Mail\NewsletterConfirmation;

class NewsletterController extends Controller
{
    public function subscribe(Request $request)
    {
        // Honeypot: si el campo 'website' viene lleno, es spam
        if ($request->filled('website')) {
            return response()->json(['message' => 'Solicitud rechazada.'], 422);
        }

        $request->validate([
            'email' => 'required|email|unique:newsletter_subscribers,email'
        ], [
            'email.unique' => 'Este correo electrónico ya está suscrito a nuestro newsletter.'
        ]);

        try {
            $subscriber = NewsletterSubscriber::create([
                'email' => $request->email,
                'activo' => true
            ]);

            // Enviar email de confirmación
            Mail::to($subscriber->email)->send(new NewsletterConfirmation($subscriber));

            return response()->json([
                'message' => '¡Gracias por suscribirte! Te hemos enviado un email de confirmación.'
            ]);
        } catch (\Exception $e) {
            Log::error('Error al enviar email de newsletter: ' . $e->getMessage());
            return response()->json([
                'message' => 'Hubo un error al enviar el email de confirmación. Por favor, intenta nuevamente.'
            ], 500);
        }
    }

    public function unsubscribe($token)
    {
        try {
            $subscriber = NewsletterSubscriber::where('token_unsubscribe', $token)->firstOrFail();
            $subscriber->update(['activo' => false]);
            
            Log::info('Newsletter cancelado exitosamente', ['email' => $subscriber->email]);
            return view('newsletter.unsubscribed');
        } catch (\Exception $e) {
            Log::error('Error al cancelar newsletter: ' . $e->getMessage());
            return response()->view('newsletter.invalid', [], 404);
        }
    }

    public function verify($token)
    {
        try {
            $subscriber = NewsletterSubscriber::where('token_unsubscribe', $token)->firstOrFail();
            $subscriber->update(['email_verified_at' => now()]);
            
            Log::info('Newsletter verificado exitosamente', ['email' => $subscriber->email]);
            return view('newsletter.verified');
        } catch (\Exception $e) {
            Log::error('Error al verificar newsletter: ' . $e->getMessage());
            return response()->view('newsletter.invalid', [], 404);
        }
    }
} 
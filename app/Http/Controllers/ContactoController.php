<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class ContactoController extends Controller
{
    public function enviar(Request $request)
    {
        try {
            $validated = $request->validate([
                'nombre' => 'required|string|max:100',
                'apellido' => 'required|string|max:100',
                'email' => 'required|email',
                'consulta' => 'required|string|max:2000',
            ]);

            // Enviar email usando SMTP
            Mail::send('emails.contacto', $validated, function ($message) use ($validated) {
                $message->from($validated['email'], $validated['nombre'] . ' ' . $validated['apellido'])
                    ->to('info@yunaceramica.com')
                    ->subject('Nuevo mensaje de contacto');
            });

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            Log::error('Error al enviar email de contacto', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'data' => $request->all()
            ]);
            
            return response()->json([
                'success' => false, 
                'message' => 'Error al enviar el mensaje. Por favor, intenta nuevamente más tarde.'
            ], 500);
        }
    }
} 
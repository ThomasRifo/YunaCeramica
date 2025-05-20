<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactoController extends Controller
{
    public function enviar(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100',
            'apellido' => 'required|string|max:100',
            'email' => 'required|email',
            'consulta' => 'required|string|max:2000',
        ]);

        // Enviar email
        Mail::send([], [], function ($message) use ($validated) {
            $message->to('yunaceramica@gmail.com')
                ->subject('Nuevo mensaje de contacto')
                ->setBody(
                    '<h2>Nuevo mensaje de contacto</h2>' .
                    '<p><strong>Nombre:</strong> ' . e($validated['nombre']) . '</p>' .
                    '<p><strong>Apellido:</strong> ' . e($validated['apellido']) . '</p>' .
                    '<p><strong>Email:</strong> ' . e($validated['email']) . '</p>' .
                    '<p><strong>Consulta:</strong><br>' . nl2br(e($validated['consulta'])) . '</p>',
                    'text/html'
                );
        });

        return response()->json(['success' => true]);
    }
} 
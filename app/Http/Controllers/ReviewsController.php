<?php

namespace App\Http\Controllers;

use App\Models\Reviews;
use App\Models\ReviewInvite;
use App\Models\TallerCliente;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ReviewsController extends Controller
{
    public function index(Request $request)
    {
        $taller = $request->input('taller'); // filtro opcional por nombre de taller

        $query = Reviews::where('habilitada', true);

        if ($taller) {
            $query->where('taller', $taller);
        }

        $reviews = $query->orderBy('fecha_publicacion', 'desc')->get();

        return Inertia::render('Talleres/Reviews', [
            'reviews' => $reviews,
        ]);
    }

    public function showInviteForm($token)
    {
        $invite = ReviewInvite::where('token', $token)->first();
        if (!$invite) {
            return Inertia::render('Talleres/ReviewExpired', [
                'reason' => 'invalid',
            ]);
        }

        if ($invite->used_at || ($invite->expires_at && $invite->expires_at->isPast())) {
            return Inertia::render('Talleres/ReviewExpired', [
                'reason' => $invite->used_at ? 'used' : 'expired',
            ]);
        }

        $tallerCliente = TallerCliente::with('taller')->findOrFail($invite->idTallerCliente);

        $rawName = trim($invite->nombre ?? '');
        $firstName = $rawName !== '' ? preg_split('/\s+/', $rawName)[0] : '';

        return Inertia::render('Talleres/ReviewForm', [
            'token' => $token,
            'nombre' => $firstName,
            'email' => $invite->email,
            'taller' => $tallerCliente->taller->nombre,
        ]);
    }

    public function submit(Request $request)
    {
        $data = $request->validate([
            'token' => 'required|string',
            'mensaje' => 'required|string|max:2000',
        ]);

        $invite = ReviewInvite::where('token', $data['token'])->first();
        if (!$invite || $invite->used_at || ($invite->expires_at && $invite->expires_at->isPast())) {
            throw ValidationException::withMessages([
                'token' => ['El enlace ya no es válido.']
            ]);
        }

        $tallerCliente = TallerCliente::with('taller')->findOrFail($invite->idTallerCliente);

        $fullName = trim($invite->nombre ?? '');
        $parts = $fullName !== '' ? preg_split('/\s+/', $fullName) : [];
        $firstName = $parts[0] ?? '';
        $lastName = trim(implode(' ', array_slice($parts, 1)));

        // Intentar crear la reseña; si ya existe por unique (idTallerCliente,email) devolver 422 amigable
        try {
            $review = Reviews::create([
                'idTallerCliente' => $tallerCliente->id,
                'nombre' => $firstName,
                'apellido' => $lastName,
                'taller' => $tallerCliente->taller->nombre,
                'valoracion' => 5,
                'mensaje' => $data['mensaje'],
                'habilitada' => false,
                'fecha_publicacion' => now(),
                'email' => $invite->email,
            ]);
        } catch (\Illuminate\Database\QueryException $e) {
            // Código 23000 es violación de restricción (unique) en MySQL
            if (isset($e->errorInfo[0]) && $e->errorInfo[0] === '23000') {
                throw ValidationException::withMessages([
                    'token' => ['Ya registramos una reseña con este correo. Disculpá las molestias.']
                ]);
            }
            throw $e;
        }

        $invite->used_at = now();
        $invite->save();

        return redirect()->route('talleres')->with('success', '¡Gracias! Tu reseña se envió correctamente.');
    }
}
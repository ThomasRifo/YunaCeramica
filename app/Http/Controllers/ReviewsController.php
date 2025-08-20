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

    public function indexDashboard()
    {
        $pendingReviews = Reviews::where('habilitada', false)->orderBy('fecha_publicacion', 'desc')->get();
        $enabledReviews = Reviews::where('habilitada', true)->orderBy('fecha_publicacion', 'desc')->get();
        
        return Inertia::render('Dashboard/Reviews/Index', [
            'pendingReviews' => $pendingReviews,
            'enabledReviews' => $enabledReviews
        ]);
    }

    public function indexEnabledDashboard()
    {
        $reviews = Reviews::where('habilitada', true)->orderBy('fecha_publicacion', 'desc')->get();
        
        return Inertia::render('Dashboard/Reviews/Index', [
            'enabledReviews' => $reviews
        ]);
    }

    /**
     * Cambiar el estado de habilitación de una reseña (habilitar/deshabilitar)
     */
    public function toggleStatus($id)
    {
        try {
            $review = Reviews::findOrFail($id);
            
            // Cambiar el estado actual
            $newStatus = !$review->habilitada;
            $review->update(['habilitada' => $newStatus]);
            
            $message = $newStatus 
                ? 'Reseña habilitada correctamente' 
                : 'Reseña deshabilitada correctamente';
            
            return response()->json([
                'success' => true,
                'message' => $message,
                'habilitada' => $newStatus
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cambiar el estado de la reseña'
            ], 500);
        }
    }

    /**
     * Habilitar una reseña específica
     */
    public function enable($id)
    {
        try {
            $review = Reviews::findOrFail($id);
            $review->update(['habilitada' => true]);
            
            return response()->json([
                'success' => true,
                'message' => 'Reseña habilitada correctamente',
                'habilitada' => true
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al habilitar la reseña'
            ], 500);
        }
    }

    /**
     * Deshabilitar una reseña específica
     */
    public function disable($id)
    {
        try {
            $review = Reviews::findOrFail($id);
            $review->update(['habilitada' => false]);
            
            return response()->json([
                'success' => true,
                'message' => 'Reseña deshabilitada correctamente',
                'habilitada' => false
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al deshabilitar la reseña'
            ], 500);
        }
    }

    /**
     * Eliminar una reseña permanentemente
     */
    public function delete($id)
    {
        try {
            $review = Reviews::findOrFail($id);
            $review->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Reseña eliminada correctamente'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar la reseña'
            ], 500);
        }
    }

    /**
     * Función legacy para compatibilidad (mantener por si acaso)
     */
    public function approve($id)
    {
        return $this->toggleStatus($id);
    }
}
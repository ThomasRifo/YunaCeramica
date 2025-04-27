<?php

namespace App\Http\Controllers;

use App\Models\Reviews;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
}
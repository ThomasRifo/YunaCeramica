<?php

namespace App\Http\Controllers;

use App\Models\Subcategoria;
use Illuminate\Http\Request;

class SubcategoriaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $subcategorias = \App\Models\Subcategoria::with(['categoria', 'imagenes' => function($q) {
            $q->orderBy('orden', 'asc');
        }])->get();

        // Mapear para traer solo la imagen de menor orden
        $subcategorias = $subcategorias->map(function($subcat) {
            $subcat->imagen_url = $subcat->imagenes->first()->urlImagen ?? null;
            $subcat->categoria_nombre = $subcat->categoria->nombre ?? null;
            return $subcat;
        });

        return inertia('Dashboard/Categorias/Index', [
            'subcategorias' => $subcategorias,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Subcategoria $subcategoria)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Subcategoria $subcategoria)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Subcategoria $subcategoria)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Subcategoria $subcategoria)
    {
        //
    }
}

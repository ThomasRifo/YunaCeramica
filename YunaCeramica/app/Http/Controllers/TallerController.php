<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Taller;
use Inertia\Inertia;

class TallerController extends Controller
{
    public function index()
    {
        $talleres = Taller::select([
            'id',
            'idSubcategoria',
            'nombre',
            'descripcion',
            'fecha',
            'cupoMaximo',
            'precio',
            'ubicacion',
            'activo',
            'cantInscriptos'
        ])->get();
    
        return Inertia::render('Dashboard/Talleres', [
            'talleres' => $talleres,
        ]);
    }

    public function create()
    {
        return inertia('Dashboard/Talleres/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            // otros campos
        ]);

        Taller::create($request->all());

        return redirect()->route('dashboard.talleres.index')->with('success', 'Taller creado correctamente.');
    }

    public function edit($id)
    {
        $taller = Taller::findOrFail($id);
        return inertia('Dashboard/Talleres/Edit', ['taller' => $taller]);
    }

    public function update(Request $request, $id)
    {
        $taller = Taller::findOrFail($id);
        $taller->update($request->all());

        return redirect()->route('dashboard.talleres.index')->with('success', 'Taller actualizado correctamente.');
    }

    public function destroy($id)
    {
        $taller = Taller::findOrFail($id);
        $taller->delete();

        return redirect()->route('dashboard.talleres.index')->with('success', 'Taller eliminado correctamente.');
    }
}
<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Acompaniante;
use App\Models\Subcategoria;
use Illuminate\Http\Request;
use App\Models\Taller;
use App\Models\TallerCliente;
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
            'hora',
            'cupoMaximo',
            'precio',
            'ubicacion',
            'activo',
            'cantInscriptos'
        ])
        ->where('activo', true)
        ->get();
    
        return Inertia::render('Dashboard/Talleres/Index', [
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
    $subcategorias = Subcategoria::where('idCategoria', 2)->get(['id', 'nombre']);
    return Inertia::render('Dashboard/Talleres/Edit', [
        'taller' => $taller,
        'subcategorias' => $subcategorias,
        'title' => 'Editar Taller',
        'breadcrumbs' => [
            ['label' => 'Dashboard', 'href' => '/dashboard'],
            ['label' => 'Talleres', 'href' => '/dashboard/talleres'],
            ['label' => 'Editar taller'], // sin href si es el actual
        ],
    ]);
}

public function update(Request $request, $id)
{
    $taller = Taller::findOrFail($id);

    $validated = $request->validate([
        'nombre'         => 'required|string|max:255',
        'descripcion'    => 'nullable|string',
        'fecha'          => 'required|date_format:Y-m-d',
        'hora'           => 'required',
        'precio'         => 'required|numeric',
        'cupoMaximo'     => 'required|integer|min:0',
        'ubicacion'      => 'required|string|max:255',
        'idSubcategoria' => 'required|exists:subcategorias,id',
    ]);

    $taller->update($validated);

    return redirect()->route('dashboard.talleres.index')->with('success', 'Taller actualizado correctamente');
}

    public function destroy($id)
    {
        $taller = Taller::findOrFail($id);
        $taller->delete();

        return redirect()->route('dashboard.talleres.index')->with('success', 'Taller eliminado correctamente.');
    }

    public function desactivar($id)
{
    $taller = Taller::findOrFail($id);
    $taller->activo = false;
    $taller->save();

    return redirect()->route('dashboard.talleres.index')->with('success', 'Taller desactivado correctamente.');
}

public function subcategorias(Taller $taller)
{
    $subcategorias = Subcategoria::where('idCategoria', 2)->get(['id', 'nombre']);
    
    return Inertia::render('Talleres/Edit', [
        'taller' => $taller,
        'subcategorias' => $subcategorias,
    ]);
}




public function view($id)
{
    $taller = Taller::with([
        'tallerClientes.menu',
        'tallerClientes.estadoPago',
        'tallerClientes.cliente',
        'tallerClientes.acompaniantes.menu'])->findOrFail($id);
    // 🔹 TallerClientes con User (cliente), Menu elegido, Estado de pago
    $tallerClientes = TallerCliente::with(['cliente', 'menu', 'estadoPago'])
        ->where('idTaller', $id)
        ->get();

    // 🔹 Acompañantes de clientes con pago grupal
    $acompaniantes = Acompaniante::with('menu') // trae también el menú elegido por el acompañante
        ->whereIn('idTallerCliente', function ($query) use ($id) {
            $query->select('id')
                  ->from('taller_clientes')
                  ->where('idTaller', $id)
                  ->where('pagoGrupal', true);
        })
        ->get();

    return Inertia::render('Dashboard/Talleres/View', [
        'taller' => $taller,
        'tallerClientes' => $tallerClientes,
        'acompaniantes' => $acompaniantes,
    ]);
}
}
<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Acompaniante;
use App\Models\ImagenTaller;
use App\Models\Menu;
use App\Models\Reviews;
use App\Models\Subcategoria;
use Illuminate\Http\Request;
use App\Models\Taller;
use App\Models\TallerCliente;
use Illuminate\Container\Attributes\Log;
use Illuminate\Support\Facades\Log as FacadesLog;
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
        // Solo subcategorías que pertenezcan a la categoría Talleres
        $subcategorias = Subcategoria::where('idCategoria', 2)->get();
        $menu = Menu::all();
    
        return inertia('Dashboard/Talleres/Create', [
            'subcategorias' => $subcategorias,
            'menus' => $menu,
        ]);
    }
    
    public function store(Request $request)
    {

        // Validación de los datos de entrada
        $validated = $request->validate([
            'nombre'         => 'required|string|max:255',
            'descripcion'    => 'nullable|string',
            'fecha'          => 'required|date',
            'hora'           => 'required|date_format:H:i',
            'precio'         => 'required|numeric|min:0',
            'cupoMaximo'     => 'required|integer|min:1',
            'ubicacion'      => 'required|string|max:255',
            'idSubcategoria' => 'required|exists:subcategorias,id',
            'menus' => 'nullable|array',
            'menus.*' => 'nullable|integer|exists:menus,id',
        ]);

        $taller = Taller::create([
            'nombre' => $validated['nombre'],
            'descripcion' => $validated['descripcion'],
            'fecha' => $validated['fecha'],
            'hora' => $validated['hora'],
            'precio' => $validated['precio'],
            'cupoMaximo' => $validated['cupoMaximo'],
            'ubicacion' => $validated['ubicacion'],
            'idSubcategoria' => $validated['idSubcategoria'],
        ]);

        $taller->menus()->sync($validated['menus']);
    
        // Sincronizar los menús con el taller, si es que se seleccionaron
        if (isset($validated['menus']) && count($validated['menus']) > 0) {
            $taller->menus()->sync($validated['menus']);
        }
    
        // Redirigir con un mensaje de éxito
        return redirect()->route('dashboard.talleres.index')->with('success', 'Taller creado correctamente.');
    }
    

    public function edit($id)
    {
        $taller = Taller::with('menus:id')->findOrFail($id);
        $subcategorias = Subcategoria::where('idCategoria', 2)->get(['id', 'nombre']);
        $menus = Menu::all(['id', 'nombre']); // o los campos que quieras mostrar en el select
    
        return Inertia::render('Dashboard/Talleres/Edit', [
            'taller' => $taller,
            'subcategorias' => $subcategorias,
            'menus' => $menus,
            'selectedMenus' => $taller->menus->pluck('id'),
            'title' => 'Editar Taller',
            'breadcrumbs' => [
                ['label' => 'Dashboard', 'href' => '/dashboard'],
                ['label' => 'Talleres', 'href' => '/dashboard/talleres'],
                ['label' => 'Editar taller'],
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
        'hora'           => 'required|date_format:H:i',
        'precio'         => 'required|numeric',
        'cupoMaximo'     => 'required|integer|min:0',
        'ubicacion'      => 'required|string|max:255',
        'idSubcategoria' => 'required|exists:subcategorias,id',
        'menus'          => 'nullable|array',
        'menus.*'        => 'exists:menus,id',
    ]);

    $taller->update($validated);

    if ($request->has('menus')) {
        $taller->menus()->sync($validated['menus'] ?? []);
    }

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
        'tallerClientes.acompaniantes.menu'
    ])->findOrFail($id);

    // 🔹 TallerClientes con User (cliente), Menu elegido, Estado de pago
    $tallerClientes = TallerCliente::with(['cliente', 'menu', 'estadoPago'])
        ->where('idTaller', $id)
        ->get(['id', 'idTaller', 'idCliente', 'idMenu', 'idEstadoPago', 'pagoGrupal', 'cantPersonas', 'referido']);

    // 🔹 Acompañantes de clientes con pago grupal
    $acompaniantes = Acompaniante::with('menu')
        ->whereIn('idTallerCliente', function ($query) use ($id) {
            $query->select('id')
                  ->from('taller_clientes')
                  ->where('idTaller', $id)
                  ->where('pagoGrupal', true);
        })
        ->get(['id', 'idTallerCliente', 'nombre', 'apellido', 'telefono', 'email', 'idMenu']);

    return Inertia::render('Dashboard/Talleres/View', [
        'taller' => $taller,
        'tallerClientes' => $tallerClientes,
        'acompaniantes' => $acompaniantes,
    ]);
}


public function talleresClient()
{
    $reviews = Reviews::where('habilitada', 1)
    ->whereNotNull('fecha_publicacion')
    ->orderBy('fecha_publicacion', 'desc')
    ->take(20) // Trae solo las 10 más nuevas
    ->get();
    $talleres = Taller::where('activo', true)
        ->orderBy('fecha', 'asc')
        ->get(['id', 'nombre', 'descripcion', 'fecha', 'hora', 'ubicacion', 'precio']);

    return Inertia::render('Talleres/Index', [
        'talleres' => $talleres,
        'reviews' => $reviews,
    ]);
}


public function tallerView()
{
    // Obtenemos la parte final de la URL
    $url = request()->path();

    // Definimos ID de subcategoría basado en la URL
    $subcategoriaId = null;
    $slug = null;

    if ($url === 'talleres-ceramica-y-gin') {
        $subcategoriaId = 1;
        $slug = 'ceramica-y-gin';
    } elseif ($url === 'talleres-ceramica-y-cafe') {
        $subcategoriaId = 2;
        $slug = 'ceramica-y-cafe';
    } else {
        abort(404, 'Taller no encontrado');
    }

    // Buscamos el taller más reciente que cumpla condiciones
    $taller = Taller::where('activo', true)
        ->where('idSubcategoria', $subcategoriaId)
        ->orderBy('created_at', 'desc')
        ->first();

    if (!$taller) {
        abort(404, 'Taller no disponible');
    }

    // Traemos las imágenes asociadas al slug
    $imagenes = ImagenTaller::where('slug', $slug)
        ->orderBy('orden')
        ->get();

    return Inertia::render('Talleres/TallerView', [
        'taller' => $taller,
        'imagenes' => $imagenes,
    ]);
}


}
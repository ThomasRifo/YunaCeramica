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
use Illuminate\Support\Facades\DB;
use App\Mail\TransferenciaTaller;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use App\Mail\ConfirmacionInscripcionTaller;
use Barryvdh\DomPDF\Facade\Pdf;

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
        $taller = Taller::with(['menus' => function($query) {
            $query->select('menus.id', 'menus.nombre')->withPivot('html');
        }])->findOrFail($id);
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
    
        // Generar y agregar el slug
    
        // Actualizar taller
        $taller->update($validated);
    
        // Sincronizar menús
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
        'tallerClientes.acompaniantes.menu',
        'tallerClientes.metodoPago'
    ])->findOrFail($id);

    // Traer todos los tallerClientes con sus relaciones
    $tallerClientes = TallerCliente::with(['menu', 'estadoPago', 'acompaniantes.menu', 'metodoPago'])
        ->where('idTaller', $id)
        ->get();

    // Separar en pagados/parciales y pendientes
    $tallerClientesPagados = $tallerClientes->filter(function($tc) {
        return in_array($tc->idEstadoPago, [2, 3]); // 2 = pago parcial, 3 = pagado
    })->values()->all();

    $tallerClientesPendientes = $tallerClientes->filter(function($tc) {
        return $tc->idEstadoPago === 1; // 1 = pendiente
    })->values()->all();

    return Inertia::render('Dashboard/Talleres/View', [
        'taller' => $taller,
        'tallerClientesPagados' => $tallerClientesPagados,
        'tallerClientesPendientes' => $tallerClientesPendientes,
    ]);
}


public function talleresClient()
{
    $reviews = Reviews::where('habilitada', 1)
        ->whereNotNull('fecha_publicacion')
        ->orderBy('fecha_publicacion', 'desc')
        ->take(20)
        ->get();

    // Obtener talleres activos
    $talleres = Taller::where('activo', true)
        ->orderBy('fecha', 'asc')
        ->get(['id', 'nombre', 'descripcion', 'fecha', 'hora', 'ubicacion', 'precio', 'idSubcategoria', 'cupoMaximo', 'cantInscriptos']);

    // Verificar talleres futuros por tipo
    $ceramicaYCafeFuturos = Taller::where('activo', true)
        ->where('idSubcategoria', 2) // ID de Cerámica y Café
        ->where('fecha', '>=', now()->startOfDay())
        ->exists();

    $ceramicaYGinFuturos = Taller::where('activo', true)
        ->where('idSubcategoria', 1) // ID de Cerámica y Gin
        ->where('fecha', '>=', now()->startOfDay())
        ->exists();

    // Determinar el estado de cada tipo de taller
    $estadoTalleres = [
        'ceramicaYCafe' => 'disponible',
        'ceramicaYCafeFuturos' => $ceramicaYCafeFuturos,
        'ceramicaYGin' => 'disponible',
        'ceramicaYGinFuturos' => $ceramicaYGinFuturos
    ];

    $archivos = Storage::disk('public')->files('piezas/realizadas');
    $imagenesPiezas = collect($archivos)
        ->map(function($file) {
            return asset('storage/' . $file);
        })
        ->values()
        ->toArray();

    // Verificar cupos llenos para Cerámica y Café
    $tallerCafe = Taller::where('activo', true)
        ->where('idSubcategoria', 2)
        ->orderBy('created_at', 'desc')
        ->first();
    
    if ($tallerCafe && $tallerCafe->cantInscriptos >= $tallerCafe->cupoMaximo) {
        $estadoTalleres['ceramicaYCafe'] = 'cupo_lleno';
    }

    // Verificar cupos llenos para Cerámica y Gin
    $tallerGin = Taller::where('activo', true)
        ->where('idSubcategoria', 1)
        ->orderBy('created_at', 'desc')
        ->first();
    
    if ($tallerGin && $tallerGin->cantInscriptos >= $tallerGin->cupoMaximo) {
        $estadoTalleres['ceramicaYGin'] = 'cupo_lleno';
    }

    return Inertia::render('Talleres/Index', [
        'talleres' => $estadoTalleres,
        'reviews' => $reviews,
        'imagenesPiezas' => $imagenesPiezas, //pintadas
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
    $taller = Taller::with('subcategoria')
    ->where('activo', true)
        ->where('idSubcategoria', $subcategoriaId)
        ->orderBy('fecha', 'desc')
        ->first();

    if (!$taller) {
        abort(404, 'Taller no disponible');
    }

    // Traemos las imágenes asociadas al slug
    $imagenes = ImagenTaller::where('slug', $slug)
        ->orderBy('orden')
        ->get();

    $archivos = Storage::disk('public')->files('piezas/parapintar');
    $imagenesPiezas = collect($archivos)
        ->map(function($file) {
            return asset('storage/' . $file);
        })
        ->values()
        ->toArray();


    return Inertia::render('Talleres/TallerView', [
        'taller' => $taller,
        'imagenes' => $imagenes,
        'slug' => $slug,
        'imagenesPiezas' => $imagenesPiezas,
    ]);
}
public function formInscripcion($slug)
{
    $taller = Taller::with([
        'menus' => function ($query) {
            $query->select('menus.id', 'menus.nombre')
                  ->withPivot('html');
        },
        'subcategoria:id,nombre,url'
    ])
    ->select([
        'id',
        'nombre',
        'fecha',
        'hora',
        'precio',
        'ubicacion',
        'cupoMaximo',
        'cantInscriptos'
    ])
    ->where('activo', true)
    ->orderBy('fecha', 'desc')
    ->whereHas('subcategoria', function ($query) use ($slug) {
        $query->where('url', $slug);
    })
    ->firstOrFail();

    return Inertia::render('Talleres/FormInscripcion', [
        'taller' => $taller,
        'slug' => $slug
    ]);
}



public function updateMenusHtml(Request $request, $id)
{
   


        $taller = Taller::findOrFail($id);

        $request->validate([
            'menus' => 'required|array',
            'menus.*.id' => 'required|exists:menus,id',
            'menus.*.html' => 'nullable|string',
        ]);

       

        foreach ($request->menus as $menu) {
           
            
            $taller->menus()->updateExistingPivot($menu['id'], [
                'html' => $menu['html'] ?? '',
            ]);
        }

        return response()->json(['message' => 'Contenido de menús actualizado correctamente.']);
 
        return response()->json(['error' => 'Error al actualizar los menús: ' . $e->getMessage()], 500);
    }

    /**
     * Actualiza el estado de pago de varios taller_clientes a la vez.
     */
    public function actualizarEstadosPagoMasivo(Request $request)
    {
        try {
            $data = $request->validate([
                'cambios' => 'required|array',
                'cambios.*.id' => 'required|integer|exists:taller_clientes,id',
                'cambios.*.nuevoEstado' => 'required|integer|exists:estados_pago,id',
            ]);

            DB::beginTransaction();
            $resultados = [];

            if (!empty($data['cambios'])) {
                $primerTC = \App\Models\TallerCliente::find($data['cambios'][0]['id']);
                if ($primerTC) {
                    $taller = $primerTC->taller;
                    
                    // Para cada cambio, actualizamos el estado y ajustamos cantInscriptos
                    foreach ($data['cambios'] as $cambio) {
                        $tc = \App\Models\TallerCliente::find($cambio['id']);
                        
                        if ($tc) {
                            $estadoAnterior = $tc->idEstadoPago;
                            $nuevoEstado = $cambio['nuevoEstado'];
                            
                            // Actualizar el estado
                            $tc->idEstadoPago = $nuevoEstado;
                            $tc->save();
                            
                            // Ajustar cantInscriptos según los estados
                            if (in_array($estadoAnterior, [2, 3]) && !in_array($nuevoEstado, [2, 3])) {
                                $taller->decrement('cantInscriptos', $tc->cantPersonas);
                            } else if (!in_array($estadoAnterior, [2, 3]) && in_array($nuevoEstado, [2, 3])) {
                                $taller->increment('cantInscriptos', $tc->cantPersonas);

                                // Enviar mail solo si pasa a pagado parcial o total
                                $tipo = $nuevoEstado == 2 ? 'reserva' : 'total';
                                $textoExtra = null; // Puedes personalizarlo si quieres

                                Mail::to($tc->email_cliente)->send(
                                    new ConfirmacionInscripcionTaller(
                                        $taller,
                                        [
                                            'nombre' => $tc->nombre_cliente,
                                            'apellido' => $tc->apellido_cliente,
                                        ],
                                        $tipo,
                                        $textoExtra
                                    )
                                );
                            }
                            
                            $resultados[] = [
                                'id' => $tc->id,
                                'nombre' => $tc->nombre_cliente,
                                'apellido' => $tc->apellido_cliente,
                                'email' => $tc->email_cliente,
                                'nuevoEstado' => $tc->idEstadoPago,
                            ];
                        }
                    }
                    
                    $taller->save();
                }
            }

            DB::commit();
            return response()->json([
                'success' => true,
                'resultados' => $resultados,
                'taller' => [
                    'id' => $taller->id,
                    'cantInscriptos' => $taller->cantInscriptos
                ]
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false, 
                'error' => 'Error de validación',
                'message' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false, 
                'error' => 'Error interno del servidor',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function procesarTransferencia(Request $request)
    {
        $request->validate([
            'tallerId' => 'required|exists:talleres,id',
            'nombre' => 'required|string',
            'apellido' => 'required|string',
            'email' => 'required|email',
            'telefono' => 'nullable|string',
            'cantidadPersonas' => 'required|integer|min:1',
            'esReserva' => 'required|boolean',
            'menu_id' => 'required|exists:menus,id',
            'participantes' => 'nullable|array',
            'participantes.*.nombre' => 'required|string',
            'participantes.*.apellido' => 'required|string',
            'participantes.*.email' => 'nullable|email',
            'participantes.*.telefono' => 'nullable|string',
            'participantes.*.menu_id' => 'required|exists:menus,id',
            'referido' => 'nullable|string',
        ]);

        $taller = Taller::findOrFail($request->tallerId);

        // Generar código de referido único si no viene uno
        $codigoReferido = $request->input('referido') ?? strtoupper(substr(md5(uniqid()), 0, 8));

        // Crear el taller cliente con estado pendiente
        $tallerCliente = TallerCliente::create([
            'idTaller' => $taller->id,
            'nombre_cliente' => $request->nombre,
            'apellido_cliente' => $request->apellido,
            'email_cliente' => $request->email,
            'telefono_cliente' => $request->telefono,
            'cantPersonas' => $request->cantidadPersonas,
            'idEstadoPago' => 1, // 1 = Pendiente
            'idMenu' => $request->menu_id,
            'idMetodoPago' => 1, // 1 = Transferencia
            'fecha' => now(), // Fecha de inscripción
            'referido' => $codigoReferido,
        ]);

        // Enviar email con instrucciones
        if ($request->has('participantes') && count($request->participantes) > 1) {
            foreach ($request->participantes as $index => $participante) {
                if ($index === 0) continue; // El primero es el titular
                Acompaniante::create([
                    'idTallerCliente' => $tallerCliente->id,
                    'nombre' => $participante['nombre'],
                    'apellido' => $participante['apellido'],
                    'email' => $participante['email'],
                    'telefono' => $participante['telefono'] ?? null,
                    'idMenu' => $participante['menu_id'],
                ]);
            }
        }
        $linkReferido = url("/taller/{$taller->id}/referido/{$tallerCliente->referido}");
        Mail::to($request->email)->send(new TransferenciaTaller(
            $taller,
            [
                'nombre' => $request->nombre,
                'apellido' => $request->apellido,
            ],
            $request->cantidadPersonas,
            $request->esReserva,
            $linkReferido
        ));

        // RESPUESTA JSON
        return response()->json([
            'success' => true,
            'referido' => $codigoReferido,
        ]);
    }

    public function listaParticipantes($id)
    {
        $taller = Taller::with(['tallerClientes.acompaniantes', 'tallerClientes.menu'])->findOrFail($id);
        $participantes = collect();
        
        foreach ($taller->tallerClientes as $tc) {
            // Agregar el tallerCliente
            $participantes->push((object)[
                'id' => $tc->id,
                'nombre' => $tc->nombre_cliente,
                'apellido' => $tc->apellido_cliente,
                'email' => $tc->email_cliente,
                'telefono' => $tc->telefono_cliente,
                'menu' => $tc->menu,
                'idTallerCliente' => $tc->id
            ]);
            
            // Agregar los acompañantes
            foreach ($tc->acompaniantes as $acompaniante) {
                $participantes->push((object)[
                    'id' => $acompaniante->id,
                    'nombre' => $acompaniante->nombre,
                    'apellido' => $acompaniante->apellido,
                    'email' => $acompaniante->email,
                    'telefono' => $acompaniante->telefono,
                    'menu' => $acompaniante->menu,
                    'idTallerCliente' => $tc->id
                ]);
            }
        }
        
        return view('talleres.lista-participantes', compact('taller', 'participantes'));
    }

    public function descargarListaParticipantes($id)
    {
        $taller = Taller::with(['tallerClientes.acompaniantes', 'tallerClientes.menu'])->findOrFail($id);
        $participantes = collect();
        
        foreach ($taller->tallerClientes as $tc) {
            // Agregar el tallerCliente
            $participantes->push((object)[
                'id' => $tc->id,
                'nombre' => $tc->nombre_cliente,
                'apellido' => $tc->apellido_cliente,
                'email' => $tc->email_cliente,
                'telefono' => $tc->telefono_cliente,
                'menu' => $tc->menu,
                'idTallerCliente' => $tc->id
            ]);
            
            // Agregar los acompañantes
            foreach ($tc->acompaniantes as $acompaniante) {
                $participantes->push((object)[
                    'id' => $acompaniante->id,
                    'nombre' => $acompaniante->nombre,
                    'apellido' => $acompaniante->apellido,
                    'email' => $acompaniante->email,
                    'telefono' => $acompaniante->telefono,
                    'menu' => $acompaniante->menu,
                    'idTallerCliente' => $tc->id
                ]);
            }
        }
        
        $pdf = PDF::loadView('talleres.lista-participantes', compact('taller', 'participantes'));
        
        return $pdf->download('lista-participantes-' . $taller->nombre . '.pdf');
    }

    public function referido($id, $codigoReferido)
    {
        $taller = Taller::with([
            'menus' => function ($query) {
                $query->select('menus.id', 'menus.nombre')->withPivot('html');
            },
            'subcategoria:id,nombre,url'
        ])
        ->select([
            'id',
            'nombre',
            'fecha',
            'hora',
            'precio',
            'ubicacion',
            'cupoMaximo',
            'cantInscriptos',
            'idSubcategoria'
        ])
        ->findOrFail($id);

        $referidor = TallerCliente::where('idTaller', $id)
            ->where('referido', $codigoReferido)
            ->firstOrFail();

        return Inertia::render('Talleres/FormInscripcion', [
            'taller' => $taller,
            'referido' => $codigoReferido,
            'slug' => $taller->subcategoria->url ?? null,
        ]);
    }
}



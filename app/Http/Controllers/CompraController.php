<?php

namespace App\Http\Controllers;

use App\Models\Compra;
use App\Models\Producto;
use App\Models\DetalleCompra;
use App\Models\MetodoPago;
use App\Models\EstadoPago;
use App\Models\EstadoPedido;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Mail\InstruccionesPagoCompra;
use App\Mail\CompraEfectivo;
use App\Mail\ConfirmacionCompra;

class CompraController extends Controller
{
    /**
     * Mostrar página de checkout
     */
    public function checkout()
    {
        $carrito = Session::get('carrito', []);
        
        if (empty($carrito)) {
            return redirect()->route('carrito')->with('error', 'Tu carrito está vacío');
        }

        $productos = [];
        $subtotal = 0;

        foreach ($carrito as $item) {
            $producto = Producto::with('imagenes')
                ->where('id', $item['idProducto'])
                ->where('activo', true)
                ->first();

            if ($producto) {
                $cantidadDisponible = min($item['cantidad'], $producto->stock);
                
                $productos[] = [
                    'idProducto' => $producto->id,
                    'nombre' => $producto->nombre,
                    'precio' => $producto->precio,
                    'cantidad' => $cantidadDisponible,
                    'stock' => $producto->stock,
                    'imagen' => $producto->imagenes->first()?->urlImagen ?? null,
                    'slug' => $producto->slug,
                ];
                
                $subtotal += $producto->precio * $cantidadDisponible;
            }
        }

        // Obtener métodos de pago activos
        $metodosPago = MetodoPago::where('activo', true)->get(['id', 'nombre', 'descripcion']);

        // Obtener tipo de entrega y costo de envío de sessionStorage (se pasará desde el frontend)
        $tipoEntrega = request()->get('tipo_entrega', 'retiro');
        $costoEnvio = $tipoEntrega === 'envio' ? 5000 : 0; // TODO: Hacer configurable
        $total = $subtotal + $costoEnvio;

        return Inertia::render('Productos/Checkout', [
            'items' => $productos,
            'subtotal' => $subtotal,
            'costoEnvio' => $costoEnvio,
            'total' => $total,
            'tipoEntrega' => $tipoEntrega,
            'metodosPago' => $metodosPago,
            'cantidadItems' => count($productos),
        ]);
    }

    /**
     * Página de éxito de compra
     */
    public function success(Request $request)
    {
        $compraId = $request->get('compra_id');
        
        if (!$compraId) {
            return redirect()->route('productos')->with('error', 'No se encontró la compra');
        }

        $compra = Compra::with(['detalles.producto.imagenes', 'estado', 'estadoPago', 'metodoPago'])
            ->where('id', $compraId)
            ->where('idCliente', auth()->id())
            ->first();

        if (!$compra) {
            return redirect()->route('productos')->with('error', 'Compra no encontrada');
        }

        return Inertia::render('Productos/CompraSuccess', [
            'compra' => $compra,
        ]);
    }

    /**
     * Página de error de compra
     */
    public function failure(Request $request)
    {
        return Inertia::render('Productos/CompraFailure', [
            'mensaje' => $request->get('mensaje', 'Hubo un error al procesar tu pago.'),
        ]);
    }

    /**
     * Página de pago pendiente
     */
    public function pending(Request $request)
    {
        $compraId = $request->get('compra_id');
        
        if ($compraId) {
            $compra = Compra::with(['detalles.producto.imagenes', 'estado', 'estadoPago', 'metodoPago'])
                ->where('id', $compraId)
                ->where('idCliente', auth()->id())
                ->first();
        }

        return Inertia::render('Productos/CompraPending', [
            'compra' => $compra ?? null,
        ]);
    }

    /**
     * Listar compras del cliente autenticado
     */
    public function index()
    {
        $compras = Compra::with(['detalles.producto.imagenes', 'estado', 'estadoPago', 'metodoPago'])
            ->where('idCliente', auth()->id())
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Productos/MisCompras', [
            'compras' => $compras,
        ]);
    }

    /**
     * Listar todas las compras (admin)
     */
    public function indexAdmin(Request $request)
    {
        $query = Compra::with(['detalles.producto', 'cliente', 'estado', 'estadoPago', 'metodoPago']);

        // Filtros
        if ($request->has('estado_pago')) {
            $query->where('idEstadoPago', $request->estado_pago);
        }

        if ($request->has('estado_pedido')) {
            $query->where('idEstado', $request->estado_pedido);
        }

        if ($request->has('metodo_pago')) {
            $query->where('idMetodoPago', $request->metodo_pago);
        }

        $compras = $query->orderBy('created_at', 'desc')->paginate(20);

        return Inertia::render('Dashboard/Compras/Index', [
            'compras' => $compras,
            'filtros' => $request->only(['estado_pago', 'estado_pedido', 'metodo_pago']),
        ]);
    }

    /**
     * Ver detalle de compra (cliente)
     */
    public function show($id)
    {
        $compra = Compra::with(['detalles.producto.imagenes', 'estado', 'estadoPago', 'metodoPago'])
            ->where('id', $id)
            ->where('idCliente', auth()->id())
            ->firstOrFail();

        return Inertia::render('Productos/CompraDetalle', [
            'compra' => $compra,
        ]);
    }

    /**
     * Ver detalle de compra (admin)
     */
    public function showAdmin($id)
    {
        $compra = Compra::with(['detalles.producto.imagenes', 'cliente', 'estado', 'estadoPago', 'metodoPago'])
            ->findOrFail($id);

        return Inertia::render('Dashboard/Compras/Show', [
            'compra' => $compra,
        ]);
    }

    /**
     * Crear compra desde carrito (para transferencia y efectivo)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.idProducto' => 'required|exists:productos,id',
            'items.*.cantidad' => 'required|integer|min:1',
            'items.*.precioUnitario' => 'required|numeric|min:0',
            'datos_cliente' => 'required|array',
            'datos_cliente.nombre' => 'required|string|max:100',
            'datos_cliente.apellido' => 'required|string|max:100',
            'datos_cliente.email' => 'required|email|max:100',
            'datos_cliente.telefono' => 'nullable|string|max:20',
            'direccion' => 'required|array',
            'direccion.calle' => 'required|string|max:255',
            'direccion.numero' => 'required|integer',
            'direccion.ciudad' => 'required|string|max:100',
            'direccion.provincia' => 'required|string|max:100',
            'direccion.codigoPostal' => 'required|string|max:20',
            'direccion.piso' => 'nullable|string|max:50',
            'direccion.departamento' => 'nullable|string|max:50',
            'tipo_entrega' => 'required|in:envio,retiro',
            'costo_envio' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'observaciones' => 'nullable|string|max:1000',
            'idMetodoPago' => 'required|exists:metodos_pago,id',
        ]);

        DB::beginTransaction();
        try {
            // Validar stock de todos los productos
            foreach ($validated['items'] as $item) {
                $producto = Producto::findOrFail($item['idProducto']);
                
                if (!$producto->activo) {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'message' => "El producto '{$producto->nombre}' no está disponible.",
                    ], 400);
                }
                
                if ($producto->stock < $item['cantidad']) {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'message' => "No hay suficiente stock del producto '{$producto->nombre}'. Stock disponible: {$producto->stock}",
                    ], 400);
                }
            }

            // Crear la compra en estado pendiente
            // Obtener IDs de estados desde la base de datos
            $estadoPagoPendiente = EstadoPago::where('nombre', 'Pendiente')->first();
            $estadoPedidoPendiente = EstadoPedido::where('nombre', 'Pendiente')->first();
            
            if (!$estadoPagoPendiente || !$estadoPedidoPendiente) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Error: Estados de pago o pedido no configurados correctamente.',
                ], 500);
            }
            
            $idEstadoPendiente = $estadoPagoPendiente->id;
            $idEstadoPedidoPendiente = $estadoPedidoPendiente->id;

            $compra = Compra::create([
                'idCliente' => auth()->id(),
                'idEstado' => $idEstadoPedidoPendiente,
                'idEstadoPago' => $idEstadoPendiente,
                'idMetodoPago' => $validated['idMetodoPago'],
                'total' => $validated['total'],
                'nombre' => $validated['datos_cliente']['nombre'],
                'apellido' => $validated['datos_cliente']['apellido'],
                'email' => $validated['datos_cliente']['email'],
                'telefono' => $validated['datos_cliente']['telefono'] ?? null,
                'calle' => $validated['direccion']['calle'],
                'numero' => $validated['direccion']['numero'],
                'ciudad' => $validated['direccion']['ciudad'],
                'provincia' => $validated['direccion']['provincia'],
                'codigoPostal' => $validated['direccion']['codigoPostal'],
                'piso' => $validated['direccion']['piso'] ?? null,
                'departamento' => $validated['direccion']['departamento'] ?? null,
                'tipo_entrega' => $validated['tipo_entrega'],
                'costo_envio' => $validated['costo_envio'],
                'observaciones' => $validated['observaciones'] ?? null,
            ]);

            // Crear los detalles de compra
            foreach ($validated['items'] as $item) {
                $producto = Producto::findOrFail($item['idProducto']);
                
                DetalleCompra::create([
                    'idCompra' => $compra->id,
                    'idProducto' => $producto->id,
                    'nombreProducto' => $producto->nombre,
                    'sku' => $producto->sku,
                    'cantidad' => $item['cantidad'],
                    'precioUnitario' => $item['precioUnitario'],
                ]);
            }

            DB::commit();

            // Vaciar carrito
            Session::forget('carrito');

            return response()->json([
                'success' => true,
                'compra_id' => $compra->id,
                'message' => 'Compra creada correctamente',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al crear la compra: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Procesar compra con transferencia bancaria
     */
    public function procesarTransferencia(Request $request)
    {
        // Primero crear la compra
        $response = $this->store($request);
        $responseData = json_decode($response->getContent(), true);

        if (!$responseData['success']) {
            return $response;
        }

        $compra = Compra::with('detalles.producto')->find($responseData['compra_id']);

        // Enviar email con instrucciones de pago
        try {
            Mail::to($compra->email)->send(new InstruccionesPagoCompra($compra));
        } catch (\Exception $e) {
            Log::error('Error al enviar email de transferencia: ' . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'compra_id' => $compra->id,
            'message' => 'Compra creada. Revisa tu email para las instrucciones de pago.',
        ]);
    }

    /**
     * Procesar compra con efectivo
     */
    public function procesarEfectivo(Request $request)
    {
        // Primero crear la compra
        $response = $this->store($request);
        $responseData = json_decode($response->getContent(), true);

        if (!$responseData['success']) {
            return $response;
        }

        $compra = Compra::with('detalles.producto')->find($responseData['compra_id']);

        // Enviar email al cliente
        try {
            Mail::to($compra->email)->send(new CompraEfectivo($compra, 'cliente'));
        } catch (\Exception $e) {
            Log::error('Error al enviar email al cliente: ' . $e->getMessage());
        }

        // Enviar email a yunaceramica@gmail.com
        try {
            Mail::to('yunaceramica@gmail.com')->send(new CompraEfectivo($compra, 'admin'));
        } catch (\Exception $e) {
            Log::error('Error al enviar email a admin: ' . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'compra_id' => $compra->id,
            'message' => 'Compra creada. Te contactaremos pronto para coordinar el pago.',
        ]);
    }

    /**
     * Actualizar estado de compra (admin)
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'idEstadoPago' => 'nullable|exists:estados_pago,id',
            'idEstado' => 'nullable|exists:estado_pedidos,id',
            'tracking' => 'nullable|string|max:255',
        ]);

        $compra = Compra::with('detalles')->findOrFail($id);
        $estadoPagoAnterior = $compra->idEstadoPago;

        // Actualizar estados
        if (isset($validated['idEstadoPago'])) {
            $compra->idEstadoPago = $validated['idEstadoPago'];
        }
        if (isset($validated['idEstado'])) {
            $compra->idEstado = $validated['idEstado'];
        }
        if (isset($validated['tracking'])) {
            $compra->tracking = $validated['tracking'];
        }

        $compra->save();

        // Si el estado de pago cambió a "Pagado" (3), descontar stock
        if ($compra->idEstadoPago == 3 && $estadoPagoAnterior != 3) {
            foreach ($compra->detalles as $detalle) {
                $producto = Producto::find($detalle->idProducto);
                if ($producto) {
                    $producto->decrement('stock', $detalle->cantidad);
                    $producto->increment('cantVendida', $detalle->cantidad);
                }
            }

            // Enviar email de confirmación
            try {
                Mail::to($compra->email)->send(new ConfirmacionCompra($compra));
            } catch (\Exception $e) {
                Log::error('Error al enviar email de confirmación: ' . $e->getMessage());
            }
        }

        // Si se canceló un pago aprobado, restaurar stock
        if ($estadoPagoAnterior == 3 && $compra->idEstadoPago != 3) {
            foreach ($compra->detalles as $detalle) {
                $producto = Producto::find($detalle->idProducto);
                if ($producto) {
                    $producto->increment('stock', $detalle->cantidad);
                    $producto->decrement('cantVendida', $detalle->cantidad);
                }
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Estado actualizado correctamente',
        ]);
    }

    /**
     * Dashboard: Listado de compras para admin
     */
    public function dashboardIndex()
    {
        // Compras pendientes de pago (idEstadoPago = 1)
        $comprasPendientes = Compra::with(['estadoPago', 'estado', 'metodoPago', 'detalles'])
            ->where('idEstadoPago', 1) // Pendiente
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($compra) {
                return [
                    'id' => $compra->id,
                    'nombre' => $compra->nombre,
                    'apellido' => $compra->apellido,
                    'email' => $compra->email,
                    'telefono' => $compra->telefono,
                    'total' => $compra->total,
                    'metodoPago' => $compra->metodoPago ? [
                        'id' => $compra->metodoPago->id,
                        'nombre' => $compra->metodoPago->nombre,
                    ] : null,
                    'estadoPago' => $compra->estadoPago ? [
                        'id' => $compra->estadoPago->id,
                        'nombre' => $compra->estadoPago->nombre,
                    ] : null,
                    'estado' => $compra->estado ? [
                        'id' => $compra->estado->id,
                        'nombre' => $compra->estado->nombre,
                    ] : null,
                    'created_at' => $compra->created_at,
                ];
            });

        // Envíos pendientes (pagadas pero no enviadas)
        // idEstadoPago = 3 (Pagado) AND idEstado != 2 (Enviado)
        $enviosPendientes = Compra::with(['estadoPago', 'estado', 'metodoPago', 'detalles'])
            ->where('idEstadoPago', 3) // Pagado
            ->where('idEstado', '!=', 2) // No enviado
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($compra) {
                return [
                    'id' => $compra->id,
                    'nombre' => $compra->nombre,
                    'apellido' => $compra->apellido,
                    'email' => $compra->email,
                    'telefono' => $compra->telefono,
                    'total' => $compra->total,
                    'metodoPago' => $compra->metodoPago ? [
                        'id' => $compra->metodoPago->id,
                        'nombre' => $compra->metodoPago->nombre,
                    ] : null,
                    'estadoPago' => $compra->estadoPago ? [
                        'id' => $compra->estadoPago->id,
                        'nombre' => $compra->estadoPago->nombre,
                    ] : null,
                    'estado' => $compra->estado ? [
                        'id' => $compra->estado->id,
                        'nombre' => $compra->estado->nombre,
                    ] : null,
                    'created_at' => $compra->created_at,
                ];
            });

        // Todas las compras
        $todasLasCompras = Compra::with(['estadoPago', 'estado', 'metodoPago', 'detalles'])
            ->orderBy('created_at', 'desc')
            ->paginate(20)
            ->through(function ($compra) {
                return [
                    'id' => $compra->id,
                    'nombre' => $compra->nombre,
                    'apellido' => $compra->apellido,
                    'email' => $compra->email,
                    'telefono' => $compra->telefono,
                    'total' => $compra->total,
                    'metodoPago' => $compra->metodoPago ? [
                        'id' => $compra->metodoPago->id,
                        'nombre' => $compra->metodoPago->nombre,
                    ] : null,
                    'estadoPago' => $compra->estadoPago ? [
                        'id' => $compra->estadoPago->id,
                        'nombre' => $compra->estadoPago->nombre,
                    ] : null,
                    'estado' => $compra->estado ? [
                        'id' => $compra->estado->id,
                        'nombre' => $compra->estado->nombre,
                    ] : null,
                    'created_at' => $compra->created_at,
                ];
            });

        return Inertia::render('Dashboard/Compras/Index', [
            'comprasPendientes' => $comprasPendientes,
            'enviosPendientes' => $enviosPendientes,
            'todasLasCompras' => $todasLasCompras,
        ]);
    }

    /**
     * Dashboard: Detalle de compra para admin
     */
    public function dashboardShow($id)
    {
        $compra = Compra::with([
            'estadoPago',
            'estado',
            'metodoPago',
            'detalles.producto',
            'cliente'
        ])->findOrFail($id);

        // Obtener todos los estados disponibles para los selects
        $estadosPago = EstadoPago::all();
        $estadosPedido = EstadoPedido::all();

        // Serializar la compra para asegurar que las relaciones se carguen correctamente
        $compraData = [
            'id' => $compra->id,
            'nombre' => $compra->nombre,
            'apellido' => $compra->apellido,
            'email' => $compra->email,
            'telefono' => $compra->telefono,
            'total' => $compra->total,
            'calle' => $compra->calle,
            'numero' => $compra->numero,
            'ciudad' => $compra->ciudad,
            'provincia' => $compra->provincia,
            'codigoPostal' => $compra->codigoPostal,
            'piso' => $compra->piso,
            'departamento' => $compra->departamento,
            'tipo_entrega' => $compra->tipo_entrega,
            'costo_envio' => $compra->costo_envio,
            'observaciones' => $compra->observaciones,
            'tracking' => $compra->tracking,
            'idEstadoPago' => $compra->idEstadoPago,
            'idEstado' => $compra->idEstado,
            'metodoPago' => $compra->metodoPago ? [
                'id' => $compra->metodoPago->id,
                'nombre' => $compra->metodoPago->nombre,
            ] : null,
            'estadoPago' => $compra->estadoPago ? [
                'id' => $compra->estadoPago->id,
                'nombre' => $compra->estadoPago->nombre,
            ] : null,
            'estado' => $compra->estado ? [
                'id' => $compra->estado->id,
                'nombre' => $compra->estado->nombre,
            ] : null,
            'detalles' => $compra->detalles->map(function ($detalle) {
                return [
                    'id' => $detalle->id,
                    'nombreProducto' => $detalle->nombreProducto,
                    'sku' => $detalle->sku,
                    'cantidad' => $detalle->cantidad,
                    'precioUnitario' => $detalle->precioUnitario,
                ];
            }),
            'created_at' => $compra->created_at,
        ];

        return Inertia::render('Dashboard/Compras/Show', [
            'compra' => $compraData,
            'estadosPago' => $estadosPago,
            'estadosPedido' => $estadosPedido,
        ]);
    }
}

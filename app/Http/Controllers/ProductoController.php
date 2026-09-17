<?php

namespace App\Http\Controllers;

use App\Models\Atributo;
use App\Models\Producto;
use App\Models\Subcategoria;
use App\Models\Categoria;
use App\Models\ImagenProducto;
use App\Models\TipoAtributo;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Services\ImageOptimizationService;

class ProductoController extends Controller
{
    /**
     * Listar productos para el cliente (catálogo)
     */
    public function index(Request $request)
    {
        $query = Producto::with(['imagenes', 'subcategoria.categoria'])
            ->where('activo', true);

        // Filtro por categoría
        if ($request->has('categoria')) {
            $query->whereHas('subcategoria.categoria', function($q) use ($request) {
                $q->where('id', $request->categoria);
            });
        }

        // Filtro por subcategoría
        if ($request->has('subcategoria')) {
            $query->where('idSubcategoria', $request->subcategoria);
        }

        // Búsqueda por nombre
        if ($request->has('busqueda')) {
            $query->where('nombre', 'like', '%' . $request->busqueda . '%');
        }

        $productos = $query->orderBy('created_at', 'desc')->paginate(12);

        // Obtener solo las subcategorías de productos (categoría ID 1) para filtros
        $subcategorias = Subcategoria::where('idCategoria', 1)
            ->where('activo', true)
            ->orderBy('orden')
            ->orderBy('nombre')
            ->get(['id', 'nombre', 'idCategoria']);
        
        return Inertia::render('Productos/Index', [
            'productos' => $productos,
            'subcategorias' => $subcategorias,
            'filtros' => $request->only(['subcategoria', 'busqueda']),
        ]);
    }

    /**
     * Listar productos mayoristas para el cliente (catálogo mayorista)
     */
    public function mayoristaIndex(Request $request)
    {
        $query = Producto::with(['imagenes', 'subcategoria.categoria'])
            ->where('activo', true)
            ->where('es_mayorista', true);

        // Filtro por categoría
        if ($request->has('categoria')) {
            $query->whereHas('subcategoria.categoria', function($q) use ($request) {
                $q->where('id', $request->categoria);
            });
        }

        // Filtro por subcategoría
        if ($request->has('subcategoria')) {
            $query->where('idSubcategoria', $request->subcategoria);
        }

        // Búsqueda por nombre
        if ($request->has('busqueda')) {
            $query->where('nombre', 'like', '%' . $request->busqueda . '%');
        }

        $productos = $query->orderBy('created_at', 'desc')->paginate(12);

        // Subcategorías de productos que tienen ítems mayoristas
        $subcategorias = Subcategoria::where('idCategoria', 1)
            ->where('activo', true)
            ->whereHas('productos', function($q) {
                $q->where('activo', true)->where('es_mayorista', true);
            })
            ->orderBy('orden')
            ->orderBy('nombre')
            ->get(['id', 'nombre', 'idCategoria']);
        
        return Inertia::render('Mayorista/Index', [
            'productos' => $productos,
            'subcategorias' => $subcategorias,
            'filtros' => $request->only(['subcategoria', 'busqueda']),
        ]);
    }

    /**
     * Ver detalle de un producto (por slug)
     */
    public function show($slug)
    {
        $producto = Producto::with(['imagenes', 'subcategoria', 'atributos'])
            ->where('slug', $slug)
            ->where('activo', true)
            ->firstOrFail();

        // Obtener métodos de pago activos
        $metodosPago = \App\Models\MetodoPago::where('activo', true)
            ->orderBy('id')
            ->get(['id', 'nombre', 'descripcion']);

        return Inertia::render('Productos/Show', [
            'producto' => [
                'id' => $producto->id,
                'nombre' => $producto->nombre,
                'descripcion' => $producto->descripcion,
                'precio' => $producto->precio,
                'stock' => $producto->stock,
                'tiene_atributos' => $producto->tiene_atributos,
                'es_mayorista' => (bool)$producto->es_mayorista,
                'cant_minima_mayorista' => $producto->cant_minima_mayorista,
                'descuento_mayorista' => $producto->descuento_mayorista,
                'precio_minorista_final' => $producto->precio_minorista_final,
                'precio_mayorista_final' => $producto->precio_mayorista_final,
                'sku' => $producto->sku,
                'descuento' => $producto->descuento,
                'slug' => $producto->slug,
                'peso' => $producto->peso,
                'dimensiones' => $producto->dimensiones,
                'tags' => $producto->tags,
                'imagenes' => $producto->imagenes->map(function($img) {
                    return [
                        'id' => $img->id,
                        'urlImagen' => $img->urlImagen,
                        'orden' => $img->orden,
                    ];
                })->toArray(),
                'subcategoria' => $producto->subcategoria ? [
                    'id' => $producto->subcategoria->id,
                    'nombre' => $producto->subcategoria->nombre,
                ] : null,
                'atributos' => $producto->atributos->map(fn($attr) => [
                    'id' => $attr->id,
                    'nombre' => $attr->nombre,
                    'tipo_nombre' => $attr->tipoAtributo ? $attr->tipoAtributo->nombre : 'opción',
                ]),
            ],
            'metodosPago' => $metodosPago,
        ]);
    }

    /**
     * Listar productos para admin
     */
    public function indexDashboard()
    {
        $productos = Producto::with(['imagenes', 'subcategoria.categoria'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Dashboard/Productos/Index', [
            'productos' => $productos,
        ]);
    }

    /**
     * Mostrar formulario de creación (admin)
     */
    public function create()
    {
        $subcategorias = Subcategoria::where('activo', true)
            ->orderBy('nombre')
            ->get(['id', 'nombre', 'idCategoria']);

        return Inertia::render('Dashboard/Productos/Create', [
            'subcategorias' => $subcategorias,
            'tipoAtributos' => TipoAtributo::all(),
        'atributosDisponibles' => Atributo::all(),
        ]);
    }

    /**
     * Guardar nuevo producto (admin)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'idSubcategoria' => 'required|exists:subcategorias,id',
            'precio' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'tiene_atributos' => 'required|boolean',
            'es_mayorista' => 'nullable|boolean',
            'cant_minima_mayorista' => 'nullable|integer|min:1',
            'descuento_mayorista' => 'nullable|numeric|min:0|max:100',
            'atributos' => 'nullable|array',
            'atributos.*' => 'required|exists:atributos,id',
            'sku' => 'required|string|unique:productos,sku',
            'peso' => 'required|numeric|min:0',
            'dimensiones' => 'required|string|max:255',
            'tags' => 'nullable|string',
            'descuento' => 'nullable|integer|min:0|max:100',
            'imagenes' => 'required|array|min:1',
            'imagenes.*' => 'required|file|image|max:20480', // 20MB por imagen
            'orden' => 'nullable|array',
        ]);

        DB::beginTransaction();
        try {
            // Generar slug único
            $slug = Str::slug($validated['nombre']);
            $slugOriginal = $slug;
            $contador = 1;
            while (Producto::where('slug', $slug)->exists()) {
                $slug = $slugOriginal . '-' . $contador;
                $contador++;
            }

            $esMayorista = !empty($validated['es_mayorista']);

            $producto = Producto::create([
                'nombre' => $validated['nombre'],
                'descripcion' => $validated['descripcion'],
                'idSubcategoria' => $validated['idSubcategoria'],
                'precio' => $validated['precio'],
                'stock' => $validated['stock'],
                'tiene_atributos' => $validated['tiene_atributos'],
                'es_mayorista' => $esMayorista,
                'cant_minima_mayorista' => $esMayorista ? ($validated['cant_minima_mayorista'] ?? null) : null,
                'descuento_mayorista' => $esMayorista ? ($validated['descuento_mayorista'] ?? null) : null,
                'sku' => $validated['sku'],
                'peso' => $validated['peso'],
                'dimensiones' => $validated['dimensiones'],
                'tags' => $validated['tags'] ?? '',
                'descuento' => $validated['descuento'] ?? null,
                'slug' => $slug,
                'cantVendida' => 0,
                'activo' => true,
            ]);

            if ($validated['tiene_atributos'] && !empty($request->atributos)) {
                $producto->atributos()->sync($request->atributos);
            }

            // Guardar imágenes (sin optimización por ahora, solo guardar original)
            $ordenArray = $request->input('orden', []);
            
            foreach ($request->file('imagenes') as $index => $imagen) {
                // Obtener el orden del array o usar el índice
                $orden = isset($ordenArray[$index]) ? (int)$ordenArray[$index] : $index;
                
                $filename = 'producto-' . $producto->id . '-' . $orden . '.' . $imagen->getClientOriginalExtension();
                $path = $imagen->storeAs('productos', $filename, 'public');

                // Crear registro de imagen
                ImagenProducto::create([
                    'idProducto' => $producto->id,
                    'urlImagen' => basename($path),
                    'orden' => $orden,
                ]);
            }

            DB::commit();

            return redirect()->route('dashboard.productos.index')
                ->with('success', 'Producto creado correctamente');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Error al crear producto: ' . $e->getMessage()]);
        }
    }

    /**
     * Mostrar formulario de edición (admin)
     */
    public function edit($id)
    {
        $producto = Producto::with([
            'imagenes' => function($q) {
                $q->orderBy('orden', 'asc');
            },
            'subcategoria',
            'atributos.tipoAtributo'
        ])->findOrFail($id);

        $subcategorias = Subcategoria::where('activo', true)
            ->orderBy('nombre')
            ->get(['id', 'nombre', 'idCategoria']);

        return Inertia::render('Dashboard/Productos/Edit', [
            'producto' => $producto,
            'subcategorias' => $subcategorias,
            'tipoAtributos' => TipoAtributo::all(),
            'atributosDisponibles' => Atributo::with('tipoAtributo')->get(),
        ]);
    }

    /**
     * Actualizar producto (admin)
     */
    public function update(Request $request, $id)
    {
        $producto = Producto::findOrFail($id);

        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'idSubcategoria' => 'required|exists:subcategorias,id',
            'precio' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'tiene_atributos' => 'required|boolean',
            'es_mayorista' => 'nullable|boolean',
            'cant_minima_mayorista' => 'nullable|integer|min:1',
            'descuento_mayorista' => 'nullable|numeric|min:0|max:100',
            'atributos' => 'nullable|array',
            'atributos.*' => 'required|exists:atributos,id',
            'sku' => 'required|string|unique:productos,sku,' . $id,
            'peso' => 'required|numeric|min:0',
            'dimensiones' => 'required|string|max:255',
            'tags' => 'nullable|string',
            'descuento' => 'nullable|integer|min:0|max:100',
            'activo' => 'nullable|boolean',
            'imagenes_nuevas' => 'nullable|array',
            'imagenes_nuevas.*' => 'file|image|max:20480',
            'imagenes_eliminar' => 'nullable|array',
            'imagenes_eliminar.*' => 'exists:imagenes_producto,id',
        ]);

        DB::beginTransaction();
        try {
            // Actualizar slug si cambió el nombre
            if ($producto->nombre !== $validated['nombre']) {
                $slug = Str::slug($validated['nombre']);
                $slugOriginal = $slug;
                $contador = 1;
                while (Producto::where('slug', $slug)->where('id', '!=', $id)->exists()) {
                    $slug = $slugOriginal . '-' . $contador;
                    $contador++;
                }
                $validated['slug'] = $slug;
            }

            $esMayorista = !empty($validated['es_mayorista']);

            $producto->update([
                'nombre' => $validated['nombre'],
                'descripcion' => $validated['descripcion'],
                'idSubcategoria' => $validated['idSubcategoria'],
                'precio' => $validated['precio'],
                'stock' => $validated['stock'],
                'tiene_atributos' => $validated['tiene_atributos'],
                'es_mayorista' => $esMayorista,
                'cant_minima_mayorista' => $esMayorista ? ($validated['cant_minima_mayorista'] ?? null) : null,
                'descuento_mayorista' => $esMayorista ? ($validated['descuento_mayorista'] ?? null) : null,
                'sku' => $validated['sku'],
                'peso' => $validated['peso'],
                'dimensiones' => $validated['dimensiones'],
                'tags' => $validated['tags'] ?? '',
                'descuento' => $validated['descuento'] ?? null,
                'slug' => $validated['slug'] ?? $producto->slug,
                'activo' => $request->has('activo') ? (bool)$request->activo : $producto->activo,
            ]);

            // Sincronizar atributos
            if ($validated['tiene_atributos'] && !empty($request->atributos)) {
                $producto->atributos()->sync($request->atributos);
            } else {
                $producto->atributos()->detach();
            }

            // Eliminar imágenes marcadas para eliminar
            if ($request->has('imagenes_eliminar') && is_array($request->imagenes_eliminar)) {
                foreach ($request->imagenes_eliminar as $imagenId) {
                    $imagen = ImagenProducto::where('idProducto', $producto->id)->find($imagenId);
                    if ($imagen) {
                        Storage::disk('public')->delete('productos/' . $imagen->urlImagen);
                        $imagen->delete();
                    }
                }
            }

            // Agregar nuevas imágenes
            if ($request->hasFile('imagenes_nuevas')) {
                $ultimoOrden = ImagenProducto::where('idProducto', $producto->id)->max('orden') ?? -1;
                
                foreach ($request->file('imagenes_nuevas') as $imagen) {
                    $ultimoOrden++;
                    $filename = 'producto-' . $producto->id . '-' . time() . '-' . Str::random(5) . '.' . $imagen->getClientOriginalExtension();
                    $path = $imagen->storeAs('productos', $filename, 'public');

                    ImagenProducto::create([
                        'idProducto' => $producto->id,
                        'urlImagen' => basename($path),
                        'orden' => $ultimoOrden,
                    ]);
                }
            }

            // Validar que el producto tenga al menos una imagen
            if ($producto->imagenes()->count() === 0) {
                DB::rollBack();
                return back()->withErrors(['error' => 'El producto debe tener al menos una imagen.']);
            }

            DB::commit();

            return redirect()->route('dashboard.productos.index')
                ->with('success', 'Producto actualizado correctamente');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Error al actualizar producto: ' . $e->getMessage()]);
        }
    }

    /**
     * Eliminar/Desactivar producto (admin)
     */
    public function destroy($id)
    {
        $producto = Producto::findOrFail($id);
        
        // En lugar de eliminar, desactivar
        $producto->update(['activo' => false]);

        return redirect()->route('dashboard.productos.index')
            ->with('success', 'Producto desactivado correctamente');
    }

    /**
     * Obtener stock de un producto (para actualización dinámica)
     */
    public function getStock($id)
    {
        $producto = Producto::findOrFail($id);
        
        return response()->json([
            'stock' => $producto->stock,
            'activo' => $producto->activo,
        ]);
    }

    /**
     * Obtener stock de múltiples productos
     */
    public function getStockMultiple(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'required|exists:productos,id',
        ]);

        $productos = Producto::whereIn('id', $validated['ids'])
            ->get(['id', 'stock', 'activo']);

        return response()->json([
            'productos' => $productos->map(function($p) {
                return [
                    'id' => $p->id,
                    'stock' => $p->stock,
                    'activo' => $p->activo,
                ];
            }),
        ]);
    }

    public function add(Request $request)
{
    $validated = $request->validate([
        'idProducto' => 'required|exists:productos,id',
        'cantidad' => 'required|integer|min:1',
    ]);

    // Tu lógica para guardar en sesión o base de datos:
    $producto = Producto::find($validated['idProducto']);
    
    // Ejemplo rápido usando sesión:
    $carrito = session()->get('carrito', []);
    
    if(isset($carrito[$producto->id])) {
        $carrito[$producto->id]['cantidad'] += $validated['cantidad'];
    } else {
        $carrito[$producto->id] = [
            "nombre" => $producto->nombre,
            "cantidad" => $validated['cantidad'],
            "tiene_atributos" => $producto->tiene_atributos,
            "precio" => $producto->precio,
            "imagen" => $producto->imagenes->first()->urlImagen ?? null
        ];
    }
    
    session()->put('carrito', $carrito);

    // IMPORTANTE: Redirigir de vuelta para que Inertia refresque las props
    return redirect()->back()->with('success', 'Producto agregado al carrito');
    }
}

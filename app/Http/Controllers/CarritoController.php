<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Producto;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CarritoController extends Controller
{
    /**
     * Mostrar la vista del carrito
     */
    public function index()
    {
        $carrito = Session::get('carrito', []);
        $productos = [];
        $total = 0;

        foreach ($carrito as $item) {
            $producto = Producto::with('imagenes')
                ->where('id', $item['idProducto'])
                ->where('activo', true)
                ->first();

            if ($producto) {
                // Verificar stock disponible
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
                
                $total += $producto->precio * $cantidadDisponible;
            }
        }

        return Inertia::render('Productos/Carrito', [
            'items' => $productos,
            'total' => $total,
            'cantidadItems' => count($productos),
        ]);
    }

    /**
     * Obtener el carrito actual (API)
     */
    public function getCart()
    {
        $carrito = Session::get('carrito', []);
        $productos = [];
        $total = 0;

        foreach ($carrito as $item) {
            $producto = Producto::with('imagenes')
                ->where('id', $item['idProducto'])
                ->where('activo', true)
                ->first();

            if ($producto) {
                // Verificar stock disponible
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
                
                $total += $producto->precio * $cantidadDisponible;
            }
        }

        return response()->json([
            'items' => $productos,
            'total' => $total,
            'cantidadItems' => count($productos),
        ]);
    }

    /**
     * Agregar producto al carrito
     */
    public function add(Request $request)
    {
        $validated = $request->validate([
            'producto_id' => 'sometimes|exists:productos,id',
            'idProducto' => 'sometimes|exists:productos,id',
            'cantidad' => 'required|integer|min:1',
        ]);

        // Compatibilidad con ambos nombres de campo
        $idProducto = $validated['producto_id'] ?? $validated['idProducto'] ?? null;
        if (!$idProducto) {
            return response()->json([
                'success' => false,
                'message' => 'ID de producto requerido',
            ], 400);
        }

        $producto = Producto::findOrFail($idProducto);

        // Validar que el producto esté activo
        if (!$producto->activo) {
            return response()->json([
                'success' => false,
                'message' => 'El producto no está disponible.',
            ], 400);
        }

        // Validar stock disponible
        if ($producto->stock < $validated['cantidad']) {
            return response()->json([
                'success' => false,
                'message' => "No hay suficiente stock. Stock disponible: {$producto->stock}",
                'stockDisponible' => $producto->stock,
            ], 400);
        }

        $carrito = Session::get('carrito', []);

        // Buscar si el producto ya está en el carrito
        $index = array_search($idProducto, array_column($carrito, 'idProducto'));

        if ($index !== false) {
            // Actualizar cantidad
            $nuevaCantidad = $carrito[$index]['cantidad'] + $validated['cantidad'];
            
            // Validar stock total
            if ($producto->stock < $nuevaCantidad) {
                return response()->json([
                    'success' => false,
                    'message' => "No hay suficiente stock. Stock disponible: {$producto->stock}",
                    'stockDisponible' => $producto->stock,
                ], 400);
            }
            
            $carrito[$index]['cantidad'] = $nuevaCantidad;
        } else {
            // Agregar nuevo producto
            $carrito[] = [
                'idProducto' => $idProducto,
                'cantidad' => $validated['cantidad'],
            ];
        }

        Session::put('carrito', $carrito);

        return response()->json([
            'success' => true,
            'message' => 'Producto agregado al carrito',
            'carrito' => [
                'cantidadItems' => count($carrito),
            ],
        ]);
    }

    /**
     * Actualizar cantidad de un producto en el carrito
     */
    public function update(Request $request, $idProducto)
    {
        $validated = $request->validate([
            'cantidad' => 'required|integer|min:1',
        ]);

        $producto = Producto::findOrFail($idProducto);

        // Validar stock disponible
        if ($producto->stock < $validated['cantidad']) {
            return response()->json([
                'success' => false,
                'message' => "No hay suficiente stock. Stock disponible: {$producto->stock}",
                'stockDisponible' => $producto->stock,
            ], 400);
        }

        $carrito = Session::get('carrito', []);
        $index = array_search($idProducto, array_column($carrito, 'idProducto'));

        if ($index !== false) {
            $carrito[$index]['cantidad'] = $validated['cantidad'];
            Session::put('carrito', $carrito);

            return response()->json([
                'success' => true,
                'message' => 'Cantidad actualizada',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Producto no encontrado en el carrito',
        ], 404);
    }

    /**
     * Eliminar producto del carrito
     */
    public function remove($idProducto)
    {
        $carrito = Session::get('carrito', []);
        $index = array_search($idProducto, array_column($carrito, 'idProducto'));

        if ($index !== false) {
            unset($carrito[$index]);
            $carrito = array_values($carrito); // Reindexar array
            Session::put('carrito', $carrito);

            return response()->json([
                'success' => true,
                'message' => 'Producto eliminado del carrito',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Producto no encontrado en el carrito',
        ], 404);
    }

    /**
     * Vaciar el carrito
     */
    public function clear()
    {
        Session::forget('carrito');

        return response()->json([
            'success' => true,
            'message' => 'Carrito vaciado',
        ]);
    }

    /**
     * Obtener cantidad de items en el carrito (para mostrar en navbar)
     */
    public function count()
    {
        $carrito = Session::get('carrito', []);
        $cantidad = 0;

        foreach ($carrito as $item) {
            $cantidad += $item['cantidad'];
        }

        return response()->json([
            'cantidad' => $cantidad,
        ]);
    }
}

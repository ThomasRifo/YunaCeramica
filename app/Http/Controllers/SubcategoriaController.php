<?php

namespace App\Http\Controllers;

use App\Models\Subcategoria;
use App\Models\Categoria;
use App\Models\ImagenSubcategoria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SubcategoriaController extends Controller
{
    /**
     * Listar subcategorías en el panel de control
     */
    public function index()
    {
        $subcategorias = Subcategoria::with(['categoria', 'imagenes' => function($q) {
            $q->orderBy('orden', 'asc');
        }])
        ->withCount(['productos', 'talleres'])
        ->orderBy('idCategoria', 'asc')
        ->orderBy('orden', 'asc')
        ->get();

        // Mapear para traer datos formateados
        $subcategorias = $subcategorias->map(function($subcat) {
            $url = $subcat->imagenes->first()->urlImagen ?? null;
            if ($url) {
                if (str_starts_with($url, 'http') || str_starts_with($url, '/storage')) {
                    $subcat->imagen_url = $url;
                } else {
                    $subcat->imagen_url = '/storage/' . ltrim($url, '/');
                }
            } else {
                $subcat->imagen_url = null;
            }
            $subcat->categoria_nombre = $subcat->categoria->nombre ?? 'Sin categoría';
            return $subcat;
        });

        $categorias = Categoria::orderBy('nombre')->get(['id', 'nombre']);

        return Inertia::render('Dashboard/Categorias/Index', [
            'subcategorias' => $subcategorias,
            'categorias' => $categorias,
        ]);
    }

    /**
     * Guarda la imagen de la subcategoría en la carpeta y formato correspondiente.
     */
    private function guardarImagenSubcategoria($subcategoria, $uploadedFile)
    {
        $extension = strtolower($uploadedFile->getClientOriginalExtension());
        if (empty($extension)) {
            $extension = 'jpg';
        }

        // Si pertenece a Talleres (idCategoria == 2) se guarda en uploads/{url}.{ext}
        if ($subcategoria->idCategoria == 2) {
            $destinationDir = 'uploads';
            $filename = $subcategoria->url . '.' . $extension;
            Storage::disk('public')->makeDirectory($destinationDir);

            // Eliminar versiones previas con otras extensiones para este slug si existen
            $possibleExtensions = ['webp', 'png', 'jpg', 'jpeg', 'JPG', 'PNG', 'WEBP'];
            foreach ($possibleExtensions as $ext) {
                $oldPath = $destinationDir . '/' . $subcategoria->url . '.' . $ext;
                if ($oldPath !== $destinationDir . '/' . $filename && Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            $uploadedFile->storeAs($destinationDir, $filename, 'public');

            return $destinationDir . '/' . $filename;
        }

        // Para otras categorías (ej. Productos)
        $filename = 'subcat-' . $subcategoria->id . '-' . time() . '.' . $extension;
        $path = $uploadedFile->storeAs('subcategorias', $filename, 'public');
        return 'subcategorias/' . basename($path);
    }

    /**
     * Guardar una nueva subcategoría
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'idCategoria' => 'required|exists:categorias,id',
            'url' => 'nullable|string|max:255',
            'orden' => 'nullable|integer|min:0',
            'activo' => 'nullable|boolean',
            'imagen' => 'nullable|file|image|max:5120',
        ]);

        DB::beginTransaction();
        try {
            $urlSlug = !empty($validated['url'])
                ? Str::slug($validated['url'])
                : Str::slug($validated['nombre']);

            $subcategoria = Subcategoria::create([
                'nombre' => $validated['nombre'],
                'descripcion' => $validated['descripcion'] ?? null,
                'idCategoria' => $validated['idCategoria'],
                'url' => $urlSlug,
                'orden' => $validated['orden'] ?? 0,
                'activo' => $request->has('activo') ? (bool)$request->activo : true,
            ]);

            if ($request->hasFile('imagen')) {
                $urlImagen = $this->guardarImagenSubcategoria($subcategoria, $request->file('imagen'));

                ImagenSubcategoria::create([
                    'idSubcategoria' => $subcategoria->id,
                    'urlImagen' => $urlImagen,
                    'orden' => 0,
                ]);
            }

            DB::commit();

            return redirect()->route('dashboard.subcategorias.index')
                ->with('success', 'Subcategoría creada correctamente');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Error al crear la subcategoría: ' . $e->getMessage()]);
        }
    }

    /**
     * Actualizar una subcategoría existente
     */
    public function update(Request $request, $id)
    {
        $subcategoria = Subcategoria::findOrFail($id);

        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'idCategoria' => 'required|exists:categorias,id',
            'url' => 'nullable|string|max:255',
            'orden' => 'nullable|integer|min:0',
            'activo' => 'nullable|boolean',
            'imagen' => 'nullable|file|image|max:5120',
            'eliminar_imagen' => 'nullable|boolean',
        ]);

        DB::beginTransaction();
        try {
            $oldUrl = $subcategoria->url;
            $oldCategoria = $subcategoria->idCategoria;

            $urlSlug = !empty($validated['url'])
                ? Str::slug($validated['url'])
                : Str::slug($validated['nombre']);

            $subcategoria->update([
                'nombre' => $validated['nombre'],
                'descripcion' => $validated['descripcion'] ?? null,
                'idCategoria' => $validated['idCategoria'],
                'url' => $urlSlug,
                'orden' => $validated['orden'] ?? $subcategoria->orden,
                'activo' => $request->has('activo') ? (bool)$request->activo : $subcategoria->activo,
            ]);

            // Si se solicitó eliminar la imagen actual
            if ($request->boolean('eliminar_imagen')) {
                $imagenesActuales = ImagenSubcategoria::where('idSubcategoria', $subcategoria->id)->get();
                foreach ($imagenesActuales as $img) {
                    $cleanPath = str_replace('/storage/', '', $img->urlImagen);
                    Storage::disk('public')->delete($cleanPath);
                    $img->delete();
                }
                if ($oldCategoria == 2 && $oldUrl) {
                    Storage::disk('public')->delete('uploads/' . $oldUrl . '.webp');
                }
            }

            // Si se subió una nueva imagen
            if ($request->hasFile('imagen')) {
                // Eliminar previas si existían
                $imagenesActuales = ImagenSubcategoria::where('idSubcategoria', $subcategoria->id)->get();
                foreach ($imagenesActuales as $img) {
                    $cleanPath = str_replace('/storage/', '', $img->urlImagen);
                    Storage::disk('public')->delete($cleanPath);
                    $img->delete();
                }
                if ($oldCategoria == 2 && $oldUrl) {
                    Storage::disk('public')->delete('uploads/' . $oldUrl . '.webp');
                }

                $urlImagen = $this->guardarImagenSubcategoria($subcategoria, $request->file('imagen'));

                ImagenSubcategoria::create([
                    'idSubcategoria' => $subcategoria->id,
                    'urlImagen' => $urlImagen,
                    'orden' => 0,
                ]);
            } elseif ($subcategoria->idCategoria == 2 && $oldUrl !== $subcategoria->url) {
                // Si cambió el slug y tenía una imagen previa en uploads/{oldUrl}.webp, renombrarla
                if (Storage::disk('public')->exists('uploads/' . $oldUrl . '.webp')) {
                    Storage::disk('public')->move('uploads/' . $oldUrl . '.webp', 'uploads/' . $subcategoria->url . '.webp');
                    $img = ImagenSubcategoria::where('idSubcategoria', $subcategoria->id)->first();
                    if ($img) {
                        $img->update(['urlImagen' => 'uploads/' . $subcategoria->url . '.webp']);
                    }
                }
            }

            DB::commit();

            return redirect()->route('dashboard.subcategorias.index')
                ->with('success', 'Subcategoría actualizada correctamente');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Error al actualizar la subcategoría: ' . $e->getMessage()]);
        }
    }

    /**
     * Alternar estado activo / inactivo de una subcategoría
     */
    public function toggleActive($id)
    {
        $subcategoria = Subcategoria::findOrFail($id);
        $subcategoria->activo = !$subcategoria->activo;
        $subcategoria->save();

        $estado = $subcategoria->activo ? 'activada' : 'desactivada';
        return redirect()->back()->with('success', "Subcategoría '{$subcategoria->nombre}' {$estado} correctamente");
    }

    /**
     * Eliminar una subcategoría verificando integridad referencial
     */
    public function destroy($id)
    {
        $subcategoria = Subcategoria::withCount(['productos', 'talleres'])->findOrFail($id);

        if ($subcategoria->productos_count > 0 || $subcategoria->talleres_count > 0) {
            $detalles = [];
            if ($subcategoria->productos_count > 0) {
                $detalles[] = $subcategoria->productos_count . ' producto(s)';
            }
            if ($subcategoria->talleres_count > 0) {
                $detalles[] = $subcategoria->talleres_count . ' taller(es)';
            }
            $mensajeDetalle = implode(' y ', $detalles);

            return redirect()->back()->withErrors([
                'error' => "No se puede eliminar la subcategoría '{$subcategoria->nombre}' porque tiene {$mensajeDetalle} asociados. Puedes desactivarla en su lugar.",
            ]);
        }

        DB::beginTransaction();
        try {
            $imagenes = ImagenSubcategoria::where('idSubcategoria', $subcategoria->id)->get();
            foreach ($imagenes as $img) {
                $cleanPath = str_replace('/storage/', '', $img->urlImagen);
                Storage::disk('public')->delete($cleanPath);
                $img->delete();
            }
            if ($subcategoria->idCategoria == 2 && $subcategoria->url) {
                Storage::disk('public')->delete('uploads/' . $subcategoria->url . '.webp');
            }

            $subcategoria->delete();
            DB::commit();

            return redirect()->route('dashboard.subcategorias.index')
                ->with('success', "Subcategoría '{$subcategoria->nombre}' eliminada correctamente");
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Error al eliminar subcategoría: ' . $e->getMessage()]);
        }
    }
}

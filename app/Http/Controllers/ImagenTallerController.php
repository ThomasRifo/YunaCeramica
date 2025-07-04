<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ImagenTaller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Services\ImageOptimizationService;

class ImagenTallerController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard/Paginas/Talleres/Index');
    }

    public function edit($slug)
    {
        $imagenes = ImagenTaller::where('slug', $slug)
                    ->orderBy('orden')
                    ->get();

        return Inertia::render('Dashboard/Paginas/Talleres/EditImagenesCropper', [
            'slug' => $slug,
            'imagenes' => $imagenes,
        ]);
    }

    public function update(Request $request, $slug)
    {
        $imagenesInput = $request->input('imagenes', []);
        $imageService = new ImageOptimizationService();

        foreach ($imagenesInput as $index => $imgData) {
            $imagenTaller = ImagenTaller::findOrFail($imgData['id']);

            // Subir nueva imagen si se envió
            if ($request->hasFile("imagenes.$index.nueva_imagen")) {
                $file = $request->file("imagenes.$index.nueva_imagen");

                if ($imagenTaller->urlImagen) {
                    Storage::disk('public')->delete('talleres/' . $imagenTaller->urlImagen);
                }

                $filename = $slug . '-' . $index . '.' . $file->extension();
                $path = $file->storeAs('talleres', $filename, 'public');

                $imagenTaller->urlImagen = basename($path);
            }

            $imagenTaller->texto = $imgData['texto'] ?? '';
            $imagenTaller->crop_x = $imgData['crop_x'] ?? null;
            $imagenTaller->crop_y = $imgData['crop_y'] ?? null;
            $imagenTaller->zoom = $imgData['zoom'] ?? null;
            $imagenTaller->save();

            // Limpiar imágenes optimizadas viejas
            if ($imagenTaller->urlImagen) {
                $imageService->cleanupOptimizedImages('talleres/' . $imagenTaller->urlImagen);
                // Regenerar imágenes optimizadas con los nuevos valores
                $imageService->processImage(
                    'talleres/' . $imagenTaller->urlImagen,
                    [
                        'x' => $imagenTaller->crop_x ?? 0,
                        'y' => $imagenTaller->crop_y ?? 0
                    ],
                    $imagenTaller->zoom ?? 1
                );
            }
        }

        return redirect()->back()->with('success', 'Imágenes y textos actualizados correctamente.');
    }
}

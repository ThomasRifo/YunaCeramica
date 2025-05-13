<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ArchivosController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard/Paginas/Archivos/Index');
    }

    public function upload(Request $request)
    {
        try {
            $request->validate([
                'archivos.*' => 'required|file|max:20480', // 20MB
            ]);

            foreach ($request->file('archivos', []) as $archivo) {
                $mimeType = $archivo->getMimeType();
                Log::info('Tipo MIME del archivo: ' . $mimeType);
                
                $nombre = $archivo->getClientOriginalName();
                $extension = $archivo->getClientOriginalExtension();
                Log::info('Extensión del archivo: ' . $extension);
                
                // Si es AVIF, convertirlo a WebP
                if ($extension === 'avif') {
                    // Leer el contenido del archivo
                    $imageData = file_get_contents($archivo->getRealPath());
                    
                    // Crear una imagen desde los datos
                    $image = imagecreatefromstring($imageData);
                    
                    if ($image === false) {
                        throw new \Exception('No se pudo crear la imagen desde los datos del archivo');
                    }
                    
                    // Generar nuevo nombre con extensión .webp
                    $nombre = pathinfo($nombre, PATHINFO_FILENAME) . '.webp';
                    $rutaCompleta = storage_path('app/public/uploads/' . $nombre);
                    
                    // Guardar como WebP
                    imagewebp($image, $rutaCompleta, 80);
                    
                    // Liberar memoria
                    imagedestroy($image);
                } else {
                    $archivo->storeAs('uploads', $nombre, 'public');
                }
            }

            return back()->with('success', 'Archivos subidos correctamente.');
        } catch (\Exception $e) {
            Log::error('Error al subir archivo: ' . $e->getMessage());
            return back()->with('error', 'Error al subir archivos: ' . $e->getMessage());
        }
    }
} 
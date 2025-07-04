<?php

namespace App\Services;

use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ImageOptimizationService
{
    protected $manager;

    public function __construct()
    {
        $this->manager = new ImageManager(new Driver());
    }

    /**
     * Procesa una imagen con crop y zoom, generando versiones optimizadas
     */
    public function processImage($imagePath, $crop, $zoom, $aspectRatio = 1.4/1.5)
    {
        try {
            // Limpiar versiones optimizadas anteriores
            $pathInfo = pathinfo($imagePath);
            $dirname = $pathInfo['dirname'];
            $filename = $pathInfo['filename'];
            $sizes = ['mobile', 'desktop', 'large'];
            foreach ($sizes as $size) {
                $optimizedPath = "$dirname/{$filename}_$size.webp";
                if (Storage::disk('public')->exists($optimizedPath)) {
                    Storage::disk('public')->delete($optimizedPath);
                }
            }
            
            // Cargar la imagen original
            $image = $this->manager->read(Storage::disk('public')->path($imagePath));
            
            // Obtener dimensiones originales
            $originalWidth = $image->width();
            $originalHeight = $image->height();
            
            // Calcular el tamaño del área recortada (crop box) en la imagen original
            $croppedAreaWidth = $originalWidth / $zoom;
            $croppedAreaHeight = $croppedAreaWidth / $aspectRatio;
            
            // Calcular la posición del área recortada
            // crop_x y crop_y son porcentajes de -100 a 100, centro es 0,0
            // En react-easy-crop, el crop se aplica así:
            //   x = (originalWidth - croppedAreaWidth) / 2 - crop_x * croppedAreaWidth / 200
            //   y = (originalHeight - croppedAreaHeight) / 2 - crop_y * croppedAreaHeight / 200
            $x = ($originalWidth - $croppedAreaWidth) / 2 - ($crop['x'] ?? 0) * $croppedAreaWidth / 200;
            $y = ($originalHeight - $croppedAreaHeight) / 2 - ($crop['y'] ?? 0) * $croppedAreaHeight / 200;
            
            // Limitar el área recortada para que no salga de la imagen
            $safeX = max(0, min($x, $originalWidth - $croppedAreaWidth));
            $safeY = max(0, min($y, $originalHeight - $croppedAreaHeight));
            
            $cropWidth = min($croppedAreaWidth, $originalWidth - $safeX);
            $cropHeight = min($croppedAreaHeight, $originalHeight - $safeY);
            
            // Aplicar crop
            $image->crop($cropWidth, $cropHeight, $safeX, $safeY);
            
            // Generar diferentes tamaños (solo limitar el ancho, alto proporcional)
            $sizes = [
                'mobile' => 400, // ancho para móvil
                'desktop' => 600, // ancho para desktop
                'large' => 800,   // ancho para pantallas grandes
            ];
            
            $processedImages = [];
            
            foreach ($sizes as $size => $targetWidth) {
                $resizedImage = clone $image;
                // Calcular alto proporcional
                $targetHeight = intval($cropHeight * ($targetWidth / $cropWidth));
                $resizedImage->resize($targetWidth, $targetHeight);
                
                // Generar nombre del archivo optimizado
                $pathInfo = pathinfo($imagePath);
                $filename = $pathInfo['filename'];
                $dirname = $pathInfo['dirname'];
                $optimizedPath = "$dirname/{$filename}_$size.webp";
                
                // Guardar como WebP (mejor compresión)
                $resizedImage->toWebp(90)->save(Storage::disk('public')->path($optimizedPath));
                
                $processedImages[$size] = $optimizedPath;
            }
            
            return $processedImages;
            
        } catch (\Exception $e) {
            Log::error('Error procesando imagen: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Obtiene la URL de la imagen optimizada según el dispositivo
     */
    public function getOptimizedImageUrl($imagePath, $crop, $zoom, $aspectRatio = 1.4/1.5)
    {
        // Verificar si ya existe la imagen optimizada
        $pathInfo = pathinfo($imagePath);
        $filename = $pathInfo['filename'];
        $dirname = $pathInfo['dirname'];
        $mobilePath = "$dirname/{$filename}_mobile.webp";
        
        if (!Storage::disk('public')->exists($mobilePath)) {
            // Procesar la imagen si no existe
            $this->processImage($imagePath, $crop, $zoom, $aspectRatio);
        }
        
        $desktopPath = "$dirname/{$filename}_desktop.webp";
        $largePath = "$dirname/{$filename}_large.webp";
        
        return [
            'mobile' => Storage::url($mobilePath),
            'desktop' => Storage::url($desktopPath),
            'large' => Storage::url($largePath),
        ];
    }

    /**
     * Limpia imágenes optimizadas antiguas
     */
    public function cleanupOptimizedImages($imagePath)
    {
        $pathInfo = pathinfo($imagePath);
        $optimizedDir = $pathInfo['dirname'] . '/optimized/';
        
        if (Storage::disk('public')->exists($optimizedDir)) {
            Storage::disk('public')->deleteDirectory($optimizedDir);
        }
    }
} 
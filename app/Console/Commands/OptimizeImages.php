<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use App\Models\ImagenTaller;
use App\Services\ImageOptimizationService;

class OptimizeImages extends Command
{
    protected $signature = 'images:optimize {--force : Forzar reprocesamiento de todas las imágenes}';
    protected $description = 'Optimizar todas las imágenes de talleres existentes';

    public function handle()
    {
        $this->info('Iniciando optimización de imágenes...');
        
        $imageService = new ImageOptimizationService();
        $imagenes = ImagenTaller::all();
        
        $bar = $this->output->createProgressBar($imagenes->count());
        $bar->start();
        
        $processed = 0;
        $errors = 0;
        
        foreach ($imagenes as $imagen) {
            try {
                $crop = [
                    'x' => $imagen->crop_x ?? 0,
                    'y' => $imagen->crop_y ?? 0
                ];
                $zoom = $imagen->zoom ?? 1;
                
                $imagePath = 'talleres/' . $imagen->urlImagen;
                
                // Verificar si la imagen original existe
                if (!Storage::disk('public')->exists($imagePath)) {
                    $this->warn("Imagen no encontrada: {$imagePath}");
                    $errors++;
                    $bar->advance();
                    continue;
                }
                
                // Procesar la imagen
                $result = $imageService->processImage($imagePath, $crop, $zoom);
                
                if ($result) {
                    $processed++;
                    $this->line(" ✓ Procesada: {$imagen->urlImagen}");
                } else {
                    $errors++;
                    $this->error(" ✗ Error procesando: {$imagen->urlImagen}");
                }
                
            } catch (\Exception $e) {
                $errors++;
                $this->error(" ✗ Excepción en {$imagen->urlImagen}: " . $e->getMessage());
            }
            
            $bar->advance();
        }
        
        $bar->finish();
        $this->newLine();
        
        $this->info("Optimización completada:");
        $this->info("  - Imágenes procesadas: {$processed}");
        $this->info("  - Errores: {$errors}");
        
        if ($errors > 0) {
            $this->warn("Algunas imágenes no pudieron ser procesadas. Revisa los logs para más detalles.");
        }
        
        return 0;
    }
} 
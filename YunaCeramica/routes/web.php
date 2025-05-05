<?php

use App\Http\Controllers\ProductoController;
use App\Http\Controllers\TallerController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ImagenTallerController;
use App\Http\Controllers\PagoController;
use App\Http\Controllers\TallerClienteController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/productos', [ProductoController::class, 'index'])->name('productos');

Route::get('/talleres', [TallerController::class, 'talleresClient'])->name('talleres');

Route::get('/talleres-ceramica-y-gin', [TallerController::class, 'tallerView']);
Route::get('/talleres-ceramica-y-cafe', [TallerController::class, 'tallerView']);
Route::get('/talleres-{slug}-inscripcion', [TallerController::class, 'formInscripcion'])
    ->where('slug', '[A-Za-z0-9\-]+')
    ->name('taller.inscripcion');








Route::middleware(['auth', 'verified'])
    ->prefix('dashboard')
    ->name('dashboard.')  
    ->group(function () {
        
        Route::prefix('/paginas/talleres')
        ->name('paginas.')
        ->group(function () {
            Route::get('/', [ImagenTallerController::class, 'index'])->name('talleres.index'); 
            Route::get('{slug}/editar', [ImagenTallerController::class, 'edit'])->name('talleres.imagenes.edit');
            Route::put('{slug}/actualizar', [ImagenTallerController::class, 'update'])->name('talleres.imagenes.update');
        });

        // Ruta principal del dashboard
        Route::get('/', function () {
            return Inertia::render('Dashboard/Dashboard');
        })->name('dashboard');
        // Rutas de Talleres
        Route::get('/talleres', [TallerController::class, 'index'])->name('talleres.index');    
        Route::get('/talleres/create', [TallerController::class, 'create'])->name('talleres.create'); 
        Route::post('/talleres', [TallerController::class, 'store'])->name('talleres.store');     
        Route::get('/talleres/{id}/edit', [TallerController::class, 'edit'])->name('talleres.edit');
    Route::put('/talleres/{id}', [TallerController::class, 'update'])->name('talleres.update');
        Route::delete('/talleres/{id}', [TallerController::class, 'destroy'])->name('talleres.destroy'); 
        Route::put('/talleres/{id}/eliminar', [TallerController::class, 'desactivar'])->name('talleres.eliminar');
        Route::get('/talleres/{id}', [TallerController::class, 'view'])->name('talleres.view');    
        Route::put('/taller-cliente/{id}/actualizar-pago', [TallerClienteController::class, 'actualizarPago'])->name('taller.actualizarPago');

        
    });

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});



Route::post('/pagar-taller', [PagoController::class, 'pagarTaller'])->middleware('auth');

Route::get('/pago-success', fn() => Inertia::render('Pagos/Success'))->name('pago.success');
Route::get('/pago-failure', fn() => Inertia::render('Pagos/Failure'))->name('pago.failure');
Route::get('/pago-pending', fn() => Inertia::render('Pagos/Pending'))->name('pago.pending');



Route::fallback(function () {
    return Inertia::render('Errors/404')->toResponse(request())->setStatusCode(404);
});
require __DIR__.'/auth.php';

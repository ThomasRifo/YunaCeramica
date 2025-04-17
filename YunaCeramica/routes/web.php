<?php

use App\Http\Controllers\TallerController;
use App\Http\Controllers\ProfileController;
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

Route::middleware(['auth', 'verified'])
    ->prefix('dashboard')
    ->name('dashboard.')  // 👉 Todos los nombres de rutas empiezan con "dashboard."
    ->group(function () {
        
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


Route::fallback(function () {
    return Inertia::render('Errors/404')->toResponse(request())->setStatusCode(404);
});
require __DIR__.'/auth.php';

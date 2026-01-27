<?php

use App\Http\Controllers\ProductoController;
use App\Http\Controllers\CarritoController;
use App\Http\Controllers\CompraController;
use App\Http\Controllers\TallerController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ImagenTallerController;
use App\Http\Controllers\MercadoPagoController;
use App\Http\Controllers\PagoController;
use App\Http\Controllers\TallerClienteController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\ReviewsController;
use App\Http\Controllers\ContactoController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Index', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/productos', [ProductoController::class, 'index'])->name('productos');
Route::get('/productos/{slug}', [ProductoController::class, 'show'])->name('productos.show');

Route::get('/eventos-privados', function() {
    return Inertia::render('EventosPrivados');
})->name('eventosPrivados');

// Rutas del Carrito
Route::get('/carrito', [CarritoController::class, 'index'])->name('carrito');
Route::get('/carrito/count', [CarritoController::class, 'count'])->name('carrito.count');
Route::post('/carrito/agregar', [CarritoController::class, 'add'])->name('carrito.add');
Route::put('/carrito/{idProducto}', [CarritoController::class, 'update'])->name('carrito.update');
Route::delete('/carrito/{idProducto}', [CarritoController::class, 'remove'])->name('carrito.remove');
Route::delete('/carrito/vaciar', [CarritoController::class, 'clear'])->name('carrito.clear');

// Rutas de Checkout y Compras
Route::get('/checkout', [CompraController::class, 'checkout'])->name('checkout');
Route::post('/compras/transferencia', [CompraController::class, 'procesarTransferencia'])->name('compras.transferencia');
Route::post('/compras/efectivo', [CompraController::class, 'procesarEfectivo'])->name('compras.efectivo');

// Rutas de confirmación de compra
Route::get('/productos/compra/success', [CompraController::class, 'success'])->name('compras.success');
Route::get('/productos/compra/failure', [CompraController::class, 'failure'])->name('compras.failure');
Route::get('/productos/compra/pending', [CompraController::class, 'pending'])->name('compras.pending');

// Dashboard: Compras

Route::get('/talleres', [TallerController::class, 'talleresClient'])->name('talleres');

// Ruta de inscripción debe ir ANTES que la ruta general para evitar conflictos
Route::get('/talleres-{slug}-inscripcion', [TallerController::class, 'formInscripcion'])
    ->where('slug', '[A-Za-z0-9\-]+')
    ->name('taller.inscripcion');

// Ruta dinámica para talleres basada en el slug de la subcategoría
Route::get('/talleres-{slug}', [TallerController::class, 'tallerView'])
    ->where('slug', '[A-Za-z0-9\-]+')
    ->name('taller.view');

Route::middleware(['auth'])->group(function () {
    // Rutas de perfil
    Route::get('/perfil', [ProfileController::class, 'show'])->name('profile.show');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/perfil/talleres', [ProfileController::class, 'talleres'])->name('profile.talleres');
    Route::get('/perfil/compras', [ProfileController::class, 'compras'])->name('profile.compras');
});

Route::middleware(['auth', 'verified', 'role:admin'])
    ->prefix('dashboard')
    ->name('dashboard.')  
    ->group(function () {
        // Compras
        Route::get('/compras', [CompraController::class, 'dashboardIndex'])->name('compras.index');
        Route::get('/compras/{id}', [CompraController::class, 'dashboardShow'])->name('compras.show');
        Route::put('/compras/{id}', [CompraController::class, 'update'])->name('compras.update');
        
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
    Route::put('/talleres/{id}/menus-html', [TallerController::class, 'updateMenusHtml'])->name('talleres.updateMenusHtml');


        Route::delete('/talleres/{id}', [TallerController::class, 'destroy'])->name('talleres.destroy'); 
        Route::put('/talleres/{id}/eliminar', [TallerController::class, 'desactivar'])->name('talleres.eliminar');
        Route::get('/talleres/{id}', [TallerController::class, 'view'])->name('talleres.view');    
        Route::put('/taller-cliente/{id}/actualizar-pago', [TallerClienteController::class, 'actualizarPago'])->name('taller.actualizarPago');

        // Rutas de Productos
        Route::get('/productos', [ProductoController::class, 'indexDashboard'])->name('productos.index');
        Route::get('/productos/create', [ProductoController::class, 'create'])->name('productos.create');
        Route::post('/productos', [ProductoController::class, 'store'])->name('productos.store');
        Route::get('/productos/{id}/edit', [ProductoController::class, 'edit'])->name('productos.edit');
        Route::put('/productos/{id}', [ProductoController::class, 'update'])->name('productos.update');
        Route::delete('/productos/{id}', [ProductoController::class, 'destroy'])->name('productos.destroy');

        Route::get('/archivos', [App\Http\Controllers\ArchivosController::class, 'index'])->name('archivos.index');
        Route::post('/archivos/upload', [App\Http\Controllers\ArchivosController::class, 'upload'])->name('archivos.upload');
        Route::post('/archivos/upload-parapintar', [App\Http\Controllers\ArchivosController::class, 'uploadPiezasParaPintar'])->name('archivos.upload.parapintar');
        Route::post('/archivos/upload-realizadas', [App\Http\Controllers\ArchivosController::class, 'uploadPiezasRealizadas'])->name('archivos.upload.realizadas');
        // Rutas de Reviews
        Route::get('/reviews', [ReviewsController::class, 'indexDashboard'])->name('reviews.index.dashboard');
        Route::get('/reviews/enabled', [ReviewsController::class, 'indexEnabledDashboard'])->name('reviews.enabled.dashboard');
        
        // Acciones de Reviews
        Route::put('/reviews/{id}/toggle-status', [ReviewsController::class, 'toggleStatus'])->name('reviews.toggle-status');
        Route::put('/reviews/{id}/enable', [ReviewsController::class, 'enable'])->name('reviews.enable');
        Route::put('/reviews/{id}/disable', [ReviewsController::class, 'disable'])->name('reviews.disable');
        Route::delete('/reviews/{id}', [ReviewsController::class, 'delete'])->name('reviews.delete');
        
        // Ruta legacy para compatibilidad
        Route::put('/reviews/{id}/approve', [ReviewsController::class, 'approve'])->name('reviews.approve');
        
        // Rutas de Subcategorías
        Route::get('/subcategorias', [\App\Http\Controllers\SubcategoriaController::class, 'index'])->name('subcategorias.index');
    });

Route::post('/dashboard/talleres/actualizar-estados-pago', [TallerController::class, 'actualizarEstadosPagoMasivo'])->name('dashboard.talleres.actualizarEstadosPagoMasivo');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});




Route::get('/pago-success', fn() => Inertia::render('Pagos/Success'))->name('pago.success');
Route::get('/pago-failure', fn() => Inertia::render('Pagos/Failure'))->name('pago.failure');
Route::get('/pago-pending', fn() => Inertia::render('Pagos/Pending'))->name('pago.pending');



Route::fallback(function () {
    return Inertia::render('Errors/404')->toResponse(request())->setStatusCode(404);
});

Route::post('/talleres/transferencia', [TallerController::class, 'procesarTransferencia'])->name('talleres.transferencia');

// Rutas del Newsletter
Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe'])->name('newsletter.subscribe');
Route::get('/newsletter/verify/{token}', [NewsletterController::class, 'verify'])->name('newsletter.verify');
Route::get('/newsletter/unsubscribe/{token}', [NewsletterController::class, 'unsubscribe'])->name('newsletter.unsubscribe');

Route::post('/upload-image', [ImageController::class, 'store'])->name('image.store');

// Página de contacto
Route::get('/contacto', function() {
    return Inertia::render('Contacto');
})->name('contacto');

// Procesar formulario de contacto
Route::post('/contacto', [ContactoController::class, 'enviar'])->name('contacto.enviar');

Route::get('/talleres/{id}/lista-participantes', [TallerController::class, 'listaParticipantes'])->name('talleres.lista-participantes');
Route::get('/talleres/{id}/descargar-lista', [TallerController::class, 'descargarListaParticipantes'])->name('talleres.descargar-lista');

Route::get('/taller/{id}/referido/{codigoReferido}', [App\Http\Controllers\TallerController::class, 'referido'])->name('taller.referido');

Route::post('/dashboard/talleres/{id}/send-email', [TallerController::class, 'sendEmail'])->name('dashboard.taller.send-email');

// Reseñas via invitación
Route::get('/reviews/invitation/{token}', [ReviewsController::class, 'showInviteForm'])->name('reviews.invite');
Route::post('/reviews/submit', [ReviewsController::class, 'submit'])->name('reviews.submit');
Route::get('/reviews/thanks', function () { return Inertia::render('Talleres/ReviewThanks'); })->name('reviews.thanks');

require __DIR__.'/auth.php';

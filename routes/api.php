<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MercadoPagoController;
use App\Http\Controllers\CaptchaController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Rutas de MercadoPago
Route::post('/mercadopago/create-preference', [MercadoPagoController::class, 'createPreference'])->name('mercadopago.createPreference');
Route::post('/mercadopago/notifications', [MercadoPagoController::class, 'handleNotification'])->name('mercadopago.notifications');

// Rutas de Captcha
Route::post('/validar-captcha', [CaptchaController::class, 'validarCaptcha']);

// Aquí puedes agregar más rutas de tu API si es necesario

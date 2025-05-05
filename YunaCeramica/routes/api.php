<?php

use App\Http\Controllers\MetodoPagoController;
use Illuminate\Support\Facades\Route;

Route::post('/crear-preferencia', [MetodoPagoController::class, 'crearPreferencia']);

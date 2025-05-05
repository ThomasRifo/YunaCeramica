<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use MercadoPago\SDK;
use MercadoPago\Preference;
use MercadoPago\Item;
use Illuminate\Support\Str;

class PagoController extends Controller
{
    public function pagarTaller(Request $request)
{
    SDK::setAccessToken(config('services.mercadopago.access_token'));

    $user = auth()->user();
    $datos = $request->validate([
        'idTaller' => 'required|exists:talleres,id',
        'monto' => 'required|numeric|min:1',
        'cantidad' => 'required|integer|min:1',
        'tipoPago' => 'required|in:total,reserva',
    ]);

    $item = new Item();
    $item->title = "Reserva para taller #{$datos['idTaller']}";
    $item->quantity = 1;
    $item->unit_price = (float) $datos['monto'];

    $preference = new Preference();
    $preference->items = [$item];
    $preference->external_reference = Str::uuid(); // Único por transacción
    $preference->back_urls = [
        "success" => route('pago.success'),
        "failure" => route('pago.failure'),
        "pending" => route('pago.pending'),
    ];
    $preference->auto_return = "approved";
    $preference->save();

    // Opcional: guardar intento en base de datos con status 'pendiente'

    return response()->json(['init_point' => $preference->init_point]);
}
}

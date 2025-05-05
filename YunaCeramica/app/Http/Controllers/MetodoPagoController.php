<?php

// app/Http/Controllers/MercadoPagoController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use MercadoPago\SDK;
use MercadoPago\Preference;
use MercadoPago\Item;

class MercadoPagoController extends Controller
{
    public function crearPreferencia(Request $request)
    {
        // Inicializá el SDK con tu access token
        SDK::setAccessToken(env('MP_ACCESS_TOKEN'));

        $data = $request->validate([
            'title' => 'required|string',
            'quantity' => 'required|integer|min:1',
            'unit_price' => 'required|numeric|min:0',
        ]);

        $item = new Item();
        $item->title = $data['title'];
        $item->quantity = $data['quantity'];
        $item->unit_price = $data['unit_price'];

        $preference = new Preference();
        $preference->items = [$item];
        $preference->save();

        return response()->json([
            'preferenceId' => $preference->id,
        ]);
    }
}

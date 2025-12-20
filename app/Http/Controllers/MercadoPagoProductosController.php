<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use MercadoPago\MercadoPagoConfig;
use MercadoPago\Client\Preference\PreferenceClient;
use MercadoPago\Client\Payment\PaymentClient;
use App\Models\Compra;
use App\Models\Producto;
use App\Models\DetalleCompra;
use App\Models\EstadoPago;
use App\Models\EstadoPedido;
use Illuminate\Support\Facades\Mail;
use App\Mail\ConfirmacionCompra;

class MercadoPagoProductosController extends Controller
{
    public function __construct()
    {
        $accessToken = config('services.mercadopago.access_token', env('MERCADOPAGO_ACCESS_TOKEN'));
        if (!$accessToken) {
            Log::error('Token de acceso de MercadoPago no configurado.');
        } else {
            MercadoPagoConfig::setAccessToken($accessToken);
        }
    }

    /**
     * Crear preferencia de MercadoPago para productos
     */
    public function createPreference(Request $request)
    {
        Log::info('🟢 INICIO createPreference PRODUCTOS', ['request' => $request->all()]);
        
        $validatedData = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.idProducto' => 'required|exists:productos,id',
            'items.*.cantidad' => 'required|integer|min:1',
            'items.*.precioUnitario' => 'required|numeric|min:0',
            'datos_cliente' => 'required|array',
            'datos_cliente.nombre' => 'required|string|max:100',
            'datos_cliente.apellido' => 'required|string|max:100',
            'datos_cliente.email' => 'required|email|max:100',
            'datos_cliente.telefono' => 'nullable|string|max:20',
            'direccion' => 'required|array',
            'direccion.calle' => 'required|string|max:255',
            'direccion.numero' => 'required|integer',
            'direccion.ciudad' => 'required|string|max:100',
            'direccion.provincia' => 'required|string|max:100',
            'direccion.codigoPostal' => 'required|string|max:20',
            'direccion.piso' => 'nullable|string|max:50',
            'direccion.departamento' => 'nullable|string|max:50',
            'tipo_entrega' => 'required|in:envio,retiro',
            'costo_envio' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'observaciones' => 'nullable|string|max:1000',
        ]);

        $externalReference = 'PRODUCTO_' . uniqid();
        $compra = null;

        DB::beginTransaction();

        try {
            // Validar stock de todos los productos
            foreach ($validatedData['items'] as $item) {
                $producto = Producto::findOrFail($item['idProducto']);
                
                if (!$producto->activo) {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'message' => "El producto '{$producto->nombre}' no está disponible.",
                    ], 400);
                }
                
                if ($producto->stock < $item['cantidad']) {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'message' => "No hay suficiente stock del producto '{$producto->nombre}'. Stock disponible: {$producto->stock}",
                    ], 400);
                }
            }

            // Obtener estados
            $estadoPagoPendiente = EstadoPago::where('nombre', 'Pendiente')->first();
            $estadoPedidoPendiente = EstadoPedido::where('nombre', 'Pendiente')->first();
            
            if (!$estadoPagoPendiente || !$estadoPedidoPendiente) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Error: Estados de pago o pedido no configurados correctamente.',
                ], 500);
            }

            // Crear la compra en estado pendiente
            // Permitir compras sin autenticación (idCliente puede ser null)
            $compra = Compra::create([
                'idCliente' => auth()->check() ? auth()->id() : null,
                'idEstado' => $estadoPedidoPendiente->id,
                'idEstadoPago' => $estadoPagoPendiente->id,
                'idMetodoPago' => 2, // 2 = MercadoPago
                'total' => $validatedData['total'],
                'nombre' => $validatedData['datos_cliente']['nombre'],
                'apellido' => $validatedData['datos_cliente']['apellido'],
                'email' => $validatedData['datos_cliente']['email'],
                'telefono' => $validatedData['datos_cliente']['telefono'] ?? null,
                'calle' => $validatedData['direccion']['calle'],
                'numero' => $validatedData['direccion']['numero'],
                'ciudad' => $validatedData['direccion']['ciudad'],
                'provincia' => $validatedData['direccion']['provincia'],
                'codigoPostal' => $validatedData['direccion']['codigoPostal'],
                'piso' => $validatedData['direccion']['piso'] ?? null,
                'departamento' => $validatedData['direccion']['departamento'] ?? null,
                'tipo_entrega' => $validatedData['tipo_entrega'],
                'costo_envio' => $validatedData['costo_envio'],
                'observaciones' => $validatedData['observaciones'] ?? null,
                'external_reference_mp' => $externalReference,
            ]);

            // Crear los detalles de compra
            foreach ($validatedData['items'] as $item) {
                $producto = Producto::findOrFail($item['idProducto']);
                
                DetalleCompra::create([
                    'idCompra' => $compra->id,
                    'idProducto' => $producto->id,
                    'nombreProducto' => $producto->nombre,
                    'sku' => $producto->sku,
                    'cantidad' => $item['cantidad'],
                    'precioUnitario' => $item['precioUnitario'],
                ]);
            }

            // Preparar items para MercadoPago
            $items = [];
            foreach ($validatedData['items'] as $item) {
                $producto = Producto::findOrFail($item['idProducto']);
                $items[] = [
                    'id' => (string) $producto->id,
                    'title' => $producto->nombre,
                    'description' => substr($producto->descripcion ?? 'Producto de Yuna Cerámica', 0, 255),
                    'quantity' => $item['cantidad'],
                    'unit_price' => (float) $item['precioUnitario'],
                    'currency_id' => 'ARS',
                ];
            }

            // Si hay costo de envío, agregarlo como item adicional
            if ($validatedData['costo_envio'] > 0) {
                $items[] = [
                    'id' => 'envio',
                    'title' => 'Envío a domicilio',
                    'description' => 'Costo de envío',
                    'quantity' => 1,
                    'unit_price' => (float) $validatedData['costo_envio'],
                    'currency_id' => 'ARS',
                ];
            }

            // Asegurar que APP_URL tenga protocolo y puerto si es necesario
            $appUrl = env('APP_URL', 'http://localhost:8000');
            if (!preg_match('/^https?:\/\//', $appUrl)) {
                $appUrl = 'http://' . $appUrl;
            }
            if (strpos($appUrl, 'localhost') !== false && strpos($appUrl, ':') === false) {
                $appUrl = str_replace('localhost', 'localhost:8000', $appUrl);
            }
            $appUrl = rtrim($appUrl, '/');

            $preference_request_data = [
                'items' => $items,
                'payer' => [
                    'name' => $validatedData['datos_cliente']['nombre'],
                    'surname' => $validatedData['datos_cliente']['apellido'],
                    'email' => $validatedData['datos_cliente']['email'],
                ],
                'back_urls' => [
                    'success' => $appUrl . '/productos/compra/success?compra_id=' . $compra->id,
                    'failure' => $appUrl . '/productos/compra/failure',
                    'pending' => $appUrl . '/productos/compra/pending?compra_id=' . $compra->id,
                ],
                'notification_url' => $appUrl . '/api/mercadopago/productos/notifications',
                'external_reference' => $externalReference,
            ];

            // Solo agregar auto_return si no es localhost
            if (strpos($appUrl, 'localhost') === false && strpos($appUrl, '127.0.0.1') === false) {
                $preference_request_data['auto_return'] = 'approved';
            }

            if (!empty($validatedData['datos_cliente']['telefono'])) {
                $preference_request_data['payer']['phone'] = [
                    'number' => $validatedData['datos_cliente']['telefono']
                ];
            }

            Log::debug('🔗 Generated Back URLs PRODUCTOS:', $preference_request_data['back_urls']);
            Log::debug('🔔 Generated Notification URL PRODUCTOS:', ['url' => $preference_request_data['notification_url']]);

            $preference_client = new PreferenceClient();
            
            try {
                $created_preference = $preference_client->create($preference_request_data);
            } catch (\MercadoPago\Exceptions\MPApiException $e) {
                DB::rollBack();
                $apiResponse = $e->getApiResponse();
                $errorContent = $apiResponse ? $apiResponse->getContent() : null;
                Log::error('MP API Exception al crear preferencia PRODUCTOS: ' . $e->getMessage());
                Log::error('Error content: ' . json_encode($errorContent));
                Log::error('Request data: ' . json_encode($preference_request_data));
                return response()->json([
                    'message' => 'Error al crear preferencia de MercadoPago: ' . $e->getMessage(),
                    'details' => $errorContent,
                ], 500);
            }

            if ($created_preference && $created_preference->id && $created_preference->init_point) {
                $compra->update(['preference_id_mp' => $created_preference->id]);
                DB::commit();
                Log::info('✅ Preferencia de MercadoPago PRODUCTOS creada correctamente', [
                    'init_point' => $created_preference->init_point,
                    'preference_id' => $created_preference->id,
                    'external_reference' => $externalReference,
                    'compra_id' => $compra->id,
                ]);
                return response()->json([
                    'mercadopago' => [
                        'init_point' => $created_preference->init_point,
                        'preference_id' => $created_preference->id,
                        'external_reference' => $externalReference,
                    ],
                    'compra_id' => $compra->id,
                ], 200);
            } else {
                DB::rollBack();
                Log::error('❌ Error al crear preferencia de MercadoPago PRODUCTOS: No se obtuvo ID o init_point.');
                return response()->json([
                    'message' => 'No se pudo generar el link de pago. Intente más tarde.',
                ], 500);
            }

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('❌ Error inesperado al crear preferencia MP PRODUCTOS: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            Log::error('Exception class: ' . get_class($e));
            return response()->json([
                'message' => 'Error inesperado al procesar la solicitud: ' . $e->getMessage(),
                'error_type' => get_class($e),
            ], 500);
        }
    }

    /**
     * Manejar notificaciones de MercadoPago para productos
     */
    public function handleNotification(Request $request)
    {
        Log::info('🔔 Notificación de MercadoPago PRODUCTOS recibida', ['data' => $request->all()]);

        $paymentId = $request->input('data.id');
        if (!$paymentId) {
            Log::warning('⚠️ Notificación sin payment_id');
            return response()->json(['message' => 'No payment ID'], 400);
        }

        try {
            $payment_client = new PaymentClient();
            $payment = $payment_client->get($paymentId);

            if (!$payment || !$payment->external_reference) {
                Log::warning('⚠️ Payment sin external_reference');
                return response()->json(['message' => 'No external reference'], 400);
            }

            // Verificar que sea una compra de productos (empieza con PRODUCTO_)
            if (strpos($payment->external_reference, 'PRODUCTO_') !== 0) {
                Log::info('🔔 Notificación no es de productos, ignorando', ['external_reference' => $payment->external_reference]);
                return response()->json(['message' => 'Not a product payment'], 200);
            }

            $compra = Compra::with('detalles')->where('external_reference_mp', $payment->external_reference)->first();

            if (!$compra) {
                Log::warning('⚠️ Compra no encontrada para external_reference: ' . $payment->external_reference);
                return response()->json(['message' => 'Compra no encontrada'], 404);
            }

            DB::beginTransaction();

            try {
                // Actualizar datos de pago
                $compra->payment_id_mp = $payment->id;
                $compra->monto_total_pagado_mp = $payment->transaction_amount;
                $compra->datos_pago_mp = json_encode($payment->toArray());

                // Mapear estado de MercadoPago a estado de pago
                $estadoPago = $this->mapMercadoPagoStatusToIdEstadoPago($payment->status);
                
                if ($estadoPago) {
                    $estadoPagoAnterior = $compra->idEstadoPago;
                    $compra->idEstadoPago = $estadoPago;

                    // Si el pago fue aprobado, descontar stock y enviar email
                    if ($estadoPago == 3 && $estadoPagoAnterior != 3) {
                        foreach ($compra->detalles as $detalle) {
                            $producto = Producto::find($detalle->idProducto);
                            if ($producto) {
                                $producto->decrement('stock', $detalle->cantidad);
                                $producto->increment('cantVendida', $detalle->cantidad);
                            }
                        }

                        // Enviar email de confirmación
                        try {
                            Mail::to($compra->email)->send(new ConfirmacionCompra($compra));
                        } catch (\Exception $e) {
                            Log::error('Error al enviar email de confirmación PRODUCTOS: ' . $e->getMessage());
                        }
                    }

                    // Si se canceló un pago aprobado, restaurar stock
                    if ($estadoPagoAnterior == 3 && $estadoPago != 3) {
                        foreach ($compra->detalles as $detalle) {
                            $producto = Producto::find($detalle->idProducto);
                            if ($producto) {
                                $producto->increment('stock', $detalle->cantidad);
                                $producto->decrement('cantVendida', $detalle->cantidad);
                            }
                        }
                    }
                }

                $compra->save();
                DB::commit();

                Log::info('✅ Compra actualizada correctamente', [
                    'compra_id' => $compra->id,
                    'payment_id' => $payment->id,
                    'status' => $payment->status,
                ]);

                return response()->json(['message' => 'OK'], 200);

            } catch (\Exception $e) {
                DB::rollBack();
                Log::error('❌ Error al procesar notificación PRODUCTOS: ' . $e->getMessage());
                return response()->json(['message' => 'Error processing'], 500);
            }

        } catch (\Exception $e) {
            Log::error('❌ Error al obtener payment de MP PRODUCTOS: ' . $e->getMessage());
            return response()->json(['message' => 'Error getting payment'], 500);
        }
    }

    /**
     * Mapear estado de MercadoPago a ID de estado de pago
     */
    protected function mapMercadoPagoStatusToIdEstadoPago(string $mpStatus): ?int
    {
        $map = [
            'pending'    => 1, // Pendiente
            'in_process' => 1, // Pendiente
            'authorized' => 3, // Pagado
            'approved'   => 3, // Pagado
            'rejected'   => 4, // Rechazado
            'cancelled'  => 5, // Cancelado
            'refunded'   => 5, // Cancelado
            'charged_back' => 5, // Cancelado
        ];
        return $map[strtolower(trim($mpStatus))] ?? null;
    }
}


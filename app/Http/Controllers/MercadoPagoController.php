<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log; // Para registrar errores o información
use Illuminate\Support\Facades\Redirect; // Para respuestas de Inertia
use Illuminate\Support\Facades\DB; // Para transacciones de BD

// Configuración Global del SDK
use MercadoPago\MercadoPagoConfig;

// Clientes específicos del SDK v3.x
use MercadoPago\Client\Preference\PreferenceClient;
use MercadoPago\Client\Payment\PaymentClient;

// Clases de Recursos (DTOs) del SDK v3.x
use MercadoPago\Resources\Preference; 
use MercadoPago\Resources\Payment;
// Si usas MerchantOrder para notificaciones, también necesitarías:
// use MercadoPago\Resources\MerchantOrder;

use App\Models\Taller;            // Modelo Taller
use App\Models\TallerCliente;     // Modelo TallerCliente
use App\Models\Acompaniante;      // Modelo Acompaniante
// Asumiendo que tienes un modelo EstadoPago y Menu también, aunque no se usen directamente aquí para crear.

class MercadoPagoController extends Controller
{
    public function __construct()
    {
        // Configura el Access Token de MercadoPago al instanciar el controlador
        // Asegúrate de tener MERCADOPAGO_ACCESS_TOKEN en tu .env
        // y preferiblemente en config/services.php como 'mercadopago.access_token'
        $accessToken = config('services.mercadopago.access_token', env('MERCADOPAGO_ACCESS_TOKEN'));
        if (!$accessToken) {
            Log::error('Token de acceso de MercadoPago no configurado.');
            // Podrías lanzar una excepción o manejarlo de otra forma
        } else {
            MercadoPagoConfig::setAccessToken($accessToken); // ACTUALIZADO: Usar MercadoPagoConfig
        }
    }

    public function createPreference(Request $request)
    {
        Log::info('🟢 INICIO createPreference', ['request' => $request->all()]);
        $validatedData = $request->validate([
            'tallerId' => 'required|numeric|exists:talleres,id',
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string|max:255',
            'cantidad' => 'required|integer|min:1',
            'precioUnitario' => 'required|numeric|min:0',
            'datos_cliente' => 'required|array',
            'datos_cliente.nombre' => 'required|string|max:100',
            'datos_cliente.apellido' => 'required|string|max:100',
            'datos_cliente.email' => 'required|email|max:100',
            'datos_cliente.telefono' => 'nullable|string|max:20',
            'participantes' => 'required|array|min:1',
            'participantes.*.nombre' => 'required|string|max:100',
            'participantes.*.apellido' => 'required|string|max:100',
            'participantes.*.email' => 'required|email|max:100',
            'participantes.*.telefono' => 'nullable|string|max:20',
            'participantes.*.menu_id' => 'required|exists:menus,id',
        ]);

        $externalReference = 'TALLER_' . $validatedData['tallerId'] . '_' . uniqid();
        $tallerCliente = null;

        DB::beginTransaction();

        try {
            $taller = Taller::findOrFail($validatedData['tallerId']);
            $preference_request_data = [
                'items' => [
                    [
                        'id' => (string) $validatedData['tallerId'],
                        'title' => $validatedData['titulo'],
                        'description' => $validatedData['descripcion'],
                        'quantity' => $validatedData['cantidad'],
                        'unit_price' => (float) $validatedData['precioUnitario'],
                        'currency_id' => 'ARS',
                    ]
                ],
                'payer' => [
                    'name' => $validatedData['datos_cliente']['nombre'],
                    'surname' => $validatedData['datos_cliente']['apellido'],
                    'email' => $validatedData['datos_cliente']['email'],
                ],
                'back_urls' => [
                    'success' => env('APP_URL') . '/talleres-' . $taller->subcategoria->url . '?pago=success',
                    'failure' => env('APP_URL') . '/talleres-' . $taller->subcategoria->url . '-inscripcion?pago=failure',
                    'pending' => env('APP_URL') . '/talleres-' . $taller->subcategoria->url . '-inscripcion?pago=pending',
                ],
                'auto_return' => 'approved',
                'notification_url' => route('mercadopago.notifications'),
                'external_reference' => $externalReference,
            ];
            if (!empty($validatedData['datos_cliente']['telefono'])) {
                $preference_request_data['payer']['phone'] = [
                    'number' => $validatedData['datos_cliente']['telefono']
                ];
            }

            Log::debug('🔗 Generated Back URLs:', $preference_request_data['back_urls']);
            Log::debug('🔔 Generated Notification URL:', ['url' => $preference_request_data['notification_url']]);

            $idEstadoPendiente = 1;
            $datosClientePrincipal = $validatedData['datos_cliente'];
            $menuClientePrincipalId = $validatedData['participantes'][0]['menu_id'];

            $tallerCliente = TallerCliente::create([
                'idTaller' => $validatedData['tallerId'],
                'email_cliente' => $datosClientePrincipal['email'],
                'nombre_cliente' => $datosClientePrincipal['nombre'],
                'apellido_cliente' => $datosClientePrincipal['apellido'],
                'telefono_cliente' => $datosClientePrincipal['telefono'] ?? null,
                'fecha' => now(),
                'cantPersonas' => $validatedData['cantidad'],
                'idMenu' => $menuClientePrincipalId,
                'idEstadoPago' => $idEstadoPendiente,
                'idMetodoPago' => 2, // 2 = MercadoPago
                'external_reference_mp' => $externalReference,
                'monto_total_pagado_mp' => $validatedData['precioUnitario'] * $validatedData['cantidad'],
            ]);

            if ($validatedData['cantidad'] > 1) {
                foreach ($validatedData['participantes'] as $index => $participanteData) {
                    if ($index > 0) {
                        Acompaniante::create([
                            'idTallerCliente' => $tallerCliente->id,
                            'nombre' => $participanteData['nombre'],
                            'apellido' => $participanteData['apellido'],
                            'email' => $participanteData['email'],
                            'telefono' => $participanteData['telefono'] ?? null,
                            'idMenu' => $participanteData['menu_id'],
                            'payment_id_mp' => $tallerCliente->payment_id_mp,
                        ]);
                    }
                }
            }

            if ($taller) {
                if ($taller->cantInscriptos + $validatedData['cantidad'] > $taller->cupoMaximo) {
                    DB::rollBack();
                    Log::warning('⚠️ Intento de inscripción excede cupo máximo para taller ID: ' . $taller->id);
                    return response()->json([
                        'message' => 'No hay suficiente cupo disponible para la cantidad de personas seleccionada.',
                    ], 400);
                }
            } else {
                DB::rollBack();
                Log::error('❌ Taller no encontrado para ID: ' . $validatedData['tallerId']);
                return response()->json([
                    'message' => 'El taller seleccionado ya no existe.',
                ], 400);
            }
            
            $preference_client = new PreferenceClient();
            $created_preference = $preference_client->create($preference_request_data);

            if ($created_preference && $created_preference->id && $created_preference->init_point) {
                $tallerCliente->update(['preference_id_mp' => $created_preference->id]);
                DB::commit();
                Log::info('✅ Preferencia de MercadoPago creada correctamente', [
                    'init_point' => $created_preference->init_point,
                    'preference_id' => $created_preference->id,
                    'external_reference' => $externalReference,
                ]);
                return response()->json([
                    'mercadopago' => [
                        'init_point' => $created_preference->init_point,
                        'preference_id' => $created_preference->id,
                        'external_reference' => $externalReference,
                    ]
                ], 200);

            } else {
                DB::rollBack(); 
                Log::error('❌ Error al crear preferencia de MercadoPago: No se obtuvo ID o init_point.', (array) $created_preference);
                return response()->json([
                    'message' => 'No se pudo generar el link de pago (MP). Intente más tarde.',
                ], 500);
            }

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::warning('⚠️ Error de validación al crear preferencia MP: ' . $e->getMessage(), $e->errors());
            return response()->json([
                'message' => 'Por favor, verifica los datos ingresados.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\MercadoPago\Exceptions\MPApiException $e) {
            DB::rollBack();
            $errorMessage = 'Error con MercadoPago: ' . $e->getMessage();
            $errorDetails = $e->getApiResponse() ? $e->getApiResponse()->getContent() : null;
            Log::error('❌ MP API Exception en createPreference: ' . $errorMessage . ' - ' . json_encode($errorDetails), (array)$errorDetails);
            return response()->json([
                'message' => $errorMessage,
                'details' => $errorDetails,
            ], 400);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('❌ Error general al crear preferencia de MP: ' . $e->getMessage() . ' Stack: ' . $e->getTraceAsString());
            return response()->json([
                'message' => 'Ocurrió un error inesperado. Por favor, intenta de nuevo.',
            ], 500);
        }
    }

    public function handleNotification(Request $request)
    {
        // Aquí va la lógica para manejar las notificaciones de MercadoPago (webhooks)
        // Este es un paso crucial y se implementará a continuación.
        Log::info('Notificación de MercadoPago recibida:', $request->all());
        
        // Validar el origen de la notificación (opcional pero recomendado)

        $type = $request->input('type');
        $topic = $request->input('topic'); // Algunas notificaciones usan 'topic' en lugar de 'type' directamente para pagos.
        $data_id = null;

        if ($type === 'payment' && $request->has('data.id')) {
            $data_id = $request->input('data.id');
        } elseif ($topic === 'payment' && $request->has('id')) { // Otro formato común de webhook
             $data_id = $request->input('id');
        } elseif ($request->has('resource') && str_contains($request->input('resource'), 'merchant_orders')) {
            // Para notificaciones de merchant_order más nuevas (usan 'resource' URL)
            // $resource_uri = $request->input('resource');
            // $merchant_order_id = basename($resource_uri);
            // $merchantOrder = \MercadoPago\Resources\MerchantOrder::find_by_id($merchant_order_id);
            // if ($merchantOrder) {
            //     foreach ($merchantOrder->payments as $payment_data) {
            //          // Procesar cada pago dentro de la orden
            //          $payment_obj = Payment::find_by_id($payment_data->id);
            //          if ($payment_obj) { /* ... lógica de actualización de BD ... */ }
            //     }
            // }
            // Log::info('Merchant Order procesada desde resource URI');
            // return response()->json(['status' => 'received_merchant_order_uri'], 200);
        }


        if ($data_id) {
            DB::beginTransaction();
            try {
                $payment_client = new PaymentClient();
                $payment_resource = $payment_client->get((int)$data_id); 
                
                if ($payment_resource && $payment_resource->external_reference) {
                    Log::info('Pago encontrado por SDK v3:', (array)$payment_resource);
                    $externalReference = $payment_resource->external_reference;
                    $status_mp = $payment_resource->status;

                    $tallerCliente = TallerCliente::where('external_reference_mp', $externalReference)->first();

                    if ($tallerCliente) {
                        $idEstadoPagoPrevio = $tallerCliente->idEstadoPago;
                        $idEstadoPagoNuevo = $this->mapMercadoPagoStatusToIdEstadoPago($status_mp);
                        
                        if ($idEstadoPagoNuevo !== null && $idEstadoPagoNuevo !== $idEstadoPagoPrevio) {
                            $tallerCliente->idEstadoPago = $idEstadoPagoNuevo;
                            $tallerCliente->payment_id_mp = $payment_resource->id;
                            $tallerCliente->monto_total_pagado_mp = $payment_resource->transaction_amount; 
                            $tallerCliente->datos_pago_mp = (array) $payment_resource;
                            $tallerCliente->save();

                            // Actualizar cupos del taller si el pago es aprobado y antes no lo estaba
                            $estadoAprobadoId = 3; // Asumiendo ID 3 para 'Pagado'
                            $taller = Taller::find($tallerCliente->idTaller);
                            if ($taller) {
                                if ($idEstadoPagoNuevo === $estadoAprobadoId && ($idEstadoPagoPrevio !== $estadoAprobadoId)) {
                                    $taller->increment('cantInscriptos', $tallerCliente->cantPersonas);
                                } elseif ($idEstadoPagoPrevio === $estadoAprobadoId && $idEstadoPagoNuevo !== $estadoAprobadoId) {
                                    // Si el pago fue aprobado y ahora se cancela/rechaza, liberar cupo
                                    $taller->decrement('cantInscriptos', $tallerCliente->cantPersonas);
                                }
                            }
                            Log::info('Inscripción actualizada por webhook:', ['ext_ref' => $externalReference, 'new_status_mp' => $status_mp, 'new_estado_id' => $idEstadoPagoNuevo]);
                            // Aquí también podrías enviar un email de confirmación al cliente
                        } else {
                            Log::info('Webhook recibido, pero sin cambio de estado relevante o estado no mapeado:', ['ext_ref' => $externalReference, 'status_mp' => $status_mp]);
                        }
                    } else {
                        Log::warning('No se encontró TallerCliente para external_reference:', ['ext_ref' => $externalReference]);
                    }
                } else {
                     Log::warning('Pago no encontrado en MP o sin external_reference (v3 client):', ['payment_id' => $data_id]);
                }
                DB::commit();
            } catch (\MercadoPago\Exceptions\MPApiException $e) {
                DB::rollBack();
                Log::error('MP API Exception en webhook (v3 client): ' . $e->getMessage() . ' - ' . json_encode($e->getApiResponse()->getContent()), $e->getApiResponse()->getContent());
                return response()->json(['status' => 'error', 'message' => 'MP API error'], 500); 
            } catch (\Exception $e) {
                DB::rollBack();
                Log::error('Error general en webhook MP (v3 client): ' . $e->getMessage(). ' Stack: ' . $e->getTraceAsString());
                return response()->json(['status' => 'error', 'message' => 'Internal server error'], 500); 
            }
        }
        return response()->json(['status' => 'received'], 200);
    }

    protected function mapMercadoPagoStatusToIdEstadoPago(string $mpStatus) : ?int
    {
        $map = [
            'pending'    => 1, // ID 1 para 'Pendiente'
            'in_process' => 1, // Tratar como pendiente o crear un estado 'En Proceso'
            'authorized' => 3, // ID 3 para 'Pagado' (autorizado pero aún no capturado, MP lo aprueba después)
            'approved'   => 3, // ID 3 para 'Pagado'
            'rejected'   => 4, // ID 4 para 'Rechazado'
            'cancelled'  => 5, // ID 5 para 'Cancelado'
            'refunded'   => 5, // Podrías tener un estado 'Reembolsado' específico
            'charged_back' => 5, // Podrías tener un estado 'Contracargo' específico
        ];
        return $map[strtolower(trim($mpStatus))] ?? null;
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log; // Para registrar errores o información
use Illuminate\Support\Facades\Redirect; // Para respuestas de Inertia
use MercadoPago\MercadoPagoConfig; // ACTUALIZADO: Usar MercadoPagoConfig para el Access Token
use MercadoPago\Preference; // Clase Preference
use MercadoPago\Item;       // Clase Item
use MercadoPago\Payer;      // Clase Payer
use MercadoPago\Payment;    // Clase Payment (para notificaciones)
// Si usas MerchantOrder para notificaciones, también necesitarías:
// use MercadoPago\MerchantOrder;

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
        try {
            $validatedData = $request->validate([
                'tallerId' => 'required|numeric',
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
                'participantes.*.menu_id' => 'required|string', // o numeric si es un ID
            ]);

            $preference = new Preference();

            // Crear el ítem para la preferencia
            $item = new Item();
            $item->id = $validatedData['tallerId'];
            $item->title = $validatedData['titulo'];
            $item->description = $validatedData['descripcion'];
            $item->quantity = $validatedData['cantidad'];
            $item->unit_price = $validatedData['precioUnitario'];
            $item->currency_id = 'ARS'; // Moneda Argentina

            $preference->items = [$item];

            // Información del pagador (tomada de datos_cliente)
            $payer = new Payer();
            $payer->name = $validatedData['datos_cliente']['nombre'];
            $payer->surname = $validatedData['datos_cliente']['apellido'];
            $payer->email = $validatedData['datos_cliente']['email'];
            if (!empty($validatedData['datos_cliente']['telefono'])) {
                // MercadoPago espera el teléfono como un objeto con area_code y number
                // Aquí asumimos un formato simple, ajústalo si tienes más detalles
                $payer->phone = [
                    'number' => $validatedData['datos_cliente']['telefono']
                ];
            }
            $preference->payer = $payer;

            // URLs de Redirección
            // Cambia estas URLs por las rutas reales de tu aplicación
            $preference->back_urls = [
                'success' => route('inscripcion.success'),
                'failure' => route('inscripcion.failure'),
                'pending' => route('inscripcion.pending'),
            ];
            $preference->auto_return = 'approved'; // Retorno automático solo si el pago es aprobado

            // URL de Notificaciones (Webhook)
            // Esta URL debe ser accesible públicamente por MercadoPago
            $preference->notification_url = route('mercadopago.notifications');

            // Referencia externa: puede ser el ID de la inscripción/pedido en tu sistema
            // Es muy útil para conciliar pagos.
            $externalReference = 'TALLER_' . $validatedData['tallerId'] . '_' . uniqid();
            $preference->external_reference = $externalReference;
            
            // Aquí podrías guardar la información de los participantes (del array 'participantes') 
            // y la $externalReference en tu base de datos *antes* de crear la preferencia, 
            // marcándola como 'pendiente de pago'.
            // Ejemplo: Inscripcion::create([... , 'external_reference' => $externalReference, 'estado' => 'pendiente']);

            $preference->save(); // Esto realiza la llamada a la API de MercadoPago

            if ($preference->id && $preference->init_point) {
                // Para Inertia, devolvemos el init_point a través de flash data
                return Redirect::back()->with('mercadopago', [
                    'init_point' => $preference->init_point,
                    'preference_id' => $preference->id,
                    'external_reference' => $externalReference,
                ]);
            } else {
                Log::error('Error al crear preferencia de MercadoPago', (array) ($preference->last_error ?? 'Error desconocido al guardar preferencia'));
                return Redirect::back()->withErrors(['mercadopago' => 'No se pudo generar el link de pago. Intente más tarde.'])->with('mercadopago', ['message' => 'No se pudo generar el link de pago. Intente más tarde.']);
            }

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('Error de validación al crear preferencia MP: ' . $e->getMessage(), $e->errors());
            return Redirect::back()->withErrors($e->errors())->withInput()->with('mercadopago', ['message' => 'Por favor, verifica los datos ingresados.']);
        } catch (\MercadoPago\Exceptions\MPApiException $e) { // Capturar excepciones específicas de MP
            Log::error('MP API Exception: ' . $e->getMessage() . ' - ' . json_encode($e->getApiResponse()));
            return Redirect::back()->withErrors(['mercadopago' => 'Error con MercadoPago: ' . $e->getMessage()])->with('mercadopago', ['message' => 'Error con MercadoPago: ' . $e->getMessage()]);
        } catch (\Exception $e) {
            Log::error('Error general al crear preferencia de MP: ' . $e->getMessage());
            // Devuelve un error genérico al cliente
            return Redirect::back()->withErrors(['mercadopago' => 'Ocurrió un error inesperado. Por favor, intenta de nuevo.'])->with('mercadopago', ['message' => 'Ocurrió un error inesperado. Por favor, intenta de nuevo.']);
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
            // $merchantOrder = \MercadoPago\MerchantOrder::find_by_id($merchant_order_id);
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
            try {
                $payment = Payment::find_by_id($data_id); // Usar la clase Payment directamente
                
                if ($payment) {
                    Log::info('Pago encontrado:', (array)$payment);
                    $externalReference = $payment->external_reference;
                    $status = $payment->status;
                    $statusDetail = $payment->status_detail;

                    // Aquí actualizas tu base de datos
                    // Ejemplo: 
                    // $inscripcion = Inscripcion::where('external_reference_mp', $externalReference)->first();
                    // if ($inscripcion) {
                    //     $inscripcion->estado_pago = $status;
                    //     $inscripcion->estado_detalle_mp = $statusDetail; // Guardar detalle del estado
                    //     $inscripcion->payment_id_mp = $payment->id; // Guardar ID del pago de MP
                    //     $inscripcion->save();
                    //     Log::info('Inscripción actualizada:', ['external_ref' => $externalReference, 'new_status' => $status]);
                    // } else {
                    //     Log::warning('No se encontró inscripción para external_reference:', ['external_ref' => $externalReference]);
                    // }
                } else {
                     Log::warning('Pago no encontrado en MP para ID:', ['payment_id' => $data_id]);
                }
            } catch (\MercadoPago\Exceptions\MPApiException $e) {
                Log::error('MP API Exception en webhook: ' . $e->getMessage() . ' - ' . json_encode($e->getApiResponse()));
                return response()->json(['status' => 'error', 'message' => 'MP API error'], 500); // Error para que MP reintente
            } catch (\Exception $e) {
                Log::error('Error general en webhook MP: ' . $e->getMessage());
                return response()->json(['status' => 'error', 'message' => 'Internal server error'], 500); // Error para que MP reintente
            }
        }
        
        return response()->json(['status' => 'received'], 200);
    }
}

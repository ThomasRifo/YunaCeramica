<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CaptchaController extends Controller
{
    public function validarCaptcha(Request $request)
    {
        \Log::info('--- INICIO validarCaptcha ---', ['request' => $request->all()]);
        try {
            $secretV3 = env('RECAPTCHA_SECRET_V3');
            $secretV2 = env('RECAPTCHA_SECRET_V2');

            if ($request->has('v3Token')) {
                Log::info('Validando reCAPTCHA v3', ['token' => $request->v3Token]);
                
                $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
                    'secret' => $secretV3,
                    'response' => $request->v3Token,
                ]);
                
                $data = $response->json();
                Log::info('Respuesta reCAPTCHA v3', ['data' => $data]);
                
                return response()->json(['score' => $data['score'] ?? 0]);
            }

            if ($request->has('v2Token')) {
                Log::info('Validando reCAPTCHA v2', ['token' => $request->v2Token]);
                
                $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
                    'secret' => $secretV2,
                    'response' => $request->v2Token,
                ]);
                
                $data = $response->json();
                Log::info('Respuesta reCAPTCHA v2', ['data' => $data]);
                
                return response()->json(['success' => $data['success'] ?? false]);
            }

            Log::warning('Solicitud de validación de captcha sin token');
            return response()->json(['error' => 'No se proporcionó token'], 400);
            
        } catch (\Exception $e) {
            Log::error('Error al validar captcha', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json(['error' => 'Error al validar el captcha'], 500);
        }
    }
}

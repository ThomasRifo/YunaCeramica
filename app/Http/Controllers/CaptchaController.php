<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class CaptchaController extends Controller
{
    public function validarCaptcha(Request $request)
    {
        $secretV3 = env('RECAPTCHA_SECRET_V3');
        $secretV2 = env('RECAPTCHA_SECRET_V2');

        if ($request->has('v3Token')) {
            $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
                'secret' => $secretV3,
                'response' => $request->v3Token,
            ]);
            $data = $response->json();
            return response()->json(['score' => $data['score'] ?? 0]);
        }

        if ($request->has('v2Token')) {
            $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
                'secret' => $secretV2,
                'response' => $request->v2Token,
            ]);
            $data = $response->json();
            return response()->json(['success' => $data['success'] ?? false]);
        }

        return response()->json(['success' => false], 400);
    }
}

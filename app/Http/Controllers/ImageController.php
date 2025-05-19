<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|string',
            'folder' => 'required|string'
        ]);

        // Decodificar la imagen base64
        $image_parts = explode(";base64,", $request->image);
        $image_base64 = base64_decode($image_parts[1]);
        
        // Generar nombre único para la imagen
        $imageName = Str::uuid() . '.jpg';
        
        // Guardar la imagen en el storage
        $path = $request->folder . '/' . $imageName;
        Storage::disk('public')->put($path, $image_base64);

        return response()->json([
            'success' => true,
            'path' => Storage::url($path)
        ]);
    }
} 
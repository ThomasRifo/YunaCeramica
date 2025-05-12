<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ArchivosController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard/Paginas/Archivos/Index');
    }

    public function upload(Request $request)
    {
        $request->validate([
            'archivos.*' => 'required|file|mimes:jpg,jpeg,png,gif,webp,svg,mp4,mov,avi,webm|max:20480', // 20MB
        ]);

        foreach ($request->file('archivos', []) as $archivo) {
            $nombre = time() . '_' . $archivo->getClientOriginalName();
            $archivo->storeAs('uploads', $nombre, 'public');
        }

        return back()->with('success', 'Archivos subidos correctamente.');
    }
} 
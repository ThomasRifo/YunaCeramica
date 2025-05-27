<?php

namespace App\Http\Controllers;

use App\Models\TallerCliente;
use Illuminate\Http\Request;

class TallerClienteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(TallerCliente $tallerCliente)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TallerCliente $tallerCliente)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TallerCliente $tallerCliente)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TallerCliente $tallerCliente)
    {
        //
    }
    public function actualizarPago($id)
    {
        $tc = TallerCliente::findOrFail($id);
        
        // Si viene nuevoEstado en el request, lo usamos
        if (request()->has('nuevoEstado')) {
            $tc->idEstadoPago = request('nuevoEstado');
        } else {
            // Si no viene nuevoEstado, mantenemos el comportamiento anterior
            $tc->idEstadoPago = 1;
        }
        
        $tc->save();

        return redirect()->route('dashboard.talleres.view', $tc->idTaller)
        ->with('success', 'Pago actualizado correctamente.');
    }
}

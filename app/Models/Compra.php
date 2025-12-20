<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Compra extends Model
{
    protected $fillable = [
        'idCliente',
        'idEstado',
        'idEstadoPago',
        'total',
        'calle',
        'numero',
        'ciudad',
        'provincia',
        'codigoPostal',
        'email',
        'nombre',
        'apellido',
        'telefono',
        'piso',
        'departamento',
        'observaciones',
        'tracking',
        'idMetodoPago',
        'tipo_entrega',
        'costo_envio',
        'external_reference_mp',
        'preference_id_mp',
        'payment_id_mp',
        'monto_total_pagado_mp',
        'datos_pago_mp',
    ];

    // Relación: Compra pertenece a un Cliente (User)
    public function cliente()
    {
        return $this->belongsTo(User::class, 'idCliente');
    }

    // Relación: Compra pertenece a un Estado de Pedido
    public function estado()
    {
        return $this->belongsTo(EstadoPedido::class, 'idEstado');
    }

    // Relación: Compra pertenece a un Método de Pago
    public function metodoPago()
    {
        return $this->belongsTo(MetodoPago::class, 'idMetodoPago');
    }

    public function estadoPago()
    {   
        return $this->belongsTo(EstadoPago::class, 'idEstadoPago');
    }

    public function detalles()
    {
        return $this->hasMany(DetalleCompra::class, 'idCompra');
    }
}
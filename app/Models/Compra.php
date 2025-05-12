<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Compra extends Model
{
    protected $fillable = [
        'idCliente',
        'idEstado',
        'total',
        'calle',
        'numero',
        'ciudad',
        'provincia',
        'codigoPostal',
        'email',
        'telefono',
        'piso',
        'departamento',
        'observaciones',
        'tracking',
        'idMetodoPago',
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
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TallerCliente extends Model
{
    use HasFactory;

    protected $table = 'taller_clientes';

    protected $fillable = [
        'idTaller',
        'idCliente',
        'email_cliente',
        'nombre_cliente',
        'apellido_cliente',
        'telefono_cliente',
        'fecha',
        'cantPersonas',
        'referido',
        'idMenu',
        'idEstadoPago',
        'idMetodoPago',
        'external_reference_mp',
        'preference_id_mp',
        'payment_id_mp',
        'monto_total_pagado_mp',
        'datos_pago_mp',
    ];

    protected $casts = [
        'datos_pago_mp' => 'array',
        'fecha' => 'datetime',
    ];

    public function taller()
    {
        return $this->belongsTo(Taller::class, 'idTaller');
    }

    public function reviewInvites()
    {
        return $this->hasMany(\App\Models\ReviewInvite::class, 'idTallerCliente');
    }

    public function cliente()
    {
        return $this->belongsTo(User::class, 'idCliente');
    }

    public function menu()
    {
        return $this->belongsTo(Menu::class, 'idMenu');
    }

    public function estadoPago()
    {
        return $this->belongsTo(EstadoPago::class, 'idEstadoPago');
    }

    public function acompaniantes()
    {
        return $this->hasMany(Acompaniante::class, 'idTallerCliente');
    }
    public function metodoPago()
    {
        return $this->belongsTo(MetodoPago::class, 'idMetodoPago');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TallerCliente extends Model
{
    //
    protected $fillable = [
        'idTaller',
        'idCliente',
        'fecha',
        'cantPersonas',
        'pagoGrupal',
        'idMenu',
        'idEstadoPago',
    ];

    public function taller()
    {
        return $this->belongsTo(Taller::class, 'idTaller');
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

}

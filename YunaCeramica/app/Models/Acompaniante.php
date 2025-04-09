<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Acompaniante extends Model
{
    //

    protected $fillable = [
        'idTallerCliente',
        'nombre',
        'apellido',
        'idMenu',
        'email',
        'telefono',
    ];

    public function tallerCliente()
    {
        return $this->belongsTo(TallerCliente::class, 'idTallerCliente');
    }
    public function menu()
    {
        return $this->belongsTo(Menu::class, 'idMenu');
    }
}

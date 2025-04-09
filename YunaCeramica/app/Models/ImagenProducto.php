<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImagenProducto extends Model
{
    //

    use HasFactory;
    protected $table = 'imagenes_producto';

    protected $fillable = [
        'idProducto',
        'urlImagen',
        'orden',
    ];


    public function taller()
    {
        return $this->belongsTo(Producto::class, 'idProducto');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    //

    use HasFactory;

    protected $fillable = [
        'idSubcategoria',
        'nombre',
        'descripcion',
        'stock',
        'precio',
        'activo',
        'descuento',
        'sku',
        'peso',
        'dimensiones',
        'cantVendida',
        'tags',
        'slug',


    ];

    public function subcategoria()
    {
        return $this->belongsTo(Subcategoria::class, 'idSubcategoria');
    }
    public function imagenes()
    {
        return $this->hasMany(ImagenProducto::class, 'idProducto');
    }
}

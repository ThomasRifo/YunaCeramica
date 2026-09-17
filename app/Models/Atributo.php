<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Atributo extends Model
{
    use HasFactory;

    protected $table = 'atributos';

    protected $fillable = [
        'tipo_atributo_id',
        'nombre', // ej: "Taza", "Mate", "Bandeja"
    ];

    // Relación inversa: Un atributo pertenece a un tipo
    public function tipoAtributo()
    {
        return $this->belongsTo(TipoAtributo::class, 'tipo_atributo_id');
    }

    // Relación Muchos a Muchos con Productos (Tabla pivote atributo_producto)
    public function productos()
    {
        return $this->belongsToMany(Producto::class, 'atributo_producto', 'atributo_id', 'producto_id');
    }
}
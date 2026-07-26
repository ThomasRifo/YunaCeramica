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

    // Relación Muchos a Muchos con Productos (Tabla pivote producto_atributos)
    public function productos()
    {
        return $this->belongsToMany(Producto::class, 'producto_atributos');
    }
}
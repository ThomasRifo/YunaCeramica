<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoAtributo extends Model
{
    use HasFactory;

    protected $table = 'tipo_atributos'; // Asegúrate que coincida con el nombre en tu migración

    protected $fillable = [
        'nombre', // ej: "Pieza", "Color"
    ];

    // Relación: Un tipo de atributo tiene muchos atributos
    public function atributos()
    {
        return $this->hasMany(Atributo::class, 'tipo_atributo_id');
    }
}

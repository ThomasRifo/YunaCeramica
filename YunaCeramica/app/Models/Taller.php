<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Taller extends Model
{
    use HasFactory;

    protected $table = 'talleres';

    protected $fillable = [
        'idSubcategoria',
        'nombre',
        'descripcion',
        'fecha',
        'cupoMaximo',
        'precio',
        'ubicacion',
        'activo',
        'cantInscriptos',
    ];

    public function subcategoria()
    {
        return $this->belongsTo(Subcategoria::class, 'idSubcategoria');
    }
    public function imagenes()
    {
        return $this->hasMany(ImagenTaller::class, 'idTaller');
    }
}

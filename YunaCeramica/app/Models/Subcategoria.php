<?php

namespace App\Models;

use App\Http\Controllers\ImagenSubcategoriaController;
use App\Http\Controllers\TallerController;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subcategoria extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'descripcion',
        'url',
        'orden',
        'activo',
        'idCategoria',
    ];

    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'idCategoria');
    }
    public function imagenes()
{
    return $this->hasMany(ImagenSubcategoriaController::class, 'idSubcategoria');
}
public function taller()
{
    return $this->hasMany(TallerController::class, 'taller');
}
}
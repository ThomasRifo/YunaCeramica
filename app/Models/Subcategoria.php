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
        'id',
        'nombre',
        'descripcion',
        'activo',
        'url',
        'idCategoria',
        'orden',
        
    ];
    protected $hidden = [
        'created_at',
        'updated_at',
    ];
    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'idCategoria');
    }
    public function imagenes()
    {
        return $this->hasMany(\App\Models\ImagenSubcategoria::class, 'idSubcategoria');
    }
    public function talleres()
    {
        return $this->hasMany(Taller::class, 'idSubcategoria');
    }
}
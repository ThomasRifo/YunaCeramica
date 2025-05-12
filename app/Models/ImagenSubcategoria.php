<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImagenSubcategoria extends Model
{
    use HasFactory;
    protected $table = 'imagenes_subcategoria';

    protected $fillable = [
        'idSubcategoria',
        'urlImagen',
        'orden',
    ];


    public function subcategoria()
    {
        return $this->belongsTo(Subcategoria::class, 'idSubcategoria');
    }
}

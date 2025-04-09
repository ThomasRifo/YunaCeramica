<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImagenTaller extends Model
{
    use HasFactory;
    protected $table = 'imagenes_taller';

    protected $fillable = [
        'idTaller',
        'urlImagen',
        'orden',
    ];


    public function taller()
    {
        return $this->belongsTo(Taller::class, 'idTaller');
    }
}

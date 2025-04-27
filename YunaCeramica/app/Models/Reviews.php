<?php

// app/Models/Review.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reviews extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'apellido',
        'taller',
        'valoracion',
        'mensaje',
        'habilitada',
        'fecha_publicacion',
    ];
}

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
        
        'taller',
        
        'mensaje',
        
        'fecha_publicacion',
    ];
    protected $hidden = [
        'id',
        'apellido',
        'habilitada',
        'valoracion',
        'created_at',
        'updated_at',
    ];
}

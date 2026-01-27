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
        'mensaje',
        'valoracion',
        'habilitada',
        'fecha_publicacion',
        'email',
        'idTallerCliente',
    ];
    
    protected $casts = [
        'habilitada' => 'boolean',
        'fecha_publicacion' => 'datetime',
    ];
    
    protected $hidden = [
        'apellido',
        'valoracion',
        'id',
        'email',
        'idTallerCliente',
        'created_at',
        'updated_at',
    ];
}

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
        'descripcion', //CAMBIAR DESCRIPCION POR DETALLES
        'fecha',
        'hora',
        'horaFin',
        'cupoMaximo',
        'precio',
        'ubicacion',
        'activo',
        'cantInscriptos',
        'idSubcategoria',
    ];

    protected $hidden = [
        
        'created_at',
        'updated_at',
        
    ];
    public function subcategoria()
    {
        return $this->belongsTo(Subcategoria::class, 'idSubcategoria');
    }

    public function menus()
    {
        return $this->belongsToMany(Menu::class, 'taller_menus', 'idTaller', 'idMenu')
        ->withPivot('html') 
        ->withTimestamps();
    }
    public function imagenes()
    {
        return $this->hasMany(ImagenTaller::class, 'idTaller');
    }
    public function tallerClientes()
    {
        return $this->hasMany(TallerCliente::class, 'idTaller');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    //

    use HasFactory;


    protected $fillable = ['nombre', 'html'];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function talleres()
    {
        return $this->belongsToMany(Taller::class, 'taller_menus', 'idMenu', 'idTaller');
    }
}

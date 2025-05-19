<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImagenTaller extends Model
{
    use HasFactory;

    protected $table = 'imagenes_taller';

    protected $fillable = [
        'slug', 'orden', 'imagen', 'texto', 'crop_x', 'crop_y', 'zoom',
    ];
}
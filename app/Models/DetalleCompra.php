<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetalleCompra extends Model
{
    use HasFactory;

    protected $table = 'detalle_compras';

    protected $fillable = [
        'idCompra',
        'idProducto',
        'nombreProducto',
        'sku',
        'cantidad',
        'precioUnitario',
    ];

    // Relación: un detalle pertenece a una compra
    public function compra()
    {
        return $this->belongsTo(Compra::class, 'idCompra');
    }

    // Relación: un detalle pertenece a un producto
    public function producto()
    {
        return $this->belongsTo(Producto::class, 'idProducto');
    }
}
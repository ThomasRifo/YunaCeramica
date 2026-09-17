<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    //

    use HasFactory;

    protected $fillable = [
        'idSubcategoria',
        'nombre',
        'descripcion',
        'stock',
        'tiene_atributos',
        'es_mayorista',
        'cant_minima_mayorista',
        'descuento_mayorista',
        'precio',
        'activo',
        'descuento',
        'sku',
        'peso',
        'dimensiones',
        'cantVendida',
        'tags',
        'slug',
    ];

    protected $casts = [
        'es_mayorista' => 'boolean',
        'cant_minima_mayorista' => 'integer',
        'descuento_mayorista' => 'float',
        'tiene_atributos' => 'boolean',
        'activo' => 'boolean',
        'precio' => 'float',
        'descuento' => 'integer',
    ];

    public function subcategoria()
    {
        return $this->belongsTo(Subcategoria::class, 'idSubcategoria');
    }

    public function imagenes()
    {
        return $this->hasMany(ImagenProducto::class, 'idProducto');
    }
    
    public function atributos()
    {
        return $this->belongsToMany(Atributo::class, 'atributo_producto', 'producto_id', 'atributo_id');
    }

    /**
     * Precio minorista final (aplicando descuento estándar si existe)
     */
    public function getPrecioMinoristaFinalAttribute(): float
    {
        if ($this->descuento && $this->descuento > 0) {
            return round($this->precio * (1 - $this->descuento / 100), 2);
        }
        return (float) $this->precio;
    }

    /**
     * Precio mayorista final (aplicando descuento_mayorista sobre precio base)
     */
    public function getPrecioMayoristaFinalAttribute(): ?float
    {
        if (!$this->es_mayorista) {
            return null;
        }
        if ($this->descuento_mayorista && $this->descuento_mayorista > 0) {
            return round($this->precio * (1 - $this->descuento_mayorista / 100), 2);
        }
        return (float) $this->precio;
    }

    /**
     * Calcula el precio unitario exacto para una cantidad dada
     */
    public function calcularPrecioUnitario(int $cantidad): float
    {
        if ($this->es_mayorista && $this->cant_minima_mayorista && $cantidad >= $this->cant_minima_mayorista) {
            return $this->precio_mayorista_final ?? $this->precio_minorista_final;
        }
        return $this->precio_minorista_final;
    }
}


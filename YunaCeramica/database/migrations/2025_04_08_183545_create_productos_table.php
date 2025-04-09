<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('productos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('idSubcategoria')->constrained('subcategorias')->onDelete('restrict');
            $table->string('nombre');
            $table->string('descripcion');
            $table->integer('stock')->default(1);
            $table->float('precio', 10, 2);
            $table->boolean('activo')->default(true);
            $table->integer('descuento')->nullable();
            $table->string('sku'); //Codigo interno, para eficiencia a la hora de encontrar el producto
            $table->float('peso', 5, 2);
            $table->string('dimensiones');
            $table->integer('cantVendida');
            $table->string('tags');
            $table->string('slug'); //URL para seo
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};

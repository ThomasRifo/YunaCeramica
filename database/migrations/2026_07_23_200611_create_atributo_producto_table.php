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
        Schema::create('atributo_producto', function (Blueprint $table) {
            $table->id();
            
            // Llaves foráneas con borrado en cascada
            $table->foreignId('producto_id')->constrained('productos')->onDelete('cascade');
            $table->foreignId('atributo_id')->constrained('atributos')->onDelete('cascade');

            $table->timestamps();

            // Previene registros duplicados de la misma combinación
            $table->unique(['producto_id', 'atributo_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('atributo_producto');
    }
};
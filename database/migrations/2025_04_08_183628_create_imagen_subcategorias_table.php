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
        Schema::create('imagenes_subcategoria', function (Blueprint $table) {
            $table->id();
            $table->foreignId('idSubcategoria')->constrained('subcategorias')->onDelete('cascade');
            $table->string('urlImagen');
            $table->integer('orden')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('imagenes_subcategoria');
    }
};

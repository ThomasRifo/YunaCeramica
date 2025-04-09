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
        Schema::create('talleres', function (Blueprint $table) {
            $table->id();
            $table->foreignId('idSubcategoria')->constrained('subcategorias')->onDelete('restrict');
            $table->string('nombre');
            $table->text('descripcion')->nullable();
            $table->date('fecha');
            $table->integer('cupoMaximo');
            $table->float('precio', 10, 2);
            $table->string('ubicacion');
            $table->boolean('activo')->default(true);
            $table->integer('cantInscriptos')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('talleres');
    }
};

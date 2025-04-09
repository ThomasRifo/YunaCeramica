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
        Schema::create('acompaniantes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('idTallerCliente')->constrained('taller_clientes')->onDelete('restrict');
            $table->string('nombre');
            $table->string('apellido');
            $table->foreignId('idMenu')->constrained('menus')->restrictOnDelete()->nullable();
            $table->string('email');
            $table->string('telefono')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('acompaniantes');
    }
};

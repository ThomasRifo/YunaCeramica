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
        Schema::create('taller_clientes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('idTaller')->constrained('talleres')->onDelete('restrict');
            $table->foreignId('idCliente')->constrained('users')->onDelete('restrict');
            $table->timestamp('fecha');
            $table->integer('cantPersonas')->default(1);
            $table->boolean('pagoGrupal')->default(true);
            $table->foreignId('idMenu')->constrained('menus')->onDelete('restrict');
            $table->foreignId('idEstadoPago')->constrained('estados_pago')->onDelete('restrict');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('taller_clientes');
    }
};

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
        Schema::create('compras', function (Blueprint $table) {
            $table->id();
            $table->foreignId('idCliente')->constrained('users')->onDelete('restrict');
            $table->foreignId('idEstado')->constrained('estado_pedidos')->onDelete('restrict');
            $table->float('total', 12, 2);
            $table->string('calle');
            $table->integer('numero');
            $table->string('ciudad');
            $table->string('provincia');
            $table->string('codigoPostal');
            $table->string('email');
            $table->string('telefono');
            $table->string('piso')->nullable();
            $table->string('departamento')->nullable();
            $table->string('observaciones')->nullable();
            $table->string('tracking')->nullable();
            $table->foreignId('idEstadoPago')->constrained('estados_pago')->onDelete('restrict');
            $table->foreignId('idMetodoPago')->constrained('metodos_pago')->onDelete('restrict');;
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('compras');
    }
};

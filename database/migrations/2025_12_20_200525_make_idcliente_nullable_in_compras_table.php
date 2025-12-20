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
        Schema::table('compras', function (Blueprint $table) {
            // Hacer idCliente nullable para permitir compras sin usuario autenticado
            $table->unsignedBigInteger('idCliente')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('compras', function (Blueprint $table) {
            // Revertir: hacer idCliente NOT NULL nuevamente
            $table->unsignedBigInteger('idCliente')->nullable(false)->change();
        });
    }
};

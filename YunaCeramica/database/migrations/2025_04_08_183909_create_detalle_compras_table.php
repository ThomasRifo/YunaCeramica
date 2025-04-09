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
        Schema::create('detalle_compras', function (Blueprint $table) {
            $table->id();
            $table->foreignId('idCompra')->constrained('compras')->onDelete('restrict');
            $table->foreignId('idProducto')->constrained('productos')->onDelete('restrict');
            $table->string('nombreProducto');
            $table->string('sku')->nullable();
            $table->integer('cantidad')->default(1);
            $table->float('precioUnitario', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detalle_compras');
    }
};

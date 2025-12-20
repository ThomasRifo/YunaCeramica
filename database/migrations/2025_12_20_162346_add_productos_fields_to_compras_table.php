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
            // Campos para MercadoPago (similar a taller_clientes)
            $table->string('external_reference_mp')->unique()->nullable()->after('idMetodoPago');
            $table->string('preference_id_mp')->nullable()->after('external_reference_mp');
            $table->string('payment_id_mp')->nullable()->after('preference_id_mp');
            $table->decimal('monto_total_pagado_mp', 10, 2)->nullable()->after('payment_id_mp');
            $table->json('datos_pago_mp')->nullable()->after('monto_total_pagado_mp');
            
            // Campos para tipo de entrega y costo de envío
            $table->enum('tipo_entrega', ['envio', 'retiro'])->default('retiro')->after('observaciones');
            $table->decimal('costo_envio', 10, 2)->default(0)->after('tipo_entrega');
            
            // Campos adicionales del cliente (nombre y apellido separados)
            $table->string('nombre')->nullable()->after('email');
            $table->string('apellido')->nullable()->after('nombre');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('compras', function (Blueprint $table) {
            // Eliminar campos de MercadoPago
            $table->dropColumn([
                'external_reference_mp',
                'preference_id_mp',
                'payment_id_mp',
                'monto_total_pagado_mp',
                'datos_pago_mp'
            ]);
            
            // Eliminar campos de entrega
            $table->dropColumn(['tipo_entrega', 'costo_envio']);
            
            // Eliminar campos adicionales
            $table->dropColumn(['nombre', 'apellido']);
        });
    }
};

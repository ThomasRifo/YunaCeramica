<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('detalle_compras', function (Blueprint $table) {
            $table->foreignId('idAtributo')->nullable()->after('idProducto')->constrained('atributos')->nullOnDelete();
            $table->string('nombreAtributo')->nullable()->after('nombreProducto');
            $table->string('tipoAtributo')->nullable()->after('nombreAtributo');
        });
    }

    public function down(): void
    {
        Schema::table('detalle_compras', function (Blueprint $table) {
            $table->dropForeign(['idAtributo']);
            $table->dropColumn(['idAtributo', 'nombreAtributo', 'tipoAtributo']);
        });
    }
};
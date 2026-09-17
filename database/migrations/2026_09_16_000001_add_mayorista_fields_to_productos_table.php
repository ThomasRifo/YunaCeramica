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
        Schema::table('productos', function (Blueprint $table) {
            $table->boolean('es_mayorista')->default(false)->after('tiene_atributos')->index();
            $table->unsignedSmallInteger('cant_minima_mayorista')->nullable()->after('es_mayorista');
            $table->decimal('descuento_mayorista', 5, 2)->nullable()->after('cant_minima_mayorista');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->dropColumn(['es_mayorista', 'cant_minima_mayorista', 'descuento_mayorista']);
        });
    }
};

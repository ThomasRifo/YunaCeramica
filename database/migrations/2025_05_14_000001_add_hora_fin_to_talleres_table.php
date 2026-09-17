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
        Schema::table('talleres', function (Blueprint $table) {
            if (!Schema::hasColumn('talleres', 'hora')) {
                $table->time('hora')->nullable()->after('fecha');
            }
            if (!Schema::hasColumn('talleres', 'horaFin')) {
                $table->time('horaFin')->nullable()->after('hora');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('talleres', function (Blueprint $table) {
            if (Schema::hasColumn('talleres', 'horaFin')) {
                $table->dropColumn('horaFin');
            }
        });
    }
}; 
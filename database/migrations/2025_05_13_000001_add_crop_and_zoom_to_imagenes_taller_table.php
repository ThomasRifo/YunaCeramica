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
        Schema::table('imagenes_taller', function (Blueprint $table) {
            $table->float('crop_x')->nullable()->after('texto');
            $table->float('crop_y')->nullable()->after('crop_x');
            $table->float('zoom')->nullable()->after('crop_y');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('imagenes_taller', function (Blueprint $table) {
            $table->dropColumn(['crop_x', 'crop_y', 'zoom']);
        });
    }
}; 
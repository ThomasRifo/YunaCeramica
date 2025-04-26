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
        Schema::create('taller_menus', function (Blueprint $table) {
            $table->id();
            $table->foreignId('idMenu')->constrained('menus')->onDelete('restrict');
            $table->foreignId('idTaller')->constrained('talleres')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('taller_menus');
    }
};

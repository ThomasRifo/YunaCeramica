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
        Schema::table('users', function (Blueprint $table) {
            //
            $table->string('apellido')->after('name')->nullable();
            $table->string('telefono')->after('email')->nullable();
            $table->string('calle')->nullable();
            $table->integer('numero')->nullable();
            $table->integer('codigoPostal')->nullable();
            $table->string('ciudad')->nullable();
            $table->string('provincia')->nullable();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            //
            $table->string('apellido');
            $table->string('telefono');
            $table->string('calle')->nullable();
            $table->integer('numero')->nullable();
            $table->integer('codigoPostal');
            $table->string('ciudad');
            $table->string('provincia');
        });
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
	public function up(): void
	{
		Schema::table('reviews', function (Blueprint $table) {
			$table->unsignedBigInteger('idTallerCliente')->nullable()->after('id');
			$table->string('email')->nullable()->after('apellido');
			$table->foreign('idTallerCliente')->references('id')->on('taller_clientes')->onDelete('set null');
			$table->unique(['idTallerCliente', 'email']); // una reseña por inscripción por email
		});
	}

	public function down(): void
	{
		Schema::table('reviews', function (Blueprint $table) {
			$table->dropUnique(['reviews_idtallercliente_email_unique']);
			$table->dropForeign(['idTallerCliente']);
			$table->dropColumn(['idTallerCliente', 'email']);
		});
	}
};


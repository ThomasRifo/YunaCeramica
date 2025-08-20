<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
	public function up(): void
	{
		Schema::create('review_invites', function (Blueprint $table) {
			$table->id();
			$table->foreignId('idTallerCliente')->constrained('taller_clientes')->onDelete('cascade');
			$table->string('email');
			$table->string('nombre');
			$table->string('token')->unique();
			$table->timestamp('expires_at')->nullable();
			$table->timestamp('used_at')->nullable();
			$table->timestamps();
			$table->index(['idTallerCliente', 'email']);
		});
	}

	public function down(): void
	{
		Schema::dropIfExists('review_invites');
	}
};


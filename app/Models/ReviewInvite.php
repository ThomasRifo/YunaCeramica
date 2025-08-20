<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReviewInvite extends Model
{
	use HasFactory;

	protected $table = 'review_invites';

	protected $fillable = [
		'idTallerCliente',
		'email',
		'nombre',
		'token',
		'expires_at',
		'used_at',
	];

	protected $casts = [
		'expires_at' => 'datetime',
		'used_at' => 'datetime',
	];

	public function tallerCliente()
	{
		return $this->belongsTo(TallerCliente::class, 'idTallerCliente');
	}
}


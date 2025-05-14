<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class NewsletterSubscriber extends Model
{
    use HasFactory;

    protected $fillable = [
        'email',
        'activo',
        'token_unsubscribe',
        'email_verified_at'
    ];

    protected $casts = [
        'activo' => 'boolean',
        'email_verified_at' => 'datetime'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($subscriber) {
            $subscriber->token_unsubscribe = Str::random(32);
        });
    }

    public function getUnsubscribeUrl()
    {
        return route('newsletter.unsubscribe', ['token' => $this->token_unsubscribe]);
    }
} 
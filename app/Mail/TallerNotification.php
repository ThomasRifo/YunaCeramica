<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TallerNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $title;
    public $content;
    public $includeReview;
    public $reviewLink;

    /**
     * Create a new message instance.
     */
    public function __construct($title, $content, $includeReview = false)
    {
        $this->title = $title;
        $this->content = $content;
        $this->includeReview = $includeReview;
        $this->reviewLink = $includeReview ? route('taller.review', ['id' => request()->route('taller')]) : null;
        
        // Configurar para usar la cola por defecto
        $this->onQueue('emails');
    }

    public function build()
    {
        $logoPath = public_path('storage/uploads/yunalogowhite192.png');
        return $this->subject($this->title)
                    ->view('emails.taller-notification')
                    ->with([
                        'logoPath' => $logoPath,
                    ]);
    }
} 
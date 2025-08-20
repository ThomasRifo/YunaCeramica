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
    public function __construct($title, $content, $includeReview = false, $reviewLink = null)
    {
        $this->title = $title;
        $this->content = $content;
        $this->includeReview = $includeReview;
        $this->reviewLink = $includeReview ? $reviewLink : null;
        
        // Configurar para usar la cola por defecto
        $this->onQueue('emails');
    }

    public function build()
    {
        $logoPath = public_path('storage/uploads/yunalogowhite192.png');
        
        return $this->subject($this->title)
                    ->view('emails.taller-notification')
                    ->text('emails.taller-notification-text') // Versión en texto plano
                    ->with([
                        'logoPath' => $logoPath,
                        'includeReview' => $this->includeReview,
                        'reviewLink' => $this->reviewLink,
                    ])
                    ->replyTo(config('mail.from.address'), config('mail.from.name'))
                    ->priority(1) // Alta prioridad
                    ->withSwiftMessage(function ($message) {
                        $message->getHeaders()
                            ->addTextHeader('X-MC-Tags', 'taller-notification')
                            ->addTextHeader('X-MC-Track', 'opens,clicks')
                            ->addTextHeader('List-Unsubscribe', '<mailto:' . config('mail.from.address') . '?subject=unsubscribe>');
                    });
    }
} 
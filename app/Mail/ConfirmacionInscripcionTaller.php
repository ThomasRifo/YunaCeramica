<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ConfirmacionInscripcionTaller extends Mailable
{
    use Queueable, SerializesModels;

    public $taller;
    public $titular;
    public $tipo;
    public $textoExtra;

    /**
     * Create a new message instance.
     */
    public function __construct($taller, $titular, $tipo = 'total', $textoExtra = null)
    {
        $this->taller = $taller;
        $this->titular = $titular;
        $this->tipo = $tipo;
        $this->textoExtra = $textoExtra;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('Confirmación Inscripción Taller')
            ->view('emails.confirmacion-inscripcion-taller');
    }
}

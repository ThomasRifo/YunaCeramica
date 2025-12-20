<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ConfirmacionCompra extends Mailable
{
    use Queueable, SerializesModels;

    public $compra;

    public function __construct($compra)
    {
        $this->compra = $compra;
    }

    public function build()
    {
        return $this->view('emails.confirmacion-compra')
                    ->subject('Confirmación de compra - Yuna Cerámica');
    }
}

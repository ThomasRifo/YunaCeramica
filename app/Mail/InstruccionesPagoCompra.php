<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class InstruccionesPagoCompra extends Mailable
{
    use Queueable, SerializesModels;

    public $compra;

    public function __construct($compra)
    {
        $this->compra = $compra;
    }

    public function build()
    {
        return $this->view('emails.instrucciones-pago-compra')
                    ->subject('Instrucciones de pago - Compra #' . str_pad($this->compra->id, 5, '0', STR_PAD_LEFT));
    }
}

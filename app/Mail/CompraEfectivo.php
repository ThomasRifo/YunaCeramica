<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CompraEfectivo extends Mailable
{
    use Queueable, SerializesModels;

    public $compra;
    public $tipo; // 'cliente' o 'admin'

    public function __construct($compra, $tipo = 'cliente')
    {
        $this->compra = $compra;
        $this->tipo = $tipo;
    }

    public function build()
    {
        if ($this->tipo === 'admin') {
            return $this->view('emails.compra-efectivo-admin')
                        ->subject('Nueva compra en efectivo - Compra #' . str_pad($this->compra->id, 5, '0', STR_PAD_LEFT))
                        ->to('yunaceramica@gmail.com');
        }

        return $this->view('emails.compra-efectivo-cliente')
                    ->subject('Compra realizada - Yuna Cerámica');
    }
}

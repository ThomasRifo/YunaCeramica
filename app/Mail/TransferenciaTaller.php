<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TransferenciaTaller extends Mailable
{
    use Queueable, SerializesModels;

    public $taller;
    public $cliente;
    public $cantidadPersonas;
    public $esReserva;
    public $referido;
    public $monto;

    public function __construct($taller, $cliente, $cantidadPersonas, $esReserva, $referido)
    {
        $this->taller = $taller;
        $this->cliente = $cliente;
        $this->cantidadPersonas = $cantidadPersonas;
        $this->esReserva = $esReserva;
        $this->referido = $referido;
        $this->monto = $esReserva ? ($taller->precio * $cantidadPersonas * 0.5) : ($taller->precio * $cantidadPersonas);
    }

    public function build()
    {
        return $this->view('emails.transferencia-taller')
                    ->subject('Instrucciones de pago - '.  $this->taller->nombre );
    }
} 
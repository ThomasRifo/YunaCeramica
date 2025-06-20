<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .details {
            background: #f9f9f9;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .important {
            background: #f9f9f9;
            font-size: 1.2em;
            font-weight: bold;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .bank-details {
            background: #e9ecef;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 0.9em;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>¡Hola {{ ucfirst($cliente['nombre']) }}!</h1>
        </div>

        <div class="details">
            <h2>Detalles de tu inscripción</h2>
            <p><strong>Taller:</strong> {{ $taller->nombre }}</p>
            <p><strong>Fecha:</strong> {{ \Carbon\Carbon::parse($taller->fecha)->format('d-m-Y') }}</p>
            <p><strong>Horario:</strong> {{ \Carbon\Carbon::parse($taller->hora)->format('H:i') }} - {{ \Carbon\Carbon::parse($taller->horaFin)->format('H:i') }}</p>
            <p><strong>Cantidad de personas:</strong> {{ $cantidadPersonas }}</p>
            <p><strong>Tipo de pago:</strong> {{ $esReserva ? 'Reserva (50%)' : 'Pago total' }}</p>
            <p><strong>Monto a abonar:</strong> ${{ number_format($monto, 2) }}</p>
        </div>

        <div class="important">
            <h2 style="color: #db0000; font-weight: bold;">Importante:</h2>
            <p><strong>Una vez realizada la transferencia, por favor envía el comprobante a yunaceramica@gmail.com o responde a este email con el comprobante.</strong></p>
            <p><strong>Tu inscripción quedará confirmada una vez que verifiquemos el pago.</strong></p>
            <p>
                Compartí este link con tus amigos para que se inscriban juntos y compartan mesa!<br>
                <a href="{{ $referido }}">{{ $referido }}</a>
            </p>
        </div>

        <div class="bank-details">
            <h2>Datos para la transferencia</h2>
            <p><strong>Banco:</strong> Mercado Pago</p>
            <p><strong>CVU:</strong> 0000003100025599286815</p>
            <p><strong>Alias:</strong> yunaceramica</p>
            <p><strong>Titular:</strong> Ana Carmen da Silva</p>
        </div>




        <div class="footer">
            <p>Yuna Cerámica</p>
            <p>info@yunaceramica.com</p>
        </div>
    </div>
</body>
</html> 
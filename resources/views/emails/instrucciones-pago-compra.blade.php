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
        .product-item {
            padding: 10px 0;
            border-bottom: 1px solid #e0e0e0;
        }
        .product-item:last-child {
            border-bottom: none;
        }
        .important {
            background: #f9f9f9;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 20px;
            border-left: 4px solid #db0000;
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
            <h1>¡Hola {{ ucfirst($compra->nombre) }}!</h1>
            <h2>Instrucciones de pago - Compra #{{ str_pad($compra->id, 5, '0', STR_PAD_LEFT) }}</h2>
        </div>

        <div class="details">
            <h2>Detalles de tu pedido</h2>
            <p><strong>Fecha:</strong> {{ \Carbon\Carbon::parse($compra->created_at)->format('d-m-Y H:i') }}</p>
            
            <h3 style="margin-top: 20px;">Productos:</h3>
            @foreach($compra->detalles as $detalle)
                <div class="product-item">
                    <strong>{{ $detalle->nombreProducto }}</strong><br>
                    Cantidad: {{ $detalle->cantidad }} x ${{ number_format($detalle->precioUnitario, 0, ',', '.') }} = 
                    ${{ number_format($detalle->precioUnitario * $detalle->cantidad, 0, ',', '.') }}
                </div>
            @endforeach

            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e0e0e0;">
                @if($compra->costo_envio > 0)
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span>Subtotal:</span>
                        <span>${{ number_format($compra->total - $compra->costo_envio, 0, ',', '.') }}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span>Envío:</span>
                        <span>${{ number_format($compra->costo_envio, 0, ',', '.') }}</span>
                    </div>
                @endif
                <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 1.1em;">
                    <span>Total a abonar:</span>
                    <span>${{ number_format($compra->total, 0, ',', '.') }}</span>
                </div>
            </div>
        </div>

        <div class="important">
            <h2 style="color: #db0000; font-weight: bold; margin-top: 0;">Importante:</h2>
            <p><strong>Una vez realizada la transferencia, por favor envía el comprobante a yunaceramica@gmail.com o responde a este email con el comprobante.</strong></p>
            <p><strong>Tu pedido quedará confirmado una vez que verifiquemos el pago.</strong></p>
            <p style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd;">
                <strong>Los productos seguirán disponibles para otras personas hasta que confirmemos tu pago.</strong>
            </p>
        </div>

        <div class="bank-details">
            <h2>Datos para la transferencia</h2>
            <p><strong>Banco:</strong> Mercado Pago</p>
            <p><strong>CVU:</strong> 0000003100025599286815</p>
            <p><strong>Alias:</strong> yunaceramica</p>
            <p><strong>Titular:</strong> Ana Carmen da Silva</p>
        </div>

        <div class="details">
            <h3>Tipo de entrega:</h3>
            @if($compra->tipo_entrega === 'retiro')
                <p><strong>Retiro en local</strong></p>
                <p>Barrio San Lorenzo - Cipolletti</p>
                <p>Los datos precisos y horarios de retiro se enviarán una vez confirmado el pago.</p>
            @else
                <p><strong>Envío a domicilio</strong></p>
                <p><strong>Dirección:</strong> {{ $compra->calle }} {{ $compra->numero }}, 
                   @if($compra->piso) Piso {{ $compra->piso }}, @endif
                   @if($compra->departamento) Dpto. {{ $compra->departamento }}, @endif
                   {{ $compra->ciudad }}, {{ $compra->provincia }}, {{ $compra->codigoPostal }}
                </p>
            @endif
        </div>

        <div class="footer">
            <p><strong>Yuna Cerámica</strong></p>
            <p>yunaceramica@gmail.com</p>
            <p>Barrio San Lorenzo - Cipolletti</p>
        </div>
    </div>
</body>
</html>


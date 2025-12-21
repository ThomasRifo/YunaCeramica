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
        .info-box {
            background: #f9f9f9;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .important {
            background: #f9f9f9;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 20px;
            border-left: 4px solid #ff9800;
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
            <h2>Pedido Realizado - Compra #{{ str_pad($compra->id, 5, '0', STR_PAD_LEFT) }}</h2>
        </div>

        <div class="details">
            <h2>Detalles de tu pedido</h2>
            <p><strong>Fecha:</strong> {{ \Carbon\Carbon::parse($compra->created_at)->format('d-m-Y H:i') }}</p>
            <p><strong>Método de pago:</strong> Efectivo</p>
            
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
                    <span>Total:</span>
                    <span>${{ number_format($compra->total, 0, ',', '.') }}</span>
                </div>
            </div>
        </div>

        <div class="important">
            <h2 style="color: #ff9800; font-weight: bold; margin-top: 0;">Próximos pasos:</h2>
            <p>Te contactaremos pronto vía WhatsApp o email para coordinar el pago en efectivo y la entrega de tu pedido.</p>
            <p style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd;">
                <strong>Los productos seguirán disponibles para otras personas hasta que efectúes el pago.</strong>
            </p>
        </div>

        <div class="info-box">
            <h3>Tipo de entrega:</h3>
            @if($compra->tipo_entrega === 'retiro')
                <p><strong>Retiro en local</strong></p>
                <p>Barrio San Lorenzo - Cipolletti</p>
                <p>Los datos precisos y horarios de retiro se coordinarán al momento del pago.</p>
            @else
                <p><strong>Envío a domicilio</strong></p>
                <p><strong>Dirección:</strong> {{ $compra->calle }} {{ $compra->numero }}, 
                   @if($compra->piso) Piso {{ $compra->piso }}, @endif
                   @if($compra->departamento) Dpto. {{ $compra->departamento }}, @endif
                   {{ $compra->ciudad }}, {{ $compra->provincia }}, {{ $compra->codigoPostal }}
                </p>
                <p>Coordinaremos la entrega contigo vía WhatsApp.</p>
            @endif
        </div>

        @if($compra->observaciones)
            <div class="info-box">
                <h3>Observaciones:</h3>
                <p>{{ $compra->observaciones }}</p>
            </div>
        @endif

        <div class="footer">
            <p><strong>Yuna Cerámica</strong></p>
            <p>yunaceramica@gmail.com</p>
            <p>Barrio San Lorenzo - Cipolletti</p>
        </div>
    </div>
</body>
</html>



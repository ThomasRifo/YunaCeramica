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
        .total {
            background: #f9f9f9;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 20px;
            font-size: 1.2em;
            font-weight: bold;
        }
        .info-box {
            background: #f9f9f9;
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
        .whatsapp-button {
            display: inline-block;
            background-color: #25D366;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            margin: 15px 0;
            text-align: center;
        }
        .whatsapp-button:hover {
            background-color: #20BA5A;
        }
        .whatsapp-section {
            background: #f0fdf4;
            border-left: 4px solid #25D366;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>¡Hola {{ ucfirst($compra->nombre) }}!</h1>
            <h2 style="color: #22d3ee;">Compra Confirmada</h2>
        </div>

        <div class="details">
            <h2>Detalles de tu compra</h2>
            <p><strong>Número de compra:</strong> #{{ str_pad($compra->id, 5, '0', STR_PAD_LEFT) }}</p>
            <p><strong>Fecha:</strong> {{ \Carbon\Carbon::parse($compra->created_at)->format('d-m-Y H:i') }}</p>
            <p><strong>Método de pago:</strong> {{ $compra->metodoPago->nombre ?? 'No especificado' }}</p>
            
            <h3 style="margin-top: 20px;">Productos:</h3>
            @foreach($compra->detalles as $detalle)
                <div class="product-item">
                    <strong>{{ $detalle->nombreProducto }}</strong><br>
                    Cantidad: {{ $detalle->cantidad }} x ${{ number_format($detalle->precioUnitario, 0, ',', '.') }} = 
                    ${{ number_format($detalle->precioUnitario * $detalle->cantidad, 0, ',', '.') }}
                </div>
            @endforeach
        </div>

        <div class="total">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>Subtotal:</span>
                <span>${{ number_format($compra->total - $compra->costo_envio, 0, ',', '.') }}</span>
            </div>
            @if($compra->costo_envio > 0)
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span>Envío:</span>
                    <span>${{ number_format($compra->costo_envio, 0, ',', '.') }}</span>
                </div>
            @endif
            <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 2px solid #333;">
                <span>Total:</span>
                <span>${{ number_format($compra->total, 0, ',', '.') }}</span>
            </div>
        </div>

        <div class="info-box">
            <h3>Tipo de entrega:</h3>
            @if($compra->tipo_entrega === 'retiro')
                <p><strong>Retiro en local</strong></p>
                <p>Barrio San Lorenzo - Cipolletti</p>
            @else
                <p><strong>Envío a domicilio</strong></p>
                <p><strong>Dirección:</strong> {{ $compra->calle }} {{ $compra->numero }}, 
                   @if($compra->piso) Piso {{ $compra->piso }}, @endif
                   @if($compra->departamento) Dpto. {{ $compra->departamento }}, @endif
                   {{ $compra->ciudad }}, {{ $compra->provincia }}, {{ $compra->codigoPostal }}
                </p>
            @endif
            
            <div class="whatsapp-section">
                <p style="margin-bottom: 10px;"><strong>Para coordinar la entrega comunicate por WhatsApp</strong></p>
                @php
                    // Número de WhatsApp de la empresa (Yuna Cerámica)
                    $telefonoEmpresa = '5492996030917';
                    
                    // Crear mensaje desde el comprador hacia la empresa con datos de la compra
                    $mensaje = "Hola! Soy " . $compra->nombre . " " . $compra->apellido . "\n\n";
                    $mensaje .= "- Compra #" . str_pad($compra->id, 5, '0', STR_PAD_LEFT) . "\n";
                    $mensaje .= "- Total: $" . number_format($compra->total, 0, ',', '.') . "\n";
                    $mensaje .= "- Fecha: " . \Carbon\Carbon::parse($compra->created_at)->format('d/m/Y') . "\n";
                    if ($compra->tipo_entrega === 'retiro') {
                        $mensaje .= "- Tipo: Retiro en local\n";
                    } else {
                        $mensaje .= "- Tipo: Envío a domicilio\n";
                        $mensaje .= "- Dirección: " . $compra->calle . " " . $compra->numero . ", " . $compra->ciudad . "\n";
                    }
                    $mensaje .= "\n¿Podemos coordinar la entrega?";
                    
                    // Codificar mensaje para URL
                    $mensajeCodificado = urlencode($mensaje);
                    
                    // URL de WhatsApp apuntando al número de la empresa
                    $whatsappUrl = "https://wa.me/{$telefonoEmpresa}?text={$mensajeCodificado}";
                @endphp
                <a href="{{ $whatsappUrl }}" class="whatsapp-button" target="_blank" style="color: white; text-decoration: none;">
                    💬 Contactar por WhatsApp
                </a>
            </div>
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
        </div>
    </div>
</body>
</html>


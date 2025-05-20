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
            <h1>Nuevo mensaje de contacto</h1>
        </div>

        <div class="details">
            <p><strong>Nombre:</strong> {{ $nombre }}</p>
            <p><strong>Apellido:</strong> {{ $apellido }}</p>
            <p><strong>Email:</strong> {{ $email }}</p>
            <p><strong>Consulta:</strong><br>{{ nl2br(e($consulta)) }}</p>
        </div>

        <div class="footer">
            <p>Yuna Cerámica</p>
            <p>info@yunaceramica.com</p>
        </div>
    </div>
</body>
</html> 
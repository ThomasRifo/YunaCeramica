<!DOCTYPE html>
<html>
<head>
    <title>¡Suscripción Confirmada!</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 600px;
            padding: 40px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            text-align: center;
        }
        h1 {
            color: #2c3e50;
            margin-bottom: 20px;
        }
        p {
            margin-bottom: 20px;
            color: #666;
        }
        .success-icon {
            color: #27ae60;
            font-size: 48px;
            margin-bottom: 20px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #2c3e50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            transition: background-color 0.3s;
        }
        .button:hover {
            background-color: #34495e;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="success-icon">✓</div>
        <h1>¡Suscripción Confirmada!</h1>
        <p>Gracias por confirmar tu suscripción al newsletter de Yuna Cerámica.</p>
        <p>Ahora recibirás información sobre nuestros próximos talleres y novedades.</p>
        <a href="/" class="button">Volver al inicio</a>
    </div>
    <script>
        // Cerrar la ventana después de 5 segundos
        setTimeout(function() {
            window.close();
        }, 5000);
    </script>
</body>
</html> 
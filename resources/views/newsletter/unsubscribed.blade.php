<!DOCTYPE html>
<html>
<head>
    <title>Suscripción Cancelada</title>
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
        <h1>Suscripción Cancelada</h1>
        <p>Has sido dado de baja exitosamente del newsletter de Yuna Cerámica.</p>
        <p>Si cambias de opinión, siempre puedes volver a suscribirte desde nuestra página web.</p>
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
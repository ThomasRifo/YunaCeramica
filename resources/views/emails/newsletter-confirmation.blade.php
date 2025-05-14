<!DOCTYPE html>
<html>
<head>
    <title>Confirma tu suscripción</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2c3e50;">¡Gracias por suscribirte!</h1>
        
        <p>Hola,</p>
        
        <p>Gracias por suscribirte al newsletter de Yuna Cerámica. Para confirmar tu suscripción y comenzar a recibir información sobre nuestros próximos talleres, por favor haz clic en el siguiente botón:</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ route('newsletter.verify', ['token' => $subscriber->token_unsubscribe]) }}" 
               style="background-color: #2c3e50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
                Confirmar suscripción
            </a>
        </div>
        
        <p>Si no solicitaste esta suscripción, puedes ignorar este email.</p>
        
        <p>Para darte de baja en cualquier momento, puedes usar el siguiente enlace:</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ $subscriber->getUnsubscribeUrl() }}" 
               style="color: #666; text-decoration: underline;">
                Darme de baja
            </a>
        </div>
        
        <p style="margin-top: 30px; font-size: 12px; color: #666;">
            Este email fue enviado a {{ $subscriber->email }}. Si tienes alguna pregunta, no dudes en contactarnos.
        </p>
    </div>
</body>
</html> 
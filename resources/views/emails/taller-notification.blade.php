<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>{{ $title }}</title>
</head>

<body style="font-family: Arial, sans-serif; background: #1a202c; margin: 0; padding: 0;">
    <table width="100%" bgcolor="#1a202c" cellpadding="0" cellspacing="0">
        <tr>
            <td>
                <table width="600" align="center" bgcolor="#2d3748" cellpadding="40" cellspacing="0"
                    style="margin: 40px auto; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
                    <tr>
                        <td align="center">
                            <a href="https://www.yunaceramica.com">
                                <img src="{{ $message->embed(public_path('storage/uploads/yunalogowhite192.png')) }}"
                                    width="96"
                                    style="width:96px; height:auto; display:block; border:0; outline:none; text-decoration:none;"
                                    alt="Logo">
                            </a>
                            <h2 style="color: #ffffff; margin-bottom: 20px;">{{ $title }}</h2>

                            <div
                                style="color: #e2e8f0; font-size: 16px; line-height: 1.6; text-align: left; margin-bottom: 30px;">
                                {!! nl2br(e($content)) !!}
                            </div>

                            @if ($includeReview)
                                <div
                                    style="margin: 30px 0; padding: 20px; background: #4a5568; border-radius: 8px; color: #e2e8f0; font-size: 15px;">
                                    <h3 style="color: #ffffff; margin-top: 0;">¿Cómo fue tu experiencia?</h3>
                                    <p style="margin-bottom: 20px;">
                                        Nos encantaría conocer tu opinión sobre el taller. Tu feedback nos ayuda a
                                        mejorar y seguir creando experiencias únicas.
                                    </p>
                                    <a href="{{ $reviewLink }}"
                                        style="display: inline-block; background: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                                        Dejar mi reseña
                                    </a>
                                </div>
                            @endif

                            <p style="font-size: 16px; color: #0d9488; margin-top: 30px;">
                                ¡Gracias por ser parte de Yuna Cerámica!<br>
                                <span style="color: #e2e8f0;">Equipo Yuna Cerámica</span>
                            </p>
                        </td>
                    </tr>
                </table>
                <p style="text-align: center; color: #718096; font-size: 13px;">
                    © {{ date('Y') }} Yuna Cerámica. Todos los derechos reservados.
                </p>
            </td>
        </tr>
    </table>
</body>

</html>

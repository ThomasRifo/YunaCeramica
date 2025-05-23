<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Confirmación de Inscripción - {{ $taller->nombre }}</title>
</head>
<body style="font-family: Arial, sans-serif; background: #f6f6f6; margin: 0; padding: 0;">
    <table width="100%" bgcolor="#f6f6f6" cellpadding="0" cellspacing="0">
        <tr>
            <td>
                <table width="600" align="center" bgcolor="#fff" cellpadding="40" cellspacing="0" style="margin: 40px auto; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.07);">
                    <tr>
                        <td align="center">
                            <img src="{{ asset('storage/uploads/yunalogo.webp') }}" alt="Yuna Cerámica" style="width: 120px; margin-bottom: 20px;">
                            <h2 style="color: #1a202c; margin-bottom: 10px;">¡Inscripción confirmada!</h2>
                            <p style="font-size: 18px; color: #333; margin-bottom: 30px;">
                                Hola <strong>{{ ucfirst($titular['nombre']) }}</strong>,<br>
                                Te informamos que tu inscripción al taller <strong>{{ $taller->nombre }}</strong> ha sido
                                <span style="color: #0d9488; font-weight: bold;">
                                    {{ $tipo == 'total' ? 'confirmada' : 'reservada con seña' }}.
                                </span>
                            </p>
                            <table width="100%" style="margin-bottom: 30px;">
                                <tr>
                                    <td style="padding: 8px 0;"><strong>Fecha:</strong></td>
                                    <td style="padding: 8px 0;">{{ \Carbon\Carbon::parse($taller->fecha)->format('d-m-Y') }}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0;"><strong>Hora:</strong></td>
                                    <td style="padding: 8px 0;">{{ \Carbon\Carbon::parse($taller->hora)->format('H:i') }}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0;"><strong>Ubicación:</strong></td>
                                    <td style="padding: 8px 0;">{{ $taller->ubicacion }}</td>
                                </tr>
                            </table>

                            @if($tipo == 'reserva')
                                <p style="color: #b45309; font-size: 16px; margin-bottom: 20px;">
                                    <strong>
                                        Recuerda que tu lugar está reservado con seña. El saldo restante lo deberás abonar 72 horas antes del taller.
                                    </strong>
                                </p>
                            @endif

                            @if($textoExtra)
                                <p style="color: #333; font-size: 16px;">{{ $textoExtra }}</p>
                            @endif

                            <div style="margin: 30px 0; padding: 18px; background: #f1f5f9; border-radius: 8px; color: #334155; font-size: 15px;">
                                <strong>Política de cancelación:</strong><br>
                                Las cancelaciones al evento solo se aceptan hasta <strong>72 horas antes</strong> del inicio del taller. Pasado ese plazo, no se realizarán devoluciones.
                            </div>

                            <p style="font-size: 16px; color: #0d9488; margin-top: 30px;">
                                ¡Te esperamos!<br>
                                <span style="color: #1a202c;">Equipo Yuna Cerámica</span>
                            </p>
                        </td>
                    </tr>
                </table>
                <p style="text-align: center; color: #94a3b8; font-size: 13px;">
                    © {{ date('Y') }} Yuna Cerámica. Todos los derechos reservados.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>

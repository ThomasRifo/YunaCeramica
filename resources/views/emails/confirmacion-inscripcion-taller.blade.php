<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Confirmación de Inscripción - {{ $taller->nombre }}</title>
</head>
<body style="font-family: Arial, sans-serif; background: #18181b; margin: 0; padding: 0; color: #fff;">
    <table width="100%" bgcolor="#fff" cellpadding="0" cellspacing="0">
        <tr>
            <td>
                <table width="600" align="center" bgcolor="#23232a" cellpadding="40" cellspacing="0" style="margin: 40px auto; border-radius: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
                    <tr>
                        <td align="center">
                            <img src="{{ $message->embed(public_path('storage/uploads/yunalogowhite192.png')) }}" alt="Logo"
                            style="width: 80px; margin-bottom: 20px;">
                            <h2 style="color: #fff; margin-bottom: 10px;">¡Inscripción confirmada!</h2>
                            <p style="font-size: 18px; color: #fff; margin-bottom: 30px;">
                                Hola <strong style="color: #fff;">{{ ucfirst($titular['nombre']) }}</strong>,
                                Te informamos que tu inscripción al taller <strong>{{ $taller->nombre }}</strong> ha sido 
                                <span style="color: #22d3ee; font-weight: bold;">
                                    {{ $tipo == 'total' ? 'confirmada' : 'reservada con seña' }}.
                                </span>
                            </p>
                            <table width="100%" style="margin-bottom: 30px; color: #fff;">
                                <tr>
                                    <td style="padding: 8px 0;"><strong>Fecha:</strong></td>
                                    <td style="padding: 8px 0;">{{ \Carbon\Carbon::parse($taller->fecha)->format('d-m-Y') }}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0;"><strong>Horario:</strong></td>
                                    <td style="padding: 8px 0;">{{ \Carbon\Carbon::parse($taller->hora)->format('H:i') }} - {{ \Carbon\Carbon::parse($taller->horaFin)->format('H:i') }}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0;"><strong>Ubicación:</strong></td>
                                    <td style="padding: 8px 0;">{{ $taller->ubicacion }}</td>
                                </tr>
                            </table>

                            @if($tipo == 'reserva')
                                <p style="color: #fff; font-size: 16px; margin-bottom: 20px; font-weight: bold;">
                                    Recuerda que tu lugar está reservado con seña. El saldo restante lo deberás abonar 72 horas antes del taller.
                                </p>
                            @endif

                            @if($textoExtra)
                                <p style="color: #fff; font-size: 16px;">{{ $textoExtra }}</p>
                            @endif

                            <div style="margin: 30px 0; padding: 18px; background: #18181b; border-radius: 8px; color: #fff; font-size: 15px;">
                                <strong>Política de cancelación:</strong><br>
                                <p style="color: #fff; font-size: 18px;">
                                Las cancelaciones al evento solo se aceptan hasta <strong>72 horas antes</strong> del inicio del taller. Pasado ese plazo, no se realizarán devoluciones.
                                </p>
                            </div>

                            <p style="font-size: 16px; color: #22d3ee; margin-top: 30px;">
                                ¡Te esperamos!<br>
                                <span style="color: #fff;">Equipo Yuna Cerámica</span>
                            </p>
                        </td>
                    </tr>
                </table>
                <p style="text-align: center; color: #64748b; font-size: 13px;">
                    © {{ date('Y') }} Yuna Cerámica. Todos los derechos reservados.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>

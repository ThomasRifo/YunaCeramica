<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lista de Participantes - {{ $taller->nombre }}</title>

    <style>
        @font-face {
            font-family: 'Amatic SC';
            src: url('{{ public_path("fonts/AmaticSC-Regular.ttf") }}') format("truetype");
            font-weight: normal;
            font-style: normal;
        }
        body {
            font-family: 'Amatic SC', Arial, sans-serif !important;
            font-weight: 400 !important;
            font-style: normal !important;
            margin: 20px;
            background: #fff;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header p {
            margin-top: 0;
            color:#444;
        }
        .resumenes {
            width: 100%;
            overflow: hidden;
            margin-bottom: 30px;
            text-align: center;
        }
        .resumen-mesas, .resumen-menus {
            background: #f8fafc;
            border: 1.5px solid #e0e0e0;
            border-radius: 12px;
            padding: 18px 24px;
            font-size: 1.3rem;
            width: 45%;
            display: inline-block;
            vertical-align: top;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .resumen-mesas strong, .resumen-menus strong {
            display: block;
            margin-bottom: 8px;
            font-size: 1.5rem;
            letter-spacing: 1px;
        }
        .resumen-mesas ul, .resumen-menus ul {
            list-style: none;
            padding: 0;
            margin: 0;
            width: 100%;
        }
        .resumen-mesas li, .resumen-menus li {
            margin-bottom: 4px;
            text-align: left;
            width: 100%;
        }
        .grupo {
            background: #fff;
        }
        .grupo-alternado {
            background: #f3f4f6;
        }
        .linea-participante {
            display: flex;
            align-items: center;
            font-size: 1.5rem;
            padding: 10px 0 10px 20px;
            letter-spacing: 1px;
        }
        .nombre {
            min-width: 320px;
            text-transform: capitalize;
        }
        .menu {
            margin-left: 60px;
            font-size: 1.2rem;
            color: #444;
        }
        @media print {
            .no-print { display: none; }
            .resumenes { margin-bottom: 20px; }
            .resumen-mesas, .resumen-menus { width: 48%; font-size: 1.1rem; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Lista de Participantes</h1>
        <div>
            <h2>{{ $taller->nombre }}</h2>
            <p>{{ \Carbon\Carbon::parse($taller->fecha)->format('d/m/Y') }} - {{ \Carbon\Carbon::parse($taller->hora)->format('H:i') }}</p>
        </div>
    </div>
    @php
        $resumenMesas = [];
        $resumenMenus = [];
        $grupos = [];
        foreach ($taller->tallerClientes as $tc) {
            $tamano = 1 + ($tc->acompaniantes ? count($tc->acompaniantes) : 0);
            $tipo = $tamano === 1 ? 'Individual' : ($tamano === 2 ? 'Doble' : ($tamano === 3 ? 'Triple' : $tamano.' personas'));
            if (!isset($resumenMesas[$tipo])) $resumenMesas[$tipo] = 0;
            $resumenMesas[$tipo]++;
            $menuNombre = $tc->menu->nombre ?? 'Sin menú';
            if (!isset($resumenMenus[$menuNombre])) $resumenMenus[$menuNombre] = 0;
            $resumenMenus[$menuNombre]++;
            foreach ($tc->acompaniantes as $a) {
                $menuA = $a->menu->nombre ?? 'Sin menú';
                if (!isset($resumenMenus[$menuA])) $resumenMenus[$menuA] = 0;
                $resumenMenus[$menuA]++;
            }
        }
    @endphp
    <div class="resumenes">
        <div class="resumen-mesas">
            <strong>Mesas</strong>
            <ul>
                @foreach($resumenMesas as $tipo => $cantidad)
                    <li>{{ $tipo }}: {{ $cantidad }}</li>
                @endforeach
            </ul>
        </div>
        <div class="resumen-menus">
            <strong>Menús</strong>
            <ul>
                @foreach($resumenMenus as $menu => $cantidad)
                    <li>{{ $menu }}: {{ $cantidad }}</li>
                @endforeach
            </ul>
        </div>
    </div>

    <div>
        @php
            $grupoActual = null;
            $esGrupoAlternado = false;
            $numero = 1;
        @endphp
        @foreach($participantes as $participante)
            @if($grupoActual !== $participante->idTallerCliente)
                @php
                    $grupoActual = $participante->idTallerCliente;
                    $esGrupoAlternado = !$esGrupoAlternado;
                @endphp
            @endif
            <div class="linea-participante {{ $esGrupoAlternado ? 'grupo-alternado' : 'grupo' }}">
                <span>{{ $numero++ }}.</span>
                <span class="nombre">{{ ucfirst($participante->nombre) }} {{ ucfirst($participante->apellido) }}</span>
                <span class="menu">{{ $participante->menu->nombre ?? 'Sin menú' }}</span>
            </div>
        @endforeach
    </div>
</body>
</html>

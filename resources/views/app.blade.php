<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="description" content="Yuna Cerámica - Talleres de cerámica y arte en Cipolletti, Río Negro">
        <meta name="keywords" content="cerámica, talleres, arte, Cipolletti, Río Negro">
        <meta name="robots" content="index, follow">
        <meta property="og:title" content="{{ config('app.name', 'Yuna Cerámica') }}">
        <meta property="og:description" content="Talleres de cerámica y arte en Cipolletti, Río Negro">
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:image" content="{{ asset('storage/uploads/yunalogowhite.webp') }}">
        
        <!-- Favicon -->
        <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">
        <link rel="shortcut icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">
        
        <!-- Prevención de clickjacking -->
        <!-- <meta http-equiv="X-Frame-Options" content="SAMEORIGIN"> -->
        <!-- Prevención de XSS -->
        <meta http-equiv="Content-Security-Policy" content="default-src 'self' https: http://localhost:* 'unsafe-inline' 'unsafe-eval'; connect-src 'self' ws://localhost:5173 http://localhost:5173 https:; script-src 'self' https: http://localhost:* 'unsafe-inline' 'unsafe-eval'; img-src 'self' https: data:; font-src 'self' https: data:;">
        
        <title inertia>{{ config('app.name', 'Yuna Cerámica') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        <script src="{{ asset('ziggy.js') }}"></script>
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
        <script src="https://www.google.com/recaptcha/api.js?render=6LeWbjorAAAAAN1iTNC1iDlAzdGhuqJ9RKKVW0lN"></script>
    </body>
</html>

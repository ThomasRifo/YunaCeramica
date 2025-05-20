<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        
        <!-- SEO Meta Tags -->
        <meta name="description" content="Yuna Cerámica - Talleres de cerámica artesanal en Cipolletti y Neuquén. Aprende cerámica, crea piezas únicas y disfruta de experiencias creativas con café y gin. Talleres para principiantes y avanzados.">
        <meta name="keywords" content="cerámica, talleres de cerámica, cerámica artesanal, cerámica Cipolletti, cerámica Neuquén, taller de cerámica, cerámica y café, cerámica y gin, clases de cerámica, cerámica Río Negro, arte cerámico, cerámica para principiantes, cerámica para adultos, cerámica creativa, taller de arte, cerámica personalizada">
        <meta name="robots" content="index, follow">
        <meta name="author" content="Yuna Cerámica">
        <meta name="geo.region" content="AR-R">
        <meta name="geo.placename" content="Cipolletti, Río Negro">
        
        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:title" content="{{ config('app.name', 'Yuna Cerámica') }} - Talleres de Cerámica en Cipolletti">
        <meta property="og:description" content="Descubre el arte de la cerámica en nuestros talleres. Experiencias únicas combinando cerámica con café y gin. Clases para todos los niveles en Cipolletti y Neuquén.">
        <meta property="og:image" content="{{ asset('storage/uploads/yunalogowhite.webp') }}">
        <meta property="og:locale" content="es_AR">
        
        <!-- Twitter -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ config('app.name', 'Yuna Cerámica') }} - Talleres de Cerámica">
        <meta name="twitter:description" content="Talleres de cerámica artesanal en Cipolletti. Aprende, crea y disfruta de experiencias únicas con cerámica, café y gin.">
        <meta name="twitter:image" content="{{ asset('storage/uploads/yunalogowhite.webp') }}">
        
        <!-- Canonical URL -->
        <link rel="canonical" href="{{ url()->current() }}">
        
        <!-- Favicon -->
        <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">
        <link rel="shortcut icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">
        
        <!-- Prevención de clickjacking -->
        <meta http-equiv="X-Frame-Options" content="SAMEORIGIN">
        
        <!-- Prevención de XSS -->
        <meta http-equiv="Content-Security-Policy" content="default-src 'self' https: http://localhost:* 'unsafe-inline' 'unsafe-eval'; connect-src 'self' ws://localhost:5173 http://localhost:5173 https:; script-src 'self' https: http://localhost:* 'unsafe-inline' 'unsafe-eval'; img-src 'self' https: data:; font-src 'self' https: data:;">
        
        <title inertia>{{ config('app.name', 'Yuna Cerámica') }} - Talleres de Cerámica en Cipolletti y Neuquén</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        <script src="{{ asset('ziggy.js') }}"></script>
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead

        <!-- Schema.org markup para Google -->
        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Yuna Cerámica",
            "image": "{{ asset('storage/uploads/yunalogowhite.webp') }}",
            "description": "Talleres de cerámica artesanal en Cipolletti y Neuquén. Experiencias creativas combinando cerámica con café y gin.",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "Cipolletti",
                "addressRegion": "Río Negro",
                "addressCountry": "AR"
            },
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": "-38.9333",
                "longitude": "-68.0667"
            },
            "url": "{{ url()->current() }}",
            "telephone": "+54-9-299-1234567",
            "priceRange": "$$",
            "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday"
                ],
                "opens": "09:00",
                "closes": "18:00"
            },
            "sameAs": [
                "https://instagram.com/yunaceramica"
            ]
        }
        </script>

        
    </head>
    <body class="font-sans antialiased">
        @inertia
        <script src="https://www.google.com/recaptcha/api.js?render=6LeWbjorAAAAAN1iTNC1iDlAzdGhuqJ9RKKVW0lN"></script>
    </body>
</html>

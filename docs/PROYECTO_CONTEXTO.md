# YunaCeramica — Contexto del Proyecto

> **Documento vivo.** Actualizarlo cada vez que se complete un módulo o se tome una decisión de arquitectura importante.

---

## 1. ¿Qué es este proyecto?

**YunaCeramica** es el sitio web de un emprendimiento de cerámica artesanal ubicado en Cipolletti, Río Negro, Argentina. El sitio cumple dos funciones principales:

1. **E-commerce** de productos cerámicos (tazas, platos, macetas, kits para pintar, etc.)
2. **Gestión de talleres** (eventos donde clientes se anotan, pagan y asisten a clases de cerámica)

El proyecto lleva **más de un año en producción** en `https://yunaceramica.com` y funciona correctamente, pero nunca fue terminado del todo. La dueña del emprendimiento lo usa activamente para gestionar reservas y ventas.

---

## 2. Stack tecnológico

| Capa | Tecnología |
|------|------------|
| Backend | Laravel 12 (PHP 8.2) |
| Frontend | Inertia.js + React 18 + Vite |
| Estilos | Tailwind CSS v3 + MUI v7 (dashboard) |
| DB | MySQL (yunaceramica) |
| Pagos | MercadoPago SDK PHP v3 |
| Imágenes | Intervention Image v3 (GD driver) |
| Emails | SMTP Gmail (Laravel Mail) |
| Auth | Laravel Breeze + Spatie Permissions (rol: admin) |
| Cola | Laravel Queue (driver: database) |
| Sitemap | spatie/laravel-sitemap v8 |
| PDF | barryvdh/laravel-dompdf v3 |

---

## 3. Estructura de base de datos (tablas principales)

```
usuarios (users)           -> auth, rol admin/cliente
categorias                 -> Productos (id:1) / Talleres (id:2)
subcategorias              -> agrupan productos y tipos de talleres
productos                  -> catalogo, con slug, stock, precio, descuento, atributos
imagen_productos           -> imagenes por producto (urlImagen es el filename en /storage/productos/)
atributos / tipo_atributos -> variantes de producto (ej: talle, color)
atributo_producto          -> pivot productos <-> atributos
compras                    -> pedidos de productos, token unico, estado
detalle_compras            -> lineas del pedido (producto, cantidad, precio, atributo)
estado_pedidos             -> estados del pedido (pendiente, en preparacion, enviado, entregado)
estado_pago                -> estados de pago (pendiente, parcial, pagado, cancelado)
metodo_pago                -> efectivo, transferencia, MercadoPago
tallers                    -> eventos de taller (fecha, precio, cupos, slug, activo)
taller_clientes            -> inscripciones a talleres
acompaniantes              -> acompanantes de una inscripcion
imagen_tallers             -> imagenes de la seccion talleres (optimizadas con crop/zoom)
menus / taller_menus       -> menus opcionales por taller (ej: cafe, gin)
reviews                    -> resenas de clientes (con token de invitacion)
review_invites             -> tokens de invitacion de resenas
newsletter_subscribers     -> suscriptores del newsletter
provincias                 -> para el checkout de envios
```

---

## 4. Estructura de rutas principales

### Publicas
- `/` -> Pagina de inicio
- `/productos` -> Catalogo de productos (con filtros)
- `/productos/{slug}` -> Detalle del producto
- `/carrito` -> Carrito de compras (sesion)
- `/checkout` -> Checkout (transferencia / efectivo / MercadoPago)
- `/talleres` -> Listado de talleres disponibles
- `/talleres-{slug}` -> Pagina de tipo de taller
- `/talleres-{slug}-inscripcion` -> Formulario de inscripcion a taller
- `/contacto` -> Formulario de contacto
- `/reviews/invitation/{token}` -> Formulario de resena por invitacion
- `/newsletter/*` -> Suscripcion / verificacion / baja

### Autenticadas (auth)
- `/perfil` -> Perfil del usuario
- `/perfil/talleres` -> Talleres del usuario
- `/perfil/compras` -> Compras del usuario

### Dashboard (auth + admin)
- `/dashboard` -> Panel principal
- `/dashboard/talleres/*` -> CRUD completo de talleres
- `/dashboard/productos/*` -> CRUD completo de productos (falta Edit.jsx)
- `/dashboard/compras/*` -> Listado y detalle de compras
- `/dashboard/reviews/*` -> Moderacion de resenas
- `/dashboard/paginas/talleres/*` -> Editor de imagenes con crop

---

## 5. Sistema de imagenes

### Talleres (YA IMPLEMENTADO OK)
- Subida con editor de crop (react-easy-crop)
- `ImageOptimizationService.php` genera 3 versiones WebP:
  - `_mobile.webp` -> 400px
  - `_desktop.webp` -> 600px
  - `_large.webp` -> 800px
- Frontend usa `<picture>` con `srcSet` segun dispositivo

### Productos (SIN OPTIMIZAR - PENDIENTE)
- Se guardan en `/storage/productos/` con extension original
- No se genera WebP ni multiples resoluciones
- El `ImageOptimizationService` existe pero NO se aplica a productos
- Las imagenes ya subidas son de alta calidad -> carga lenta del catalogo

---

## 6. Estado actual del Dashboard (empleado/dueno)

| Seccion | Estado |
|---------|--------|
| Talleres - Index | OK |
| Talleres - Create | OK |
| Talleres - Edit | OK |
| Talleres - View (participantes) | Funciona pero mejorable |
| Talleres - Delete/Desactivar | OK |
| Productos - Index | OK (con DataGrid MUI) |
| Productos - Create | OK (upload con drag&drop de imagenes) |
| Productos - Edit | FALTA (la ruta existe pero no hay page Edit.jsx) |
| Productos - Delete | OK (desactiva, no borra fisicamente) |
| Compras - Index | OK |
| Compras - Show | OK |
| Reviews - Index | OK |
| Subcategorias | Solo Index, sin CRUD completo |
| Categorias | Sin CRUD |
| Metodos de pago | Sin CRUD (hardcodeado en el codigo) |
| Estados pedido/pago | Sin CRUD |
| Newsletter - Suscriptores | Sin vista dashboard |
| Configuracion general | Sin implementar |
| Envios (costos, zonas) | Hardcodeado ($7000 en CompraController) |
| Provincias | Sin CRUD (solo seeder) |

---

## 7. Cosas hardcodeadas (CRITICO)

- `CompraController.php` linea 86: `$costoEnvio = $tipoEntrega === 'envio' ? 7000 : 0;`
- `Productos/Show.jsx` lineas 328-338: Texto de formas de envio hardcodeado (precio, zonas)
- `Productos/Show.jsx` linea 295-298: Recargo del 10% para metodo de pago id=2 hardcodeado
- `Index.jsx`: Horarios de atencion hardcodeados en schema.org
- URL de produccion `https://yunaceramica.com` hardcodeada en multiples componentes JSX

---

## 8. SEO - Estado actual

### Lo que YA existe:
- Schema.org `LocalBusiness` en homepage
- Schema.org `Product` en cada producto (con precio, stock, imagenes)
- Open Graph tags en productos y homepage
- Twitter Cards en productos y homepage
- Meta description en homepage y productos
- sitemap generator (spatie/laravel-sitemap instalado pero no configurado activamente)
- Canonical URLs

### Lo que FALTA:
- Sitemap XML dinamico con productos, talleres y paginas (no autogenerado)
- robots.txt configurado correctamente
- `<title>` de la homepage esta vacio (`<title></title>`)
- Open Graph image de homepage usa el logo (no impacta en redes)
- SSR (Server-Side Rendering) -> `ssr.jsx` existe pero no esta activo en produccion
- Sin Google Search Console configurado
- Sin Structured Data para talleres

---

## 9. Integraciones pendientes

- **envia.com** -> API para calcular costos de envio nacionales en tiempo real
- **Google Analytics / GTM** -> No implementado
- **Google Search Console** -> No verificado/configurado

---

## 10. Archivos clave

| Archivo | Proposito |
|---------|-----------|
| `app/Services/ImageOptimizationService.php` | Crop + resize + WebP para imagenes de talleres |
| `app/Http/Controllers/ProductoController.php` | CRUD productos |
| `app/Http/Controllers/TallerController.php` | CRUD talleres (33KB, el mas grande) |
| `app/Http/Controllers/CompraController.php` | Checkout y gestion de compras (28KB) |
| `app/Http/Controllers/MercadoPagoController.php` | Flujo MP para talleres |
| `app/Http/Controllers/MercadoPagoProductosController.php` | Flujo MP para productos |
| `resources/js/Pages/Productos/Show.jsx` | Detalle del producto con OG tags y schema |
| `resources/js/Pages/Talleres/FormInscripcion.jsx` | Inscripcion a talleres (48KB, complejo) |
| `resources/js/Pages/Dashboard/Talleres/View.jsx` | Panel de participantes del taller (40KB) |
| `resources/js/Layouts/NavbarClient.jsx` | Navbar publica |
| `resources/js/Layouts/DashboardLayout.jsx` | Layout del dashboard |

---

## 11. Variables de entorno importantes (.env)

```
APP_URL=localhost               # En produccion debe ser https://yunaceramica.com
MP_ACCESS_TOKEN=...            # MercadoPago (produccion)
MAIL_MAILER=smtp               # Gmail SMTP
QUEUE_CONNECTION=database      # Cola de jobs
RECAPTCHA_SECRET_V3/V2=...     # reCAPTCHA Google
```

> **Nota:** En produccion el `.env` debe tener `APP_URL=https://yunaceramica.com` y `APP_ENV=production` y `APP_DEBUG=false`.

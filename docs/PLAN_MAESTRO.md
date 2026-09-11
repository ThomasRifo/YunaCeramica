# YunaCeramica — Plan Maestro de Finalizacion

> **Estado del proyecto:** En produccion desde hace ~1.5 anios. Funcional pero incompleto.
> **Objetivo:** Terminar el proyecto correctamente — dashboard completo, SEO optimo, envios nacionales, imagenes optimizadas, codigo sin hardcodear.

---

## PRIORIDAD 1 — CRITICO (bloquea operacion o pierde dinero/clientes)

---

### 1.1 - Crear Edit.jsx para Productos en el Dashboard

**Problema:** La ruta `GET /dashboard/productos/{id}/edit` existe y el controller `edit()` retorna `Dashboard/Productos/Edit`, pero ese componente React NO existe. Si alguien intenta editar un producto, la app falla.

**Archivos involucrados:**
- `resources/js/Pages/Dashboard/Productos/Edit.jsx` → CREAR
- `app/Http/Controllers/ProductoController.php` → `edit()` y `update()` ya existen

**Que debe incluir el componente:**
- Formulario identico a `Create.jsx` pero pre-cargado con los datos del producto
- Gestion de imagenes existentes: ver las que ya tiene, poder eliminarlas individualmente
- Subir imagenes nuevas (con drag & drop como en Create)
- Gestion de atributos (si el producto los tiene)
- Switch para activar/desactivar el producto
- Al guardar, hacer `PUT /dashboard/productos/{id}` con `useForm` de Inertia
- Feedback visual al guardar (Snackbar de exito o error)

**Criterio de aceptacion:** El boton "Editar" en el Index del dashboard navega al formulario de edicion, pre-cargado, y guarda correctamente.

---

### 1.2 - Optimizacion de imagenes de productos (WebP + multiples tamanios)

**Problema:** Las imagenes de productos se guardan como JPG/PNG originales de alta calidad. El catalogo carga muy lento. El `ImageOptimizationService` ya existe y funciona para talleres, pero no se aplica a productos.

**Parte A — Nuevas imagenes (al subir)**

Modificar `ProductoController::store()` y `ProductoController::update()` para que al guardar una imagen:
1. Guarden el archivo original con nombre `producto-{id}-{orden}.webp` (convertido a WebP)
2. Llamen a `ImageOptimizationService` para generar `_mobile`, `_desktop`, `_large`

El `ImageOptimizationService` asume crop/zoom. Para productos NO hay crop. Adaptar el servicio para que acepte `$crop = null` y `$zoom = 1` (sin crop, solo resize + conversion WebP).

**Parte B — Imagenes ya subidas (retroactivo)**

Crear un comando Artisan para procesar todas las imagenes existentes:

```bash
php artisan productos:optimizar-imagenes
```

El comando debe:
1. Iterar todas las `ImagenProducto` que no tengan version `_mobile.webp`
2. Por cada imagen, llamar a `ImageOptimizationService::processImage()` sin crop
3. Loggear progreso y errores
4. Ser idempotente (si la version optimizada ya existe, saltearla)

**Parte C — Frontend**

Actualizar `Productos/Index.jsx` y `Productos/Show.jsx` para usar `<picture>` con `srcSet`:

```jsx
<picture>
  <source media="(max-width: 640px)" srcSet={`/storage/productos/${imgFilename}_mobile.webp`} />
  <source media="(max-width: 1024px)" srcSet={`/storage/productos/${imgFilename}_desktop.webp`} />
  <img src={`/storage/productos/${imgFilename}_large.webp`} alt={nombre} loading="lazy" />
</picture>
```

El backend debe retornar el `filename` sin extension para que el frontend construya las URLs.

**Archivos involucrados:**
- `app/Services/ImageOptimizationService.php` → agregar modo "sin crop"
- `app/Http/Controllers/ProductoController.php` → `store()` y `update()`
- `app/Console/Commands/OptimizarImagenesProductos.php` → CREAR
- `app/Console/Kernel.php` → registrar el comando
- `resources/js/Pages/Productos/Index.jsx` → usar `<picture>`
- `resources/js/Pages/Productos/Show.jsx` → usar `<picture>`
- `resources/js/Pages/Dashboard/Productos/Index.jsx` → usar imagen optimizada en miniatura

---

### 1.3 - Eliminar hardcoding del costo de envio

**Problema:** `$costoEnvio = $tipoEntrega === 'envio' ? 7000 : 0;` esta hardcodeado en el controller. Tambien el texto de envio en `Productos/Show.jsx`.

**Solucion:**
1. Crear tabla `settings` con clave/valor: `costo_envio_local`, `zonas_envio_texto`, `recargo_mercadopago`
2. Crear modelo `Setting` con metodo estatico `get($key, $default)`
3. Agregar seccion en el dashboard para editar estos valores
4. En `CompraController::checkout()` leer `costoEnvio` desde BD
5. En `Productos/Show.jsx` recibir las zonas de envio como props desde el server

**Archivos involucrados:**
- Nueva migracion: `create_settings_table.php`
- `app/Models/Setting.php` → CREAR
- `app/Http/Controllers/CompraController.php` → leer `costoEnvio` desde BD
- `app/Http/Controllers/ProductoController.php` → pasar `settings` en `show()`
- `resources/js/Pages/Productos/Show.jsx` → leer de props, no hardcodeado
- `resources/js/Pages/Dashboard/Configuracion/Envio.jsx` → CREAR
- `routes/web.php` → agregar ruta `/dashboard/configuracion/*`

---

### 1.4 - Arreglar titulo vacio en la homepage

**Problema:** `resources/js/Pages/Index.jsx` tiene `<title></title>` vacio. Google ve un titulo en blanco, lo cual es terrible para el SEO.

**Solucion:**
```jsx
<title>Yuna Ceramica — Talleres y Productos de Ceramica Artesanal en Cipolletti</title>
```

**Archivo:** `resources/js/Pages/Index.jsx` linea 59

---

## PRIORIDAD 2 — IMPORTANTE (mejora la operacion diaria)

---

### 2.1 - Dashboard: Completar CRUDs faltantes

#### 2.1.1 - CRUD Subcategorias
**Ruta existente:** `GET /dashboard/subcategorias` → solo muestra lista
**Que falta:** Create, Edit, Delete (soft-delete con `activo`)

**Archivos:**
- `app/Http/Controllers/SubcategoriaController.php` → agregar `create()`, `store()`, `edit()`, `update()`, `destroy()`
- `resources/js/Pages/Dashboard/Subcategorias/Create.jsx` → CREAR
- `resources/js/Pages/Dashboard/Subcategorias/Edit.jsx` → CREAR
- `routes/web.php` → agregar rutas faltantes

#### 2.1.2 - Vista de Suscriptores Newsletter
**Que falta:** El `NewsletterController` gestiona suscripciones pero no hay vista dashboard.

**Archivos:**
- `resources/js/Pages/Dashboard/Newsletter/Index.jsx` → CREAR (tabla con email, fecha, estado activo/baja)
- `app/Http/Controllers/NewsletterController.php` → agregar `dashboardIndex()`
- `routes/web.php` → agregar `GET /dashboard/newsletter`

#### 2.1.3 - Panel de Configuracion General (ver punto 1.3)
Ver descripcion en 1.3. Panel para editar: costo de envio, zonas, recargo MP, datos de contacto, horarios de atencion.

#### 2.1.4 - Activar/Desactivar producto desde el Index
**Problema:** No hay boton para reactivar un producto que fue desactivado.
**Solucion:** Agregar toggle de estado activo/inactivo en el DataGrid del Index de productos (una columna con Switch de MUI).

---

### 2.2 - UX/Feedback de usuario (botones y acciones)

**Problema:** Los usuarios no reciben feedback claro cuando realizan acciones.

| Accion | Feedback actual | Feedback requerido |
|--------|-----------------|-------------------|
| Agregar al carrito (catalogo) | Mensaje inline en Show.jsx | Toast global + animacion en icono carrito |
| Eliminar del carrito | Pagina recarga | Toast de confirmacion |
| Enviar formulario de contacto | Redirect con flash | Toast/mensaje inline visible |
| Completar compra (transferencia) | Redirect a pagina success | Email + toast + paso confirmado |
| Inscribirse a taller | Redirect | Email + confirmacion visible |
| Editar producto en dashboard | Redirect a Index | Snackbar de exito visible |
| Error de validacion en forms | Campo marcado | Mensaje claro debajo del campo |
| Subir imagenes | Sin loading visible | Spinner/progress durante upload |

**Archivos a modificar:**
- `resources/js/Layouts/NavbarClient.jsx` → counter del carrito con animacion CSS al agregar
- `resources/js/Pages/Productos/Index.jsx` → toast al agregar desde catalogo
- `resources/js/Pages/Productos/Carrito.jsx` → toast al eliminar
- Todos los formularios del dashboard → Snackbar unificado con mensajes flash de Inertia

---

### 2.3 - SEO: Sitemap XML dinamico y robots.txt

#### Sitemap
Implementar generacion automatica con `spatie/laravel-sitemap` (ya instalado).

**Crear:** `app/Http/Controllers/SitemapController.php`

El sitemap debe incluir:
- `/` (prioridad 1.0)
- `/productos` (prioridad 0.9)
- `/productos/{slug}` por cada producto activo (prioridad 0.8)
- `/talleres` (prioridad 0.9)
- `/talleres-{slug}` por cada subcategoria activa de talleres (prioridad 0.7)
- `/contacto` (prioridad 0.5)
- `/eventos-privados` (prioridad 0.5)

**Ruta publica:**
```php
Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');
```

Programar regeneracion diaria con Laravel Schedule.

#### robots.txt
Crear/actualizar `public/robots.txt`:
```
User-agent: *
Allow: /
Disallow: /dashboard/
Disallow: /profile/
Disallow: /carrito
Disallow: /checkout
Sitemap: https://yunaceramica.com/sitemap.xml
```

**Archivos:**
- `public/robots.txt` → CREAR/ACTUALIZAR
- `app/Http/Controllers/SitemapController.php` → CREAR
- `routes/web.php` → ruta del sitemap
- `app/Console/Kernel.php` → schedule diario del sitemap

---

### 2.4 - SEO: Open Graph mejorado para la homepage

**Problema:** La imagen OG de la homepage es el logo (pobre en redes sociales).

**Solucion:**
- Cambiar la `og:image` por una foto impactante del taller (1200x630px minimo)
- Subir imagen dedicada a `/storage/uploads/og-home.jpg`
- Actualizar la meta tag

**Archivo:** `resources/js/Pages/Index.jsx` lineas 88-90

---

### 2.5 - SEO: Structured Data para Talleres

**Problema:** Los talleres no tienen Schema.org.

Agregar en `TallerView.jsx` un schema de tipo `Event`:
```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "nombre del taller",
  "startDate": "YYYY-MM-DD",
  "location": { "@type": "Place", "name": "Cipolletti, Rio Negro" },
  "offers": { "@type": "Offer", "price": "precio", "priceCurrency": "ARS" },
  "organizer": { "@type": "Organization", "name": "Yuna Ceramica" }
}
```

**Archivo:** `resources/js/Pages/Talleres/TallerView.jsx`

---

## PRIORIDAD 3 — MEJORA OPERATIVA

---

### 3.1 - Integracion envia.com para envios nacionales

**Que es:** API para cotizar envios nacionales en Argentina con multiples correos (Andreani, OCA, Correo Argentino, etc.).

**Flujo propuesto:**
1. En checkout, el usuario elige "Envio a domicilio"
2. Ingresa codigo postal de destino
3. Se llama a API de envia.com para cotizar (usa peso + dimensiones del producto del modelo `Producto`)
4. Se muestran opciones de envio con precio y tiempo estimado
5. El usuario elige una opcion
6. Al confirmar la compra, el costo de envio se registra en la compra

**Implementacion:**
- `app/Services/EnviaComService.php` → CREAR (wrapper de la API REST)
- `app/Http/Controllers/EnvioController.php` → CREAR (endpoint para cotizar)
- `routes/api.php` → `POST /api/envio/cotizar`
- `resources/js/Pages/Productos/Checkout.jsx` → selector de opciones de envio dinamico

**Variables .env a agregar:**
```
ENVIACO_API_KEY=
ENVIACO_FROM_POSTAL_CODE=8324
```

**Referencia:** https://developers.envia.com/

**Notas:**
- El modelo `Producto` ya tiene `peso` y `dimensiones`. Verificar que esten bien cargados.
- Implementar primero solo cotizacion; la generacion de etiqueta es un paso 2.

---

### 3.2 - SSR (Server-Side Rendering) para mejor SEO

**Problema:** Sin SSR, los bots de Google reciben HTML vacio y deben ejecutar JS para ver el contenido. Esto afecta el indexado.

**Estado:** `resources/js/ssr.jsx` existe, `package.json` tiene `vite build --ssr` en el script `build`.

**Que falta activar en produccion:**
1. Verificar que el bundle SSR se genera correctamente con `npm run build`
2. Configurar el servidor para ejecutar el proceso Node.js del SSR
3. Actualizar configuracion de Nginx/Apache para pasar SSR
4. Verificar con `curl https://yunaceramica.com` que el HTML tiene contenido

**Archivos:**
- `resources/js/ssr.jsx` → revisar y completar
- `vite.config.js` → verificar configuracion SSR
- Configuracion del servidor web → actualizar

**Nota:** Si el servidor es shared hosting (ej: cPanel), activar SSR puede ser imposible sin cambiar a VPS.

---

### 3.3 - Panel de compras mejorado

**Problemas actuales:**
- No hay forma de cambiar el estado del pedido (pendiente → en preparacion → enviado → entregado)
- No se envia email al cliente cuando cambia el estado
- No hay numero de seguimiento de envio

**Mejoras:**
1. En `Dashboard/Compras/Show.jsx`: selector de estado del pedido con boton "Actualizar"
2. Crear `Mail/EstadoPedidoActualizado.php` para notificar al cliente
3. Agregar campo `numero_seguimiento` a la tabla `compras` (nueva migracion)
4. Mostrar numero de seguimiento en perfil del cliente (`/perfil/compras`)

**Archivos:**
- `resources/js/Pages/Dashboard/Compras/Show.jsx` → agregar selector de estado + campo seguimiento
- `app/Http/Controllers/CompraController.php` → metodo `update()` ya existe, extenderlo
- `app/Mail/EstadoPedidoActualizado.php` → CREAR
- Nueva migracion para `numero_seguimiento` en compras

---

### 3.4 - Reemplazar URLs hardcodeadas con variable de entorno

**Problema:** `https://yunaceramica.com` esta hardcodeada en multiples archivos JSX.

**Solucion:**
1. Agregar en `.env`: `VITE_APP_URL=https://yunaceramica.com`
2. Usar en JSX: `import.meta.env.VITE_APP_URL`

**Archivos afectados:**
- `resources/js/Pages/Index.jsx` (buscar `yunaceramica.com`)
- `resources/js/Pages/Productos/Show.jsx` (buscar `yunaceramica.com`)

---

### 3.5 - Google Analytics y Search Console

**Google Search Console:**
1. Verificar propiedad con archivo HTML en `public/`
2. Enviar el sitemap XML: `https://yunaceramica.com/sitemap.xml`

**Google Analytics 4:**
1. Crear propiedad GA4 en analytics.google.com
2. Agregar script en `resources/views/app.blade.php` (solo en produccion con `@if(config('app.env') === 'production')`)
3. Trackear eventos clave: agregar al carrito, iniciar checkout, compra completada, inscripcion a taller

---

## PRIORIDAD 4 — PULIDO FINAL

---

### 4.1 - Mejorar la pagina de inicio

- Agregar seccion de resenas (ya existe `ReviewsSection.jsx` y `ReviewCarousel.jsx`)
- Agregar seccion de "Ultimos productos" con los 4-6 mas recientes
- Agregar seccion de "Proximos talleres" con 2-3 talleres proximos
- Actualizar la imagen OG (ver punto 2.4)
- Completar el schema.org `LocalBusiness` con datos reales (horarios, telefono)

**Archivos:**
- `resources/js/Pages/Index.jsx`
- `routes/web.php` → pasar datos de productos y talleres recientes al Index

---

### 4.2 - Mejorar ficha de producto

- Agregar schema.org `BreadcrumbList`
- "Productos relacionados" al final (misma subcategoria, max 4)
- Badge de descuento visible ("20% OFF")
- Zoom en imagen al hacer hover o lightbox

**Archivos:**
- `resources/js/Pages/Productos/Show.jsx`
- `app/Http/Controllers/ProductoController.php` → agregar productos relacionados en `show()`

---

### 4.3 - Optimizar .env para produccion

Verificar en el servidor de produccion:
```
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yunaceramica.com
```

Y ejecutar:
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
```

---

### 4.4 - Performance general

- Lazy loading: agregar `loading="lazy"` a todas las imagenes fuera del viewport
- `fetchpriority="high"` en la imagen hero de la homepage
- Verificar que Google Fonts use `display=swap`
- Revisar peso del bundle JS

---

## RESUMEN DE ORDEN DE EJECUCION

```
SEMANA 1 (Critico):
  [ ] 1.4 - Arreglar titulo homepage (5 minutos)
  [ ] 1.1 - Crear Edit.jsx de productos (2-3 hs)
  [ ] 1.3 - Desharcodear costo de envio (tabla settings) (3-4 hs)

SEMANA 2 (Imagenes):
  [ ] 1.2A - Optimizar imagenes nuevas al subir (store/update) (2 hs)
  [ ] 1.2B - Comando Artisan para imagenes existentes (2 hs)
  [ ] 1.2C - Frontend con <picture> srcSet (1 hs)

SEMANA 3 (SEO):
  [ ] 2.3 - Sitemap XML y robots.txt (2 hs)
  [ ] 2.4 - OG image mejorada en homepage (30 min)
  [ ] 2.5 - Schema.org para talleres (1 hs)
  [ ] 3.4 - Reemplazar URLs hardcodeadas (30 min)
  [ ] 3.5 - Google Analytics + Search Console (1 hs)

SEMANA 4 (Dashboard):
  [ ] 2.1.1 - CRUD Subcategorias (3 hs)
  [ ] 2.1.2 - Vista Newsletter dashboard (2 hs)
  [ ] 2.1.3 - Panel Configuracion General (3 hs)
  [ ] 2.1.4 - Toggle activo en productos (30 min)
  [ ] 3.3 - Panel de compras con estados (3 hs)

SEMANA 5 (UX y Pulido):
  [ ] 2.2 - Feedback de usuario (toasts, spinners) (3-4 hs)
  [ ] 4.1 - Mejorar homepage con secciones (3 hs)
  [ ] 4.2 - Mejorar ficha de producto (2 hs)
  [ ] 4.4 - Performance general (2 hs)

SEMANA 6 (Envios + Produccion):
  [ ] 3.1 - Integracion envia.com (4-6 hs)
  [ ] 3.2 - Activar SSR si el servidor lo permite (variable)
  [ ] 4.3 - Optimizar .env produccion (30 min)
```

---

## NOTAS PARA EL DESARROLLADOR

1. **No borrar imagenes originales** al optimizar. Mantener el original y agregar las versiones `_mobile`, `_desktop`, `_large` al mismo directorio.

2. **El `ImageOptimizationService` asume crop/zoom**. Para productos sin crop, usar: `$crop = ['x' => 0, 'y' => 0]` y `$zoom = 1`. Agregar logica en el servicio para detectar si el crop es neutro y omitirlo.

3. **Todos los cambios de dashboard** deben usar el layout `DashboardLayout.jsx`. No crear layouts custom por seccion.

4. **MercadoPago** ya esta integrado para productos y talleres. No modificar a menos que sea estrictamente necesario.

5. **envia.com** requiere cuenta activa en https://envia.com y obtener API Key antes de implementar.

6. **La cola de jobs** (`QUEUE_CONNECTION=database`) esta configurada. Usarla para procesar imagenes en background durante la optimizacion retroactiva masiva (evitar timeout HTTP).

7. **Testear SSR** localmente con `npm run build` antes de activar en produccion.

8. **El schema.org de producto** ya esta implementado en `Show.jsx`. Verificar con Google Rich Results Test que este pasando validacion.

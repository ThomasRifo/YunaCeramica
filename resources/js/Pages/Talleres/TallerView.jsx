import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import ImageWithText from "@/Components/Taller/ImageWithText";
import PiecesCarousel from "@/Components/Taller/PiecesCarousel";
import LocationMap from "@/Components/Taller/LocationMap";
import { Head, Link } from "@inertiajs/react";
import { Calendar, Clock, MapPin, DollarSign, CheckCircle  } from "lucide-react";
import MercadoPagoButton from "@/Components/MercadoPagoButton";
import { Button } from '@/Components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/Components/ui/dialog';
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useRef, useEffect, useState } from "react";
import Breadcrumbs from "@/Components/Breadcrumbs";

export default function TallerView({ imagenes, pagoAprobado: pagoAprobadoProp, imagenesPiezas, slug, subcategoria, talleresDisponibles }) {
  const [showFloatingButton, setShowFloatingButton] = useState(true);
  const mainButtonRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const [showModal, setShowModal] = useState(false);

  // Efecto para controlar la visibilidad del botón flotante
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Cuando el botón principal es visible, ocultamos el flotante
        setShowFloatingButton(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.5, // Cuando el 50% del botón principal es visible
      }
    );

    if (mainButtonRef.current) {
      observer.observe(mainButtonRef.current);
    }

    return () => {
      if (mainButtonRef.current) {
        observer.unobserve(mainButtonRef.current);
      }
    };
  }, []);

  // Debug: Log de props recibidas
  console.log('TallerView - Props recibidas:', {
    imagenes: imagenes?.length,
    slug,
    subcategoria,
    talleresDisponibles: talleresDisponibles?.length,
    talleresDisponiblesData: talleresDisponibles,
  });

  // Usar el primer taller para mostrar info general (precio, horario, etc.)
  const tallerReferencia = talleresDisponibles[0] || {};

  // Debug específico para horarios
  console.log('TallerView - Datos de horario:', {
    hora: tallerReferencia.hora,
    horaFin: tallerReferencia.horaFin,
    tipoHora: typeof tallerReferencia.hora,
    tipoHoraFin: typeof tallerReferencia.horaFin,
  });

  const breadcrumbItems = [
    {
      label: 'Talleres',
      href: '/talleres'
    },{
      label: subcategoria?.nombre || 'Taller',
      href: '#'
    }
  ];

  // Función para formatear la fecha con día de la semana
  const formatFecha = (fecha) => {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const d = dayjs(fecha);
    return `${dias[d.day()]} ${d.format('DD-MM-YYYY')}`;
  };

  // Fechas de todos los talleres
  const fechasDisponibles = talleresDisponibles.map(t => {
    return `${formatFecha(t.fecha)}${!t.cupoDisponible ? ' (COMPLETO)' : ''}`;
  }).join(' o ');

  const precios = (
    <div className="mt-6 space-y-2 text-gray-800">
      <div className="flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-black" />
        <span>El valor es de <strong> ${tallerReferencia.precio?.toLocaleString("es-AR") } </strong>por persona abonando con <strong>transferencia</strong> </span>
      </div>
    </div>
  );
  const extraInfo = (
    <div className="mt-6 space-y-2 text-gray-800">
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-black" />
        <span><strong>Fechas:</strong> {fechasDisponibles}</span>
      </div>
      {tallerReferencia.hora && (
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-black" />
          <span><strong>Horario:</strong> {tallerReferencia.hora}
          {tallerReferencia.horaFin ? ` - ${tallerReferencia.horaFin}` : ''}</span>
        </div>
      )}
      {tallerReferencia.ubicacion && (
        <div className="flex items-center gap-2">
          <MapPin className="md:w-5 md:h-5 min-h-5 min-w-5 text-black" />
          <a href="#ubicacion" className="flex items-center">
            <span><strong>Ubicación:</strong> <span className="text-blue-500 hover:underline">{tallerReferencia.ubicacion} (Ver mapa)</span></span>
          </a>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Head title={subcategoria?.nombre || 'Taller'} />
      <div className="max-w-7xl mx-auto px-4 py-8 pt-24 md:pt-28">
      <Breadcrumbs items={breadcrumbItems} />
        {/* Floating Button */}
        <AnimatePresence>
          {tallerReferencia.idSubcategoria && showFloatingButton && (
            <motion.div
              className="fixed bottom-8 right-8 z-50"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ 
                opacity: 0,
                scale: 0.8,
                transition: { duration: 0.3 }
              }}
              transition={{ duration: 0.3 }}
            >
              {tallerReferencia.esPasado ? (
                <button
                  className="inline-block bg-black text-white font-semibold py-3 px-6 rounded-lg text-xl shadow-lg cursor-not-allowed opacity-70"
                  disabled
                >
                  Evento finalizado
                </button>
              ) : !tallerReferencia.cupoDisponible ? (
                <button
                  className="inline-block bg-black text-white font-semibold py-3 px-6 rounded-lg text-xl shadow-lg cursor-not-allowed opacity-70"
                  disabled
                >
                  CUPO LLENO
                </button>
              ) : (
                <Link
                  href={`/talleres-${tallerReferencia.subcategoria.url}-inscripcion`}
                  className="inline-block bg-black hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition text-xl shadow-lg hover:shadow-xl"
                >
                  ¡Quiero inscribirme!
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Título principal */}
        <motion.h1
          className="text-3xl md:text-5xl font-bold text-center mb-2"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8 }}
        >
          {subcategoria?.nombre?.toUpperCase() || 'TALLER'}
        </motion.h1>

        {/* Secciones de Imagen + Texto */}
        <div className="space-y-16 md:mt-24 mt-8">
          <ImageWithText
            image={`/storage/talleres/${imagenes[0]?.urlImagen}`}
            crop={{ x: imagenes[0]?.crop_x ?? 0, y: imagenes[0]?.crop_y ?? 0 }}
            zoom={imagenes[0]?.zoom ?? 1}
            aspectRatio={1.4/1.5}
            title="Nuestra Experiencia"
            description={imagenes[0]?.texto}
            extraContent={extraInfo}
          />

          <ImageWithText
            image={`/storage/talleres/${imagenes[1]?.urlImagen}`}
            crop={{ x: imagenes[1]?.crop_x ?? 0, y: imagenes[1]?.crop_y ?? 0 }}
            zoom={imagenes[1]?.zoom ?? 1}
            aspectRatio={1.4/1.5}
            title="¿Qué incluye?"
            description={imagenes[1]?.texto}
            reverse
          />

          <ImageWithText
            image={`/storage/talleres/${imagenes[2]?.urlImagen}`}
            crop={{ x: imagenes[2]?.crop_x ?? 0, y: imagenes[2]?.crop_y ?? 0 }}
            zoom={imagenes[2]?.zoom ?? 1}
            aspectRatio={1.4/1.5}
            title=""
            description={imagenes[2]?.texto}
            extraContent={precios}
          />
        </div>

        {/* Main Button */}
        <motion.div
          ref={mainButtonRef}
          className="text-center my-24"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ 
            opacity: 1, 
            scale: 1,
            transition: {
              duration: 0.5,
              delay: 0.2
            }
          }}
          viewport={{ once: true, amount: 0.4 }}
        >
          {tallerReferencia.idSubcategoria && (
            <motion.div
              initial={!showFloatingButton ? { 
                opacity: 0,
                scale: 0.8,
                y: 100
              } : false}
              animate={!showFloatingButton ? {
                opacity: 1,
                scale: 1,
                y: 0
              } : false}
              transition={{ duration: 0.5 }}
            >
              {tallerReferencia.esPasado ? (
                <button
                  className="inline-block w-1/2 bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg text-2xl shadow-lg cursor-not-allowed opacity-70"
                  disabled
                >
                  Evento finalizado
                </button>
              ) : !tallerReferencia.cupoDisponible ? (
                <button
                  className="inline-block w-1/2 bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg text-2xl shadow-lg cursor-not-allowed opacity-70"
                  disabled
                >
                  CUPO LLENO
                </button>
              ) : (
                <Link
                  href={`/talleres-${tallerReferencia.subcategoria.url}-inscripcion`}
                  className="inline-block w-1/2 bg-black hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition text-2xl shadow-lg hover:shadow-xl"
                >
                  ¡Quiero inscribirme!
                </Link>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Carrusel de piezas */}
        <PiecesCarousel images={imagenesPiezas} title="Piezas disponibles para pintar" />
        
        {/* Mapa */}
        {tallerReferencia.ubicacion && (
          <div id="ubicacion" className="pt-16">
            <LocationMap direccion={tallerReferencia.ubicacion} />
          </div>
        )}
      </div>
      <Dialog open={showModal} onOpenChange={setShowModal} >
        <DialogContent >
        <div className="  flex flex-col items-center justify-center bg-gray-100 px-4 pt-2">
            <Head title="Pago Exitoso" />

            <div className="bg-white p-8 md:p-8 rounded-xl max-w-2xl w-full text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    ¡Pago Aprobado!
                </h1>
                </div>
                <p className="text-gray-600 mb-6 text-lg text-center">
                    Tu inscripción al taller ha sido confirmada exitosamente.
                </p>
            <div className="text-left bg-gray-50 p-4 rounded-lg border border-gray-200 mb-8 space-y-2">
              <div><strong>Taller:</strong> {tallerReferencia.nombre}</div>
              <div><strong>Ubicación:</strong> {tallerReferencia.ubicacion}</div>
              <div><strong>Fecha:</strong> {dayjs(tallerReferencia.fecha).format('DD-MM-YYYY')} </div>
              <div><strong>Horario:</strong> {tallerReferencia.hora}
              {tallerReferencia.horaFin ? ` - ${tallerReferencia.horaFin}` : ''}</div>
            </div>
            <p className="text-gray-600 mb-6">
                    Recibirás un correo electrónico con los detalles completos en breve. ¡Gracias por tu confianza!
                </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}


import { motion } from "framer-motion";

export default function LocationMap({ direccion }) {
  const mapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(direccion)}&output=embed`;

  return (
    <motion.div 
      className="my-20"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.8 }} // amount es qué porcentaje debe entrar para activarse
      transition={{ duration: 1.8 }}
    >
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Ubicación</h2>
      <div className="w-full h-[400px] rounded-lg overflow-hidden">
        <iframe
          src={mapsUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="object-cover"
        ></iframe>
      </div>
    </motion.div>
  );
}

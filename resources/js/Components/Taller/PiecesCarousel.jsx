import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { motion } from 'framer-motion';
import { AspectRatio } from "@/Components/ui/aspect-ratio";

export default function PiecesCarousel({ images }) {
  return (
    <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, amount: 0.8 }} // amount es qué porcentaje debe entrar para activarse
    transition={{ duration: 1.8 }}
    >
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Piezas para pintar</h2>

      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={2.2}
        navigation
        breakpoints={{
          640: { slidesPerView: 3.2 },
          768: { slidesPerView: 4.2 },
          1024: { slidesPerView: 5.2 },
        }}
        className="px-4"
      >
        {images?.length > 0 ? images.map((img, idx) => (
          <SwiperSlide key={idx}>
            <AspectRatio ratio={2 / 1.8} className="relative rounded-xl overflow-hidden shadow-md cursor-pointer">
              {img ? (
                <img 
                  src={img} 
                  alt={`Pieza ${idx + 1}`} 
                  className="object-cover w-full h-full" 
                  loading="lazy"
                  onClick={() => window.open(img, '_blank')}
                />
              ) : (
                <div className="w-full h-full bg-gray-400" />
              )}
            </AspectRatio>
          </SwiperSlide>
        )) : (
          <SwiperSlide>
            <AspectRatio ratio={2 / 1.8} className="relative rounded-xl overflow-hidden shadow-md bg-gray-400" />
          </SwiperSlide>
        )}
      </Swiper>
    </motion.div>
  );
}

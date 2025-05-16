import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import { AspectRatio } from "@/Components/ui/aspect-ratio";
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function PiecesCarousel({ images, title }) {
  return (
    <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, amount: 0.8 }}
    transition={{ duration: 1.8 }}
    className="relative"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">{title}</h2>

      <div className="relative">
        <Swiper
          className="h-64 md:h-80"
          modules={[Navigation, Autoplay]}
          spaceBetween={8}
          slidesPerView={2}
          navigation={{
            prevEl: '.swiper-button-prev',
            nextEl: '.swiper-button-next',
          }}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
        >
          {images?.length > 0 ? images.map((img, idx) => (
            <SwiperSlide key={idx}>
              <AspectRatio
                ratio={1.2 / 1.2}
                className="relative overflow-hidden rounded-xl shadow-md cursor-pointer h-full w-auto mx-auto border border-gray-300"
              >
                {img ? (
                  <img
                    src={img}
                    alt={`Pieza ${idx + 1}`}
                    className="object-cover w-full h-full"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-400" />
                )}
              </AspectRatio>
            </SwiperSlide>
          )) : (
            <SwiperSlide>
              <AspectRatio
                ratio={2 / 1}
                className="relative overflow-hidden shadow-md cursor-pointer h-[700px] w-full mx-auto"
              />
            </SwiperSlide>
          )}
        </Swiper>

        <button className="swiper-button-prev !text-gray-400/70 hover:!text-gray-600 transition absolute -left-1 top-1/2 transform -translate-y-1/2 z-10 !w-[50px] !h-[50px]">
          <ChevronLeft className="!w-[50px] !h-[50px]" />
        </button>
        <button className="swiper-button-next !text-gray-400/70 hover:!text-gray-600 transition absolute -right-1 top-1/2 transform -translate-y-1/2 z-10 !w-[50px] !h-[50px]">
          <ChevronRight className="!w-[50px] !h-[50px]" />
        </button>
      </div>

      <style jsx global>{`
        .swiper-button-prev::after,
        .swiper-button-next::after {
          display: none;
        }
        .swiper-button-prev,
        .swiper-button-next {
          width: 50px !important;
          height: 50px !important;
        }
      `}</style>
    </motion.div>
  );
}

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import ReviewCard from '@/Components/ReviewCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';

export default function ReviewCarousel({ reviews }) {
  return (
    <div className="relative w-full max-w-7xl mx-auto"> {/* ancho centrado */}
<Swiper
  modules={[Navigation]}
  navigation={{
    nextEl: ".swiper-next",
    prevEl: ".swiper-prev",
  }}
  loop={true}
  centeredSlides={true}
  slidesPerView={4.2}   // 4 enteras y una pizca de la 5ta
  spaceBetween={20}
  breakpoints={{
    320: { slidesPerView: 1.5, spaceBetween: 20 },   // celulares: 2 enteras + poquito de la 3ra
    640: { slidesPerView: 2.5, spaceBetween: 10 },
    768: { slidesPerView: 2.5, spaceBetween: 15 },   // tablets: 3 enteras + poco de la 4ta
    1024: { slidesPerView: 4.2, spaceBetween: 120 },  // desktop: 4 enteras + poquito de la 5ta
  }}
>
{reviews.map((review) => (
  <SwiperSlide key={review.id} className="flex justify-center">
    <div className="min-h-48  max-w-72 sm:min-w-48  md:min-w-64 md:min-h-80  xl:w-72"> {/* cambia según tamaño de pantalla */}
      <ReviewCard review={review} />
    </div>
  </SwiperSlide>
))}

      </Swiper>

      {/* Flechas */}
      <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10">
        <button className="swiper-prev text-gray-500 hover:text-gray-700 transition">
          <ChevronLeft size={30} />
        </button>
      </div>
      <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
        <button className="swiper-next text-gray-500 hover:text-gray-700 transition">
          <ChevronRight size={30} />
        </button>
      </div>
    </div>
  );
}

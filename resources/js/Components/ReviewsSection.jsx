import ReviewCarousel from '@/Components/ReviewCarousel';

export default function ReviewsSection({ reviews }) {
  return (
    <section className=" max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-8">Reseñas de nuestros talleres</h2>
      <ReviewCarousel reviews={reviews} />
    </section>
  );
}
import { Star } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { useState, useRef, useEffect } from 'react';
import dayjs from "dayjs";
import { Dialog, DialogContent, DialogTrigger } from '@/Components/ui/dialog';
import { AspectRatio } from "@/Components/ui/aspect-ratio";

export default function ReviewCard({ review }) {
  const [open, setOpen] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef(null);
  const fecha = dayjs(review.fecha_publicacion).format('DD/MM/YYYY');
  
  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        const isOverflow = textRef.current.scrollHeight > textRef.current.clientHeight;
        setIsOverflowing(isOverflow);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, []);

  const stars = Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`h-5 w-5 ${i < review.valoracion ? 'fill-black' : 'fill-white'} stroke-black`}
    />
  ));

  return (
    <>
      <div className="min-h-48 md:min-h-56 rounded-2xl bg-white border border-gray-300 shadow-lg p-6 flex flex-col justify-between overflow-hidden">
        <div>
          <h3 className="font-bold text-lg">{review.nombre} {review.apellido}</h3>
          <p className="text-sm text-gray-500 mb-2">{review.taller} - {fecha}</p>
          {//<div className="flex mb-2">{stars}</div> Todavía no las incluímos
          }
          <div className="mt-8 text-gray-700 text-base leading-relaxed">
            <p ref={textRef} className="line-clamp-4">
              {review.mensaje}
            </p>
            {isOverflowing && (
              <Dialog open={open} onOpenChange={setOpen} modal={false}>
                <DialogTrigger asChild>
                  <button className="text-blue-600 hover:text-blue-800 font-medium ml-1">
                    ...ver más
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <h3 className="text-xl font-bold">{review.nombre} {review.apellido}</h3>
                  <p className="text-gray-500 text-sm">{review.taller} - {fecha}</p>
                  {/*<div className="flex my-2">{stars}</div>  Por el momento no se muestra la valoración,
                  */
                  }
                  <p className="text-gray-700">{review.mensaje}</p>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

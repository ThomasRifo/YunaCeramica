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
        const lineHeight = parseFloat(getComputedStyle(textRef.current).lineHeight);
        const maxLines = 4;
        const maxHeight = lineHeight * maxLines;
        setIsOverflowing(textRef.current.scrollHeight > maxHeight + 1);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [review.mensaje]);

  const stars = Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`h-5 w-5 ${i < review.valoracion ? 'fill-black' : 'fill-white'} stroke-black`}
    />
  ));

  return (
    <>
      <div className="rounded-2xl bg-white border border-gray-300 shadow-lg p-6 flex flex-col justify-start overflow-hidden min-h-52 md:min-h-60 max-h-96">
        <h3 className="font-bold text-lg">{review.nombre} {review.apellido}</h3>
        <p className="text-sm text-gray-500 mb-2 h-10 md:h-4">{review.taller} - {fecha}</p>
        {/* <div className="flex mb-2">{stars}</div> */}
        <div className=" text-gray-700 text-base leading-relaxed">
          <p ref={textRef} className="line-clamp-4 md:line-clamp-6 overflow-hidden">
            {review.mensaje}
          </p>
          {isOverflowing && (
            <Dialog open={open} onOpenChange={setOpen} modal={true}>
              <DialogTrigger asChild>
                <button className="text-blue-600 hover:text-blue-800 font-medium ml-1">
                  ...ver más
                </button>
              </DialogTrigger>
              <DialogContent
                className="w-full max-w-sm md:max-w-md rounded-2xl bg-white shadow-lg border border-gray-300 p-6 flex flex-col items-start justify-center overflow-x-hidden"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  position: 'fixed',
                  margin: 0,
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  backgroundColor: '#fff',
                }}
              >
                <h3 className="text-xl font-bold break-words">{review.nombre} {review.apellido}</h3>
                <p className="text-gray-500 text-sm mb-0 break-words">{review.taller} - {fecha}</p>
                <p className="text-gray-700 whitespace-pre-line break-words overflow-x-hidden w-full">{review.mensaje}</p>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </>
  );
}

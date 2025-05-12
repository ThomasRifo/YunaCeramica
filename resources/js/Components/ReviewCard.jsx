import { Star } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { useState } from 'react';
import dayjs from "dayjs";
import { Dialog, DialogContent, DialogTrigger } from '@/Components/ui/dialog';
import { AspectRatio } from "@/Components/ui/aspect-ratio";

export default function ReviewCard({ review }) {
  const [open, setOpen] = useState(false);
  const fecha = dayjs(review.fecha_publicacion).format('DD/MM/YYYY');
  const stars = Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`h-5 w-5 ${i < review.valoracion ? 'fill-black' : 'fill-white'} stroke-black`}
    />
  ));

  const MAX_LENGTH = 120;
  const isLong = review.mensaje.length > MAX_LENGTH;
  const previewText = isLong
    ? review.mensaje.slice(0, MAX_LENGTH) + '... ver más'
    : review.mensaje;

  return (
    <>
      <div className=" min-h-64 rounded-2xl bg-white border border-gray-300 shadow-lg p-6 flex flex-col justify-between  overflow-hidden">
        <div>
          <h3 className="font-bold text-lg">{review.nombre} {review.apellido}</h3>
          <p className="text-sm text-gray-500 mb-2">{review.taller} - {fecha}</p>
          {//<div className="flex mb-2">{stars}</div> Todavía no las incluímos
          }
          <p className="mt-8 text-gray-700 text-base leading-relaxed">
            {previewText}
          </p>
        </div>
        {isLong && (
          <div className="mt-4">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">Leer completa</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <h3 className="text-xl font-bold">{review.nombre} {review.apellido}</h3>
                <p className="text-gray-500 text-sm">{review.taller}</p>
                {/*<div className="flex my-2">{stars}</div>  Por el momento no se muestra la valoración,
                */
                }
                <p className="text-gray-700">{review.mensaje}</p>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </>
  );
}

import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function ReviewExpired({ reason }) {
  const title = reason === 'used' ? 'Este enlace ya fue utilizado' : (reason === 'invalid' ? 'Enlace inválido' : 'Enlace expirado');
  const message = reason === 'used'
    ? 'Ya recibimos una reseña asociada a este enlace. Si tienes alguna duda, podés contactarnos a través de nuestro formulario de contacto.'
    : (reason === 'invalid'
        ? 'El enlace que abriste no es válido. Si tienes alguna duda, podés contactarnos a través de nuestro formulario de contacto.'
        : 'Este enlace expiró. Si tienes alguna duda, o quieres hacer una reseña, podés contactarnos a través de nuestro formulario de contacto.');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Head title={title} />
      <div className="bg-gray-200 shadow rounded-lg p-6 w-full max-w-lg text-center border border-gray-300">
        <h1 className="text-2xl font-semibold mb-2">{title}</h1>
        <p className="text-gray-600 mb-6">{message}</p>
        <Link href={route('contacto')}>
          <PrimaryButton>Ir a Contacto</PrimaryButton>
        </Link>
      </div>
    </div>
  );
}


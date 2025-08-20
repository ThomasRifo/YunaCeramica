import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import { Textarea } from '@/Components/ui/textarea.jsx';
import { useToast } from '@/Components/ui/use-toast.js';

export default function ReviewForm({ token, nombre, email, taller, flash }) {
    const { toast } = useToast();
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        token: token,
        mensaje: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('reviews.submit'), {
            preserveScroll: true,
            onSuccess: () => {
                // El controlador hace PRG con 303 back; este onSuccess puede no disparar según el flujo.
            },
            onError: (errs) => {
                const msg = errs?.token || errs?.mensaje || 'No se pudo enviar la reseña.';
                toast({ title: 'Ups...', description: msg, variant: 'destructive' });
            },
        });
    };

    // Si venimos de un PRG (redirect back con flag), mostrar toast y cerrar
    React.useEffect(() => {
        if (flash?.review_submitted) {
            toast({ title: '¡Gracias!', description: 'Reseña enviada con éxito. Esta pestaña se cerrará en 3 segundos.' });
            const t = setTimeout(() => window.close(), 3000);
            return () => clearTimeout(t);
        }
    }, [flash?.review_submitted]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <Head title="Dejá tu reseña" />
            <div className="bg-white shadow rounded-lg p-6 w-full max-w-2xl">
                <h1 className="text-xl font-semibold mb-4">¡Dejá tu reseña!</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <InputLabel value="Nombre" />
                        <input type="text" className="mt-1 block w-full rounded-md border-gray-300" value={nombre} disabled />
                        <p className="text-xs text-gray-500 mt-1">Solo usaremos tu nombre para publicar la reseña.</p>
                    </div>
                    <div>
                        <InputLabel value="Taller" />
                        <input type="text" className="mt-1 block w-full rounded-md border-gray-300" value={taller} disabled />
                    </div>
                    <div>
                        <InputLabel value="Mensaje" />
                        <Textarea className="mt-1" rows={6} value={data.mensaje} onChange={(e) => setData('mensaje', e.target.value)} placeholder="Contanos tu experiencia..." />
                        {errors.mensaje && (<p className="text-sm text-red-600 mt-1">{errors.mensaje}</p>)}
                    </div>
                    <div className="flex gap-3 justify-end">
                        <SecondaryButton type="button" onClick={() => window.close()}>Volver</SecondaryButton>
                        <PrimaryButton type="submit" disabled={processing || !data.mensaje.trim()}>Enviar</PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    );
}


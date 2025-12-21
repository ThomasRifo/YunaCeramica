import { useState } from "react";
import { Button } from "@/Components/ui/button";
import { Copy, Check } from "lucide-react";
import Modal from "@/Components/Modal";

export default function ExitoMercadoPago({ taller, referido, nombre, apellido }) {
    const [copiado, setCopiado] = useState(false);
    const [modalError, setModalError] = useState({ isOpen: false, message: '' });
    const linkReferido = `${window.location.origin}/taller/${taller.id}/referido/${referido}`;

    const copiarLink = async () => {
        try {
            await navigator.clipboard.writeText(linkReferido);
            setCopiado(true);
            setTimeout(() => setCopiado(false), 2000);
        } catch (err) {
            setModalError({ isOpen: true, message: "No se pudo copiar el link. Por favor, cópialo manualmente." });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Pago Aprobado!</h2>
            <p className="text-gray-600 mb-4">
                Tu inscripción al taller ha sido confirmada exitosamente.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg w-full mb-4">
                <div className="text-left text-gray-800">
                    <strong>Taller:</strong> {taller.nombre}<br />
                    <strong>Ubicación:</strong> {taller.ubicacion}<br />
                    <strong>Fecha:</strong> {taller.fecha}<br />
                    <strong>Hora:</strong> {taller.hora}
                </div>
            </div>
            {/* BLOQUE DE LINK DE REFERIDO */}
            <div className="w-full mt-4">
                <h3 className="font-semibold text-gray-900 mb-2">Tu link de referido:</h3>
                <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                    <input
                        type="text"
                        value={linkReferido}
                        readOnly
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm"
                    />
                    <Button
                        onClick={copiarLink}
                        variant="ghost"
                        size="sm"
                        className="hover:bg-gray-200"
                    >
                        {copiado ? (
                            <Check className="h-4 w-4 text-green-500" />
                        ) : (
                            <Copy className="h-4 w-4" />
                        )}
                    </Button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                    Comparte este link con tus amigos para que se inscriban contigo
                </p>
            </div>
            <Button
                className="w-full bg-green-600 hover:bg-green-700 mt-4"
                onClick={() => window.location.href = '/talleres'}
            >
                Volver a Talleres
            </Button>

            <Modal
                isOpen={modalError.isOpen}
                onClose={() => setModalError({ isOpen: false, message: '' })}
                title="Error"
                message={modalError.message}
                type="error"
            />
        </div>
    );
}
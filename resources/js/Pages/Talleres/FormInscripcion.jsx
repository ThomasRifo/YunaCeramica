import { useState, useEffect, useRef } from "react";
import { Head, router } from "@inertiajs/react";
import {
    Banknote,
    Calendar,
    Clock,
    CreditCard,
    DollarSign,
    Landmark,
    MapPin,
    XCircle,
} from "lucide-react";
import { Input } from "@/Components/ui/input";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import CardMenu from "@/Components/Taller/CardMenu";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/Components/ui/dialog";
import ReCAPTCHA from "react-google-recaptcha";
dayjs.extend(customParseFormat);

const recaptchaV3Key = "6LeWbjorAAAAAN1iTNC1iDlAzdGhuqJ9RKKVW0lN";
const recaptchaV2Key = "6LfRcDorAAAAADXRjzq75JFZVZk_hS_coEOQ2CNV";

export default function FormInscripcion({ taller }) {
    const { toast } = useToast();
    const [cantidadPersonas, setCantidadPersonas] = useState(1);
    const [metodoPago, setMetodoPago] = useState("reserva");
    const [isLoadingMercadoPago, setIsLoadingMercadoPago] = useState(false);
    const [isLoadingTransferencia, setIsLoadingTransferencia] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [datosCliente, setDatosCliente] = useState({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        menu: "",
    });

    const [acompanantes, setAcompanantes] = useState([]);
    const [showFailure, setShowFailure] = useState(false);
    const [showPending, setShowPending] = useState(false);

    const [showV2, setShowV2] = useState(false);
    const [v2Token, setV2Token] = useState("");
    const [accionPendiente, setAccionPendiente] = useState(null);
    const recaptchaV2Ref = useRef();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            if (params.get("pago") === "failure") setShowFailure(true);
            if (params.get("pago") === "pending") setShowPending(true);
        }
    }, []);

    const handleCantidadChange = (e) => {
        const nuevaCantidad = parseInt(e.target.value);
        setCantidadPersonas(nuevaCantidad);

        const nuevos = [...acompanantes];
        while (nuevos.length < nuevaCantidad - 1) {
            nuevos.push({
                nombre: "",
                apellido: "",
                email: "",
                telefono: "",
                menu: "",
            });
        }
        while (nuevos.length > nuevaCantidad - 1) {
            nuevos.pop();
        }
        setAcompanantes(nuevos);
    };

    const precioBase = taller.precio;
    const precioReserva = taller.precio /2;
    const precioTarjeta = Math.round(precioBase * 1.1);
    const total =
        metodoPago === "tarjeta"
            ? precioTarjeta * cantidadPersonas
            : metodoPago === "total"
              ? precioBase * cantidadPersonas
              : Math.round((precioBase / 2) * cantidadPersonas);

    const handlePagoMercadoPago = async () => {
        if (!datosCliente.nombre || !datosCliente.apellido || !datosCliente.email || !datosCliente.menu) {
            toast({
                title: "Datos incompletos",
                description: "Por favor, completa tus datos (nombre, apellido, email) y selecciona un menú antes de continuar.",
                variant: "destructive",
            });
            return;
        }
        for (const acompanante of acompanantes) {
            if (!acompanante.nombre || !acompanante.apellido || !acompanante.menu) {
                toast({
                    title: "Datos incompletos",
                    description: "Por favor, completa los datos de todos los acompañantes (nombre, apellido y menú).",
                    variant: "destructive",
                });
                return;
            }
        }

        setIsLoadingMercadoPago(true);

        const payload = {
            tallerId: taller.id,
            titulo: taller.nombre,
            descripcion: `Inscripción al taller: ${taller.nombre} (${cantidadPersonas} persona(s))`,
            cantidad: cantidadPersonas,
            precioUnitario: precioTarjeta,
            datos_cliente: { 
                nombre: datosCliente.nombre,
                apellido: datosCliente.apellido,
                email: datosCliente.email,
                telefono: datosCliente.telefono,
            },
            participantes: [
                {
                    nombre: datosCliente.nombre,
                    apellido: datosCliente.apellido,
                    email: datosCliente.email,
                    telefono: datosCliente.telefono,
                    menu_id: datosCliente.menu,
                },
                ...acompanantes.map(a => ({
                    nombre: a.nombre,
                    apellido: a.apellido,
                    email: a.email,
                    telefono: a.telefono,
                    menu_id: a.menu,
                }))
            ]
        };

        try {
            const response = await fetch('/api/mercadopago/create-preference', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const responseData = await response.json();

            if (response.ok && responseData?.mercadopago?.init_point) {
                window.location.href = responseData.mercadopago.init_point;
            } else {
                console.error("Error al crear preferencia de MP. Respuesta:", responseData);
                const errorMessage = responseData?.message || responseData?.mercadopago?.message || "Hubo un problema al iniciar el pago (respuesta inválida del servidor).";
                toast({
                    title: "Error al iniciar el pago",
                    description: errorMessage,
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Error en la petición fetch a create-preference:", error);
            toast({
                title: "Error de red",
                description: "Ocurrió un error de red o al procesar la solicitud. Por favor, intenta de nuevo.",
                variant: "destructive",
            });
        } finally {
            setIsLoadingMercadoPago(false);
        }
    };

    const handleTransferencia = () => {
        if (!datosCliente.nombre || !datosCliente.apellido || !datosCliente.email || !datosCliente.menu) {
            toast({
                title: "Datos incompletos",
                description: "Por favor, completa tus datos (nombre, apellido, email) y selecciona un menú antes de continuar.",
                variant: "destructive",
            });
            return;
        }
        for (const acompanante of acompanantes) {
            if (!acompanante.nombre || !acompanante.apellido || !acompanante.menu) {
                toast({
                    title: "Datos incompletos",
                    description: "Por favor, completa los datos de todos los acompañantes (nombre, apellido y menú).",
                    variant: "destructive",
                });
                return;
            }
        }
    
        setIsLoadingTransferencia(true);
        router.post('/talleres/transferencia', {
            tallerId: taller.id,
            nombre: datosCliente.nombre,
            apellido: datosCliente.apellido,
            email: datosCliente.email,
            telefono: datosCliente.telefono,
            cantidadPersonas,
            esReserva: metodoPago === 'reserva',
            menu_id: datosCliente.menu
        }, {
            onSuccess: () => {
                setShowSuccessDialog(true);
            },
            onError: (errors) => {
                toast({
                    title: 'Error',
                    description: errors.message || 'Ocurrió un error al procesar la inscripción.',
                    variant: 'destructive',
                });
            },
            onFinish: () => {
                setIsLoadingTransferencia(false);
            }
        });
    };

    const handleInscripcionConCaptcha = async (accion) => {
        // Ejecutar reCAPTCHA v3
        const v3Token = await window.grecaptcha.execute(recaptchaV3Key, { action: "submit" });

        // Validar en backend
        const response = await fetch("/api/validar-captcha", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ v3Token }),
        });
        const data = await response.json();

        if (data.score < 0.5) {
            // Score bajo: mostrar reCAPTCHA v2 y guardar la acción pendiente
            setShowV2(true);
            setAccionPendiente(() => accion);
        } else {
            // Score alto: ejecutar la acción original
            accion();
        }
    };

    const handleV2Change = async (token) => {
        setV2Token(token);
        const response = await fetch("/api/validar-captcha", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ v2Token: token }),
        });
        const data = await response.json();
        if (data.success && accionPendiente) {
            accionPendiente(); // Ejecuta la acción original
            setShowV2(false);
            setAccionPendiente(null);
        } else {
            // Mostrar error si el captcha falla
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-36">
            <Head title={`Inscripción - ${taller?.nombre}`} />
            <h1 className="text-3xl text-center font-bold mb-4">
                {taller?.nombre?.toUpperCase?.() || "TALLER"} - Inscripción
            </h1>

            <p className="text-gray-600 text-center text-base ">
                <Calendar className="w-5 h-5 text-black inline" />{" "}
                <strong>{taller.fecha}</strong> |{" "}
                <Clock className="w-5 h-5 text-black inline" />{" "}
                <strong>
                    {dayjs(taller.hora, "HH:mm:ss").format("HH:mm")}
                </strong>{" "}
                | <MapPin className="w-5 h-5 inline text-black" />{" "}
                <strong>{taller.ubicacion}</strong>
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Reserva */}
                <div className="bg-gray-300 rounded-xl p-4 shadow flex flex-col items-center text-center">
                    <Landmark className="w-10 h-10 text-black mb-2" />
                    <h3 className="font-semibold text-gray-700 text-xl mb-1">
                        Transferencia
                    </h3>
                    <strong>Señá tu lugar</strong>
                    <p className="text-gray-800 text-base">
                        <strong className="font-extrabold text-lg">
                            ${precioReserva.toLocaleString("es-AR")}
                        </strong>{" "}
                        por persona
                    </p>
                </div>

                {/* Transferencia total */}
                <div className="bg-gray-300 rounded-xl p-4 shadow flex flex-col items-center text-center">
                    <Landmark className="w-10 h-10 text-black mb-2" />
                    <h3 className="font-semibold text-gray-700 text-xl mb-1">
                        Transferencia
                    </h3>
                    <strong>Aboná la totalidad</strong>
                    <p className="text-gray-800 text-base">
                        <strong className="font-extrabold text-lg">
                            ${precioBase.toLocaleString("es-AR")}
                        </strong>{" "}
                        por persona
                    </p>
                </div>

                {/* Tarjeta */}
                <div className="bg-gray-300 rounded-xl p-4 shadow flex flex-col items-center text-center">
                    <CreditCard className="w-10 h-10 text-black mb-2" />
                    <h3 className="font-semibold text-gray-700 mb-1 text-xl">
                        Tarjeta / MercadoPago
                    </h3>
                    <strong>Aboná la totalidad</strong>
                    <p className="text-gray-800 text-base">
                        <strong className="font-extrabold text-lg">
                            ${(precioTarjeta * cantidadPersonas).toLocaleString("es-AR")}
                        </strong>{" "}
                    </p>
                </div>
            </div>

            <div className="mt-10 space-y-6">
                <div>
                    <Label>Cantidad de personas (incluyéndote):</Label>
                    <Input
                        type="number"
                        value={cantidadPersonas}
                        min={1}
                        onChange={handleCantidadChange}
                        className="h-12"
                    />
                </div>

                <div>
                    <h2 className="text-xl font-semibold mt-4 mb-2">
                        Tus datos
                    </h2>
                    <div className="grid gap-2">
                        <Input
                            placeholder="Nombre"
                            className="h-12"
                            value={datosCliente.nombre}
                            onChange={(e) =>
                                setDatosCliente({
                                    ...datosCliente,
                                    nombre: e.target.value,
                                })
                            }
                        />
                        <Input
                            className="h-12"
                            placeholder="Apellido"
                            value={datosCliente.apellido}
                            onChange={(e) =>
                                setDatosCliente({
                                    ...datosCliente,
                                    apellido: e.target.value,
                                })
                            }
                        />
                        <Input
                            className="h-12"
                            placeholder="Email"
                            type="email"
                            value={datosCliente.email}
                            onChange={(e) =>
                                setDatosCliente({
                                    ...datosCliente,
                                    email: e.target.value,
                                })
                            }
                        />
                        <Input
                            className="h-12"
                            placeholder="Teléfono"
                            type="tel"
                            value={datosCliente.telefono}
                            onChange={(e) =>
                                setDatosCliente({
                                    ...datosCliente,
                                    telefono: e.target.value,
                                })
                            }
                        />

                        <div className="space-y-4 mt-4 mx-auto w-full">
                            <Label className="text-lg">Elegí tu menú:</Label>
                            <div className="grid sm:grid-cols-2 md:grid-cols-3  gap-4 mt-2 ">
                                {taller.menus.map((menu) => (
                                    <div
                                        key={menu.id}
                                        className="prose"
                                    >
                                        <CardMenu
                                            menu={menu}
                                            seleccionado={datosCliente.menu === String(menu.id)}
                                            onSelect={(id) => {
                                                setDatosCliente({
                                                    ...datosCliente,
                                                    menu: String(id),
                                                });
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {acompanantes.map((a, i) => (
                    <div key={i}>
                        <h2 className="text-lg font-semibold mt-6 mb-2">
                            Acompañante {i + 1}
                        </h2>
                        <div className="grid gap-2">
                            <Input
                                className="h-12"
                                placeholder="Nombre"
                                value={a.nombre}
                                onChange={(e) => {
                                    const nuevos = [...acompanantes];
                                    nuevos[i].nombre = e.target.value;
                                    setAcompanantes(nuevos);
                                }}
                            />
                            <Input
                                className="h-12"
                                placeholder="Apellido"
                                value={a.apellido}
                                onChange={(e) => {
                                    const nuevos = [...acompanantes];
                                    nuevos[i].apellido = e.target.value;
                                    setAcompanantes(nuevos);
                                }}
                            />
                            <Input
                                className="h-12"
                                placeholder="Email"
                                type="email"
                                value={a.email}
                                onChange={(e) => {
                                    const nuevos = [...acompanantes];
                                    nuevos[i].email = e.target.value;
                                    setAcompanantes(nuevos);
                                }}
                            />
                            <Input
                                className="h-12"
                                placeholder="Teléfono"
                                type="tel"
                                value={a.telefono}
                                onChange={(e) => {
                                    const nuevos = [...acompanantes];
                                    nuevos[i].telefono = e.target.value;
                                    setAcompanantes(nuevos);
                                }}
                            />
                            <div className="space-y-4 mt-4">
                                <Label className="text-lg">Elegí un menú para el acompañante {i+1}:</Label>
                                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                                    {taller.menus.map((menu) => (
                                        <CardMenu
                                            key={menu.id}
                                            menu={menu}
                                            seleccionado={a.menu === String(menu.id)}
                                            onSelect={(id) => {
                                                const nuevosAcompanantes = [...acompanantes];
                                                nuevosAcompanantes[i].menu = String(id);
                                                setAcompanantes(nuevosAcompanantes);
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="pt-8 space-y-2 text-center">
                    <Label className="text-2xl">Método de pago:</Label>
                    <div className="grid gap-2">
                        <Button
                            className="h-12"
                            variant={
                                metodoPago === "reserva" ? "default" : "outline"
                            }
                            onClick={() => setMetodoPago("reserva")}
                        >
                            Reserva (${((precioBase / 2) * cantidadPersonas).toLocaleString("es-AR")})
                        </Button>
                        <Button
                            className="h-12"
                            variant={
                                metodoPago === "total" ? "default" : "outline"
                            }
                            onClick={() => setMetodoPago("total")}
                        >
                            Total con transferencia ($
                            {(precioBase * cantidadPersonas).toLocaleString("es-AR")})
                        </Button>
                        <Button
                            className="h-12"
                            variant={
                                metodoPago === "tarjeta" ? "default" : "outline"
                            }
                            onClick={() => setMetodoPago("tarjeta")}
                        >
                            Total con Tarjeta / MercadoPago ($
                            {(precioTarjeta * cantidadPersonas).toLocaleString("es-AR")})
                        </Button>
                    </div>
                </div>

                <p className="mt-4 text-lg text-center">
                    Total a pagar: <strong>${total.toLocaleString("es-AR")}</strong>
                </p>

                <div className="flex justify-end space-x-4">
                    {metodoPago === 'tarjeta' && (
                        <Button
                            className="h-12 w-full"
                            onClick={handlePagoMercadoPago}
                            disabled={isLoadingMercadoPago || !datosCliente.nombre || !datosCliente.apellido || !datosCliente.email || !datosCliente.menu}
                        >
                            {isLoadingMercadoPago ? "Procesando..." : "Pagar con MercadoPago"}
                        </Button>
                    )}
                    
                    {(metodoPago === 'reserva' || metodoPago === 'total') && (
                        <Button
                            className="h-12 w-full bg-green-600 hover:bg-green-700"
                            onClick={handleTransferencia}
                            disabled={isLoadingTransferencia || !datosCliente.nombre || !datosCliente.apellido || !datosCliente.email || !datosCliente.menu}
                        >
                            {isLoadingTransferencia ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                                    <span>Procesando inscripción...</span>
                                </div>
                            ) : (
                                "Confirmar inscripción y recibir datos de transferencia"
                            )}
                        </Button>
                    )}
                </div>
            </div>

            <Dialog open={showFailure} onOpenChange={setShowFailure}>
                <DialogContent>
                    <div className="flex flex-col items-center justify-center bg-gray-100 px-4 pt-2">
                        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">Pago Rechazado</h1>
                        <p className="text-gray-600 mb-6 text-lg text-center">
                            Tu pago no pudo ser procesado o fue rechazado.<br />
                            Por favor, intenta nuevamente o elige otro método de pago.
                        </p>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={showPending} onOpenChange={setShowPending}>
                <DialogContent>
                    <div className="flex flex-col items-center justify-center bg-gray-100 px-4 pt-2">
                        <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">Pago Pendiente</h1>
                        <p className="text-gray-600 mb-6 text-lg text-center">
                            Tu pago está pendiente de aprobación.<br />
                            Te notificaremos por email cuando se confirme.<br />
                            Si tienes dudas, contáctanos.
                        </p>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <DialogContent className="sm:max-w-md">
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Inscripción Exitosa!</h2>
                        <p className="text-gray-600 mb-4">
                            Hemos enviado un correo a <span className="font-semibold">{datosCliente.email}</span> con los datos para realizar la transferencia.
                        </p>
                        <div className="bg-gray-50 p-4 rounded-lg w-full mb-4">
                            <h3 className="font-semibold text-gray-900 mb-2">Próximos pasos:</h3>
                            <ol className="text-left text-gray-600 space-y-2">
                                <li className="flex items-start">
                                    <span className="mr-2">1.</span>
                                    <span>Revisa tu correo electrónico para obtener los datos de la transferencia.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">2.</span>
                                    <span>Realiza la transferencia por el monto indicado.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">3.</span>
                                    <span>Envía el comprobante de transferencia al mismo correo electrónico.</span>
                                </li>
                            </ol>
                        </div>
                        <Button
                            className="w-full bg-green-600 hover:bg-green-700"
                            onClick={() => window.location.href = '/talleres'}
                        >
                            Volver a Talleres
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {showV2 && (
                <ReCAPTCHA
                    sitekey={recaptchaV2Key}
                    onChange={handleV2Change}
                    ref={recaptchaV2Ref}
                />
            )}
        </div>
    );
}

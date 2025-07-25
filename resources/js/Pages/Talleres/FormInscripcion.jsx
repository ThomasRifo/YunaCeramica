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
    Copy,
    Check,
    HelpCircle,
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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import CardMenu from "@/Components/Taller/CardMenu";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/Components/ui/dialog";
//import ReCAPTCHA from "react-google-recaptcha";
import Breadcrumbs from '@/Components/Breadcrumbs';
dayjs.extend(customParseFormat);

export default function FormInscripcion({ taller = {}, slug = '', referido: referidoProp = null, talleresDisponibles = [], subcategoria }) {
    
    // Debug: Log de props recibidas
    
    const { toast } = useToast();
    const [cantidadPersonas, setCantidadPersonas] = useState(1);
    const [metodoPago, setMetodoPago] = useState("reserva");
    const [isLoadingMercadoPago, setIsLoadingMercadoPago] = useState(false);
    const [isLoadingTransferencia, setIsLoadingTransferencia] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [linkReferido, setLinkReferido] = useState("");
    const [copiado, setCopiado] = useState(false);
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
    const [errores, setErrores] = useState({});
    const breadcrumbItems = [
        {
            label: 'Talleres',
            href: '/talleres'
        },
        {
            label: slug === 'ceramica-y-cafe' ? 'Cerámica y Café' : 'Cerámica y Gin',
            href: `/talleres-${slug}`
        },
        {
            label: 'Inscripción',
            href: '#'
        }
    ];

    // Agregar estado para controlar si el formulario está deshabilitado
    const [isFormDisabled, setIsFormDisabled] = useState(false);
    const [formStatus, setFormStatus] = useState("");

    // Filtrar solo talleres futuros (mañana o después)
    const talleresFuturos = talleresDisponibles.filter(t => !t.esPasado);

    // Encontrar el próximo taller disponible (con cupo)
    const proximoTallerDisponible = talleresFuturos.find(t => !t.cupoLleno) || talleresFuturos[0];

    // Estado del evento global
    const noHayTalleresFuturos = talleresFuturos.length === 0;
    const noHayCuposDisponibles = talleresFuturos.length > 0 && !talleresFuturos.some(t => !t.cupoLleno);

    const [tallerSeleccionado, setTallerSeleccionado] = useState(proximoTallerDisponible || {});

    const [referido, setReferido] = useState(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            if (params.get("pago") === "failure") setShowFailure(true);
            if (params.get("pago") === "pending") setShowPending(true);
            if (params.get("pago") === "success") setShowSuccessDialog(true);
        }
    }, []);

    useEffect(() => {
        if (typeof referidoProp !== "undefined" && referidoProp !== null) {
            setReferido(referidoProp);
        }
    }, [referidoProp]);

    useEffect(() => {
        if (noHayTalleresFuturos) {
            setIsFormDisabled(true);
            setFormStatus("EVENTO FINALIZADO");
        } else if (noHayCuposDisponibles) {
            setIsFormDisabled(true);
            setFormStatus("");
        } else {
            // Verificar el taller específico seleccionado
            if (tallerSeleccionado?.cupoLleno) {
                setIsFormDisabled(true);
                setFormStatus("CUPO LLENO");
            } else {
                setIsFormDisabled(false);
                setFormStatus("");
            }
        }
    }, [tallerSeleccionado, noHayTalleresFuturos, noHayCuposDisponibles]);

    useEffect(() => {
        // Actualizar el taller seleccionado cuando cambia el prop
        setTallerSeleccionado(proximoTallerDisponible || {});
    }, [proximoTallerDisponible]);

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
                menus: tallerSeleccionado?.menus || [],
            });
        }
        while (nuevos.length > nuevaCantidad - 1) {
            nuevos.pop();
        }
        setAcompanantes(nuevos);
    };

    // Cuando cambia el taller seleccionado, actualizo los menús de los acompañantes
    useEffect(() => {
        setAcompanantes((prev) =>
            prev.map((a) => ({
                ...a,
                menus: tallerSeleccionado?.menus || [],
            }))
        );
    }, [tallerSeleccionado]);

    const precioBase = tallerSeleccionado?.precio ?? 0;
    const precioReserva = (tallerSeleccionado?.precio ?? 0) / 2;
    const precioTarjeta = Math.round(precioBase * 1.1);
    const total =
        metodoPago === "tarjeta"
            ? precioTarjeta * cantidadPersonas
            : metodoPago === "total"
              ? precioBase * cantidadPersonas
              : Math.round((precioBase / 2) * cantidadPersonas);

    const handlePagoMercadoPago = async () => {
        if (!validarCampos()) {
            toast({
                title: "Datos incompletos",
                description: "Por favor, revisá los campos en rojo.",
                variant: "destructive",
            });
            return;
        }

        

        setIsLoadingMercadoPago(true);

        const payload = {
            tallerId: tallerSeleccionado.id,
            titulo: tallerSeleccionado.nombre,
            descripcion: `Inscripción al taller: ${tallerSeleccionado.nombre} (${cantidadPersonas} persona(s))`,
            cantidad: cantidadPersonas,
            precioUnitario: precioTarjeta,
            referido: referido,
            metodoPago,
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
                const link = `${window.location.origin}/taller/${tallerSeleccionado.id}/referido/${responseData.referido}`;
                setLinkReferido(link);
                window.location.href = responseData.mercadopago.init_point;
            } else {
                const errorMessage = responseData?.message || responseData?.mercadopago?.message || "Hubo un problema al iniciar el pago (respuesta inválida del servidor).";
                toast({
                    title: "Error al iniciar el pago",
                    description: errorMessage,
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error de red",
                description: "Ocurrió un error de red o al procesar la solicitud. Por favor, intenta de nuevo.",
                variant: "destructive",
            });
        } finally {
            setIsLoadingMercadoPago(false);
        }
    };

    const handleTransferencia = async () => {
        if (!validarCampos()) {
            toast({
                title: "Datos incompletos",
                description: "Por favor, revisá los campos en rojo.",
                variant: "destructive",
            });
            return;
        }


        setIsLoadingTransferencia(true);

        try {
            const response = await fetch('/talleres/transferencia', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name=\"csrf-token\"]').getAttribute('content'),
                },
                body: JSON.stringify({
                    tallerId: tallerSeleccionado.id,
                    nombre: datosCliente.nombre,
                    apellido: datosCliente.apellido,
                    email: datosCliente.email,
                    telefono: datosCliente.telefono,
                    cantidadPersonas,
                    esReserva: metodoPago === 'reserva',
                    menu_id: datosCliente.menu,
                    metodoPago,
                    referido: referido,
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
                })
            });

            const data = await response.json();
            if (data.success && data.referido) {
                const link = `${window.location.origin}/taller/${tallerSeleccionado.id}/referido/${data.referido}`;
                setLinkReferido(link);
                setShowSuccessDialog(true);
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Ocurrió un error al procesar la inscripción.',
                variant: 'destructive',
            });
        } finally {
            setIsLoadingTransferencia(false);
        }
    };

    const copiarLink = async () => {
        try {
            await navigator.clipboard.writeText(linkReferido);
            setCopiado(true);
            toast({
                title: "¡Link copiado!",
                description: "El link de referido ha sido copiado al portapapeles.",
            });
            setTimeout(() => setCopiado(false), 2000);
        } catch (err) {
            toast({
                title: "Error al copiar",
                description: "No se pudo copiar el link. Por favor, cópialo manualmente.",
                variant: "destructive",
            });
        }
    };

    const validarCampos = () => {
        const nuevosErrores = {};

        // Validar datos del titular
        if (!datosCliente.nombre) nuevosErrores.nombre = "El nombre es obligatorio";
        if (!datosCliente.apellido) nuevosErrores.apellido = "El apellido es obligatorio";
        if (!datosCliente.email) nuevosErrores.email = "El email es obligatorio";
        if (!datosCliente.menu) nuevosErrores.menu = "Selecciona un menú";

        // Validar datos de los acompañantes
        acompanantes.forEach((a, i) => {
            if (!a.nombre) nuevosErrores[`acompanante_nombre_${i}`] = "El nombre es obligatorio";
            if (!a.apellido) nuevosErrores[`acompanante_apellido_${i}`] = "El apellido es obligatorio";
            if (!a.menu) nuevosErrores[`acompanante_menu_${i}`] = "Selecciona un menú";
        });

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    // Función para formatear la fecha con día de la semana
    const formatFecha = (fecha) => {
        const d = dayjs(fecha);
        const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        return `${dias[d.day()]} ${d.format('DD-MM-YYYY')}`;
    };

    // Función para generar el texto de la opción de taller
    const getTallerOptionText = (t) => {
        const fechaFormateada = formatFecha(t.fecha);
        let status = '';
        if (t.cupoLleno) {
            status = ' (Sin cupo)';
        }
        return `${fechaFormateada}${status}`;
    };

    const pageTitle = subcategoria?.nombre ?? 'Inscripción a Taller';

    return (
        <>
            <Head title={pageTitle} />
            <div className="max-w-7xl mx-auto px-4 py-8 pt-24 md:pt-28">
                <Breadcrumbs items={breadcrumbItems} />
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
                        {subcategoria?.nombre.toUpperCase() ?? 'Taller'} - Inscripción
                        {noHayCuposDisponibles && <span className="text-red-500"> (CUPO LLENO)</span>}
                        {noHayTalleresFuturos && <span className="text-red-500"> (EVENTO FINALIZADO)</span>}
                    </h1>
                    
                    {/* Selector de taller por fecha */}
                    {talleresFuturos.length > 1 && (
                        <div className="mb-6">
                            <Label className="text-lg">Elegí la fecha del taller:</Label>
                            <Select
                                value={tallerSeleccionado?.id || ''}
                                onValueChange={(value) => {
                                    const nuevo = talleresFuturos.find(t => t.id === parseInt(value));
                                    if (nuevo) setTallerSeleccionado(nuevo);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccioná una fecha" />
                                </SelectTrigger>
                                <SelectContent>
                                    {talleresFuturos.map((t) => (
                                        <SelectItem 
                                            key={t.id} 
                                            value={t.id} 
                                            disabled={t.cupoLleno}
                                        >
                                            {getTallerOptionText(t)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {isFormDisabled && (
                                <p className="text-center text-red-500 font-bold text-xl py-4 bg-red-100 rounded-md">
                                    {formStatus}
                                </p>
                            )}
                        </div>
                    )}

                    <div className={`space-y-6 ${isFormDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
                        <p className="text-gray-600 text-center text-base ">
                            <Calendar className="w-5 h-5 text-black inline" />{" "}
                            <strong>{tallerSeleccionado?.fecha ? formatFecha(tallerSeleccionado.fecha) : 'Fecha por confirmar'}</strong> |{" "}
                            <Clock className="w-5 h-5 text-black inline" />{" "}
                            <strong>
                                {tallerSeleccionado?.hora ?? '--:--'}
                                {tallerSeleccionado?.horaFin ? ` - ${tallerSeleccionado.horaFin}` : ''}
                            </strong>{" "}
                            | <MapPin className="w-5 h-5 inline text-black" />{" "}
                            <strong>{tallerSeleccionado?.ubicacion ?? 'Ubicación por confirmar'}</strong>
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
                                <div className="flex items-center gap-2">
                                    <Label>Cantidad de personas (incluyéndote):</Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <HelpCircle className="h-4 w-4 text-gray-500" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Indica el número total de personas que deseas inscribir y efectuar el pago. En caso de que quieras realizar el pago por separado, podés hacerlo compartiendo con tu acompañante el link de referido que te daremos luego que te inscribas.</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
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
                                        className={`h-12 ${errores.nombre ? 'border-red-500' : ''}`}
                                        value={datosCliente.nombre}
                                        onChange={(e) =>
                                            setDatosCliente({
                                                ...datosCliente,
                                                nombre: e.target.value,
                                            })
                                        }
                                    />
                                    {errores.nombre && <p className="text-red-500 text-sm">{errores.nombre}</p>}
                                    <Input
                                        className={`h-12 ${errores.apellido ? 'border-red-500' : ''}`}
                                        placeholder="Apellido"
                                        value={datosCliente.apellido}
                                        onChange={(e) =>
                                            setDatosCliente({
                                                ...datosCliente,
                                                apellido: e.target.value,
                                            })
                                        }
                                    />
                                    {errores.apellido && <p className="text-red-500 text-sm">{errores.apellido}</p>}
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Label>Email:</Label>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <HelpCircle className="h-4 w-4 text-gray-500" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Recibirás la confirmación y los detalles del taller en este email.</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <Input
                                            className={`h-12 ${errores.email ? 'border-red-500' : ''}`}
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
                                    </div>
                                    {errores.email && <p className="text-red-500 text-sm">{errores.email}</p>}
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Label>Teléfono:</Label>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <HelpCircle className="h-4 w-4 text-gray-500" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Nos comunicaremos por este medio en situaciones que requieran una conversación dinámica.</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <Input
                                            className="h-12"
                                            placeholder="Teléfono (opcional)"
                                            type="tel"
                                            value={datosCliente.telefono}
                                            onChange={(e) =>
                                                setDatosCliente({
                                                    ...datosCliente,
                                                    telefono: e.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="space-y-4 mt-4 mx-auto w-full">
                                        <Label className="text-lg">Elegí tu menú:</Label>
                                        <div className="grid sm:grid-cols-2 md:grid-cols-3  gap-4 mt-2 ">
                                            {tallerSeleccionado.menus.map((menu) => (
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
                                            className={`h-12 ${errores[`acompanante_nombre_${i}`] ? 'border-red-500' : ''}`}
                                            placeholder="Nombre"
                                            value={a.nombre}
                                            onChange={(e) => {
                                                const nuevos = [...acompanantes];
                                                nuevos[i].nombre = e.target.value;
                                                setAcompanantes(nuevos);
                                            }}
                                        />
                                        {errores[`acompanante_nombre_${i}`] && <p className="text-red-500 text-sm">{errores[`acompanante_nombre_${i}`]}</p>}
                                        
                                        <Input
                                            className={`h-12 ${errores[`acompanante_apellido_${i}`] ? 'border-red-500' : ''}`}
                                            placeholder="Apellido"
                                            value={a.apellido}
                                            onChange={(e) => {
                                                const nuevos = [...acompanantes];
                                                nuevos[i].apellido = e.target.value;
                                                setAcompanantes(nuevos);
                                            }}
                                        />
                                        {errores[`acompanante_apellido_${i}`] && <p className="text-red-500 text-sm">{errores[`acompanante_apellido_${i}`]}</p>}
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Label>Email del acompañante:</Label>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <HelpCircle className="h-4 w-4 text-gray-500" />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>El email del acompañante se utilizará para enviar información específica sobre el taller y recordatorios.</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                            <Input
                                                className={`h-12 ${errores[`acompanante_email_${i}`] ? 'border-red-500' : ''}`}
                                                placeholder="Email"
                                                type="email"
                                                value={a.email}
                                                onChange={(e) => {
                                                    const nuevos = [...acompanantes];
                                                    nuevos[i].email = e.target.value;
                                                    setAcompanantes(nuevos);
                                                }}
                                            />
                                        </div>
                                        {errores[`acompanante_email_${i}`] && <p className="text-red-500 text-sm">{errores[`acompanante_email_${i}`]}</p>}
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Label>Teléfono:</Label>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <HelpCircle className="h-4 w-4 text-gray-500" />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Nos comunicaremos por este medio en situaciones que requieran una conversación dinámica.</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                            <Input
                                                className="h-12"
                                                placeholder="Teléfono (opcional)"
                                                type="tel"
                                                value={a.telefono}
                                                onChange={(e) => {
                                                    const nuevos = [...acompanantes];
                                                    nuevos[i].telefono = e.target.value;
                                                    setAcompanantes(nuevos);
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-4 mt-4 mx-auto w-full">
                                            <Label className="text-lg">Elegí tu menú:</Label>
                                            <div className="grid sm:grid-cols-2 md:grid-cols-3  gap-4 mt-2 ">
                                                {(a.menus || []).map((menu) => (
                                                    <div
                                                        key={menu.id}
                                                        className="prose"
                                                    >
                                                        <CardMenu
                                                            menu={menu}
                                                            seleccionado={a.menu === String(menu.id)}
                                                            onSelect={(id) => {
                                                                const nuevos = [...acompanantes];
                                                                nuevos[i].menu = String(id);
                                                                setAcompanantes(nuevos);
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            {errores[`acompanante_menu_${i}`] && <p className="text-red-500 text-sm">{errores[`acompanante_menu_${i}`]}</p>}
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
                                        Reserva con transferencia (${((precioBase / 2) * cantidadPersonas).toLocaleString("es-AR")})
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
                                    Comparte este link con tus amigos para que se inscriban contigo. <br></br>
                                    *Opción para pagar por separado.
                                </p>
                            </div>

                            <Button
                                className="w-full bg-green-600 hover:bg-green-700 mt-4"
                                onClick={() => window.location.href = '/talleres'}
                            >
                                Volver a Talleres
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}
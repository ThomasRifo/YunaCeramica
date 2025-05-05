import { useState } from "react";
import { Head } from "@inertiajs/react";
import {
    Banknote,
    Calendar,
    Clock,
    CreditCard,
    DollarSign,
    Landmark,
    MapPin,
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
dayjs.extend(customParseFormat);

export default function FormInscripcion({ taller }) {
    const [cantidadPersonas, setCantidadPersonas] = useState(1);
    const [metodoPago, setMetodoPago] = useState("reserva");
    const [datosCliente, setDatosCliente] = useState({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        menu: "",
    });

    const [acompanantes, setAcompanantes] = useState([]);

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
                    <Banknote className="w-10 h-10 text-green-600 mb-2" />
                    <h3 className="font-semibold text-gray-700 text-xl mb-1">
                        Reserva
                    </h3>
                    <p className="text-gray-800 text-base">
                        <strong className="font-extrabold text-lg">
                            ${precioReserva.toLocaleString("es-AR")}
                        </strong>{" "}
                        por persona (solo transferencia)
                    </p>
                </div>

                {/* Transferencia total */}
                <div className="bg-gray-300 rounded-xl p-4 shadow flex flex-col items-center text-center">
                    <Landmark className="w-10 h-10 text-blue-600 mb-2" />
                    <h3 className="font-semibold text-gray-700 text-xl mb-1">
                        Transferencia
                    </h3>
                    <p className="text-gray-800 text-base">
                        <strong className="font-extrabold text-lg">
                            ${precioBase.toLocaleString("es-AR")}
                        </strong>{" "}
                        por persona (total)
                    </p>
                </div>

                {/* Tarjeta */}
                <div className="bg-gray-300 rounded-xl p-4 shadow flex flex-col items-center text-center">
                    <CreditCard className="w-10 h-10 text-purple-600 mb-2" />
                    <h3 className="font-semibold text-gray-700 mb-1 text-xl">
                        Tarjeta
                    </h3>
                    <p className="text-gray-800 text-base">
                        <strong className="font-extrabold text-lg">
                            ${precioTarjeta.toLocaleString("es-AR")}
                        </strong>{" "}
                        por persona
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
                            value={datosCliente.telefono}
                            onChange={(e) =>
                                setDatosCliente({
                                    ...datosCliente,
                                    telefono: e.target.value,
                                })
                            }
                        />

                        <Select
                            value={datosCliente.menu}
                            onValueChange={(value) =>
                                setDatosCliente({
                                    ...datosCliente,
                                    menu: value,
                                })
                            }
                        >
                            <SelectTrigger className="h-12">
                                <SelectValue placeholder="Seleccioná un menú" />
                            </SelectTrigger>
                            <SelectContent>
                                {taller.menus.map((menu) => (
                                    <SelectItem key={menu.id} value={menu.id}>
                                        {menu.nombre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
                                value={a.telefono}
                                onChange={(e) => {
                                    const nuevos = [...acompanantes];
                                    nuevos[i].telefono = e.target.value;
                                    setAcompanantes(nuevos);
                                }}
                            />
                            <Select
                                value={a.menu}
                                onValueChange={(value) => {
                                    const nuevos = [...acompanantes];
                                    nuevos[i].menu = value;
                                    setAcompanantes(nuevos);
                                }}
                            >
                                <SelectTrigger className="h-12">
                                    <SelectValue placeholder="Seleccioná un menú" />
                                </SelectTrigger>
                                <SelectContent>
                                    {taller.menus.map((menu) => (
                                        <SelectItem
                                            key={menu.id}
                                            value={menu.id}
                                        >
                                            {menu.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                ))}

                <div className="mt-8 space-y-2">
                    <Label>Método de pago:</Label>
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
                            Total con tarjeta ($
                            {(precioTarjeta * cantidadPersonas).toLocaleString("es-AR")})
                        </Button>
                    </div>
                </div>

                <p className="mt-4 text-lg">
                    Total a pagar: <strong>${total.toLocaleString("es-AR")}</strong>
                </p>

                {metodoPago === "tarjeta" ? (
                    <Button className="w-full mt-4 px-6 h-14">
                        Pagar con tarjeta
                    </Button>
                ) : (
                    <a
                        href={`https://wa.me/5492994160728?text=${encodeURIComponent(
                            `Hola! Quiero reservar para el taller "${taller.nombre}", somos ${cantidadPersonas} personas.`,
                        )}`}
                        className="w-full mt-4 bg-green-500 text-white  px-6 rounded-lg text-center py-4 block h-14"
                    >
                        Datos para abonar (WhatsApp)
                    </a>
                )}
            </div>
        </div>
    );
}

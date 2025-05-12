import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { cn } from "@/lib/utils";
import { Transition } from '@headlessui/react';

export default function Perfil({ auth, user, talleres, compras }) {
    const [activeSection, setActiveSection] = useState('perfil');
    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
        name: user.name,
        apellido: user.apellido,
        email: user.email,
        calle: user.calle || '',
        numero: user.numero || '',
        ciudad: user.ciudad || '',
        provincia: user.provincia || '',
        codigo_postal: user.codigo_postal || '',
    });

    const { data: passwordData, setData: setPasswordData, put: updatePassword, processing: passwordProcessing, errors: passwordErrors, reset: resetPassword, recentlySuccessful: passwordRecentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('profile.update'), {
            preserveScroll: true,
            onSuccess: () => {
                // Los datos se actualizarán automáticamente gracias a Inertia
            },
        });
    };

    const handlePasswordUpdate = (e) => {
        e.preventDefault();
        updatePassword(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => resetPassword(),
            onError: (errors) => {
                if (errors.password) {
                    resetPassword('password', 'password_confirmation');
                }
                if (errors.current_password) {
                    resetPassword('current_password');
                }
            },
        });
    };

    const sections = [
        { id: 'perfil', label: 'Mi Perfil' },
        { id: 'talleres', label: 'Mis Talleres' },
        { id: 'compras', label: 'Mis Compras' },
        { id: 'seguridad', label: 'Seguridad' },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="pt-24 font-semibold text-xl text-gray-800 leading-tight">Mi Cuenta</h2>}
        >
            <Head title="Mi Cuenta" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex gap-6">
                        {/* Sidebar */}
                        <div className="w-64 flex-shrink-0">
                            <Card className="p-4">
                                <nav className="space-y-2">
                                    {sections.map((section) => (
                                        <button
                                            key={section.id}
                                            onClick={() => setActiveSection(section.id)}
                                            className={cn(
                                                "w-full text-left px-4 py-2 rounded-lg transition-colors",
                                                activeSection === section.id
                                                    ? "bg-primary text-primary-foreground"
                                                    : "hover:bg-muted"
                                            )}
                                        >
                                            {section.label}
                                        </button>
                                    ))}
                                </nav>
                            </Card>
                        </div>

                        {/* Contenido principal */}
                        <div className="flex-1">
                            <Card className="p-6">
                                {activeSection === 'perfil' && (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Nombre</Label>
                                                <Input
                                                    id="name"
                                                    value={data.name}
                                                    onChange={e => setData('name', e.target.value)}
                                                />
                                                {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="apellido">Apellido</Label>
                                                <Input
                                                    id="apellido"
                                                    value={data.apellido}
                                                    onChange={e => setData('apellido', e.target.value)}
                                                />
                                                {errors.apellido && <div className="text-red-500 text-sm">{errors.apellido}</div>}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={e => setData('email', e.target.value)}
                                            />
                                            {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="calle">Calle</Label>
                                                <Input
                                                    id="calle"
                                                    value={data.calle}
                                                    onChange={e => setData('calle', e.target.value)}
                                                />
                                                {errors.calle && <div className="text-red-500 text-sm">{errors.calle}</div>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="numero">Número</Label>
                                                <Input
                                                    id="numero"
                                                    value={data.numero}
                                                    onChange={e => setData('numero', e.target.value)}
                                                />
                                                {errors.numero && <div className="text-red-500 text-sm">{errors.numero}</div>}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="ciudad">Ciudad</Label>
                                                <Input
                                                    id="ciudad"
                                                    value={data.ciudad}
                                                    onChange={e => setData('ciudad', e.target.value)}
                                                />
                                                {errors.ciudad && <div className="text-red-500 text-sm">{errors.ciudad}</div>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="provincia">Provincia</Label>
                                                <Input
                                                    id="provincia"
                                                    value={data.provincia}
                                                    onChange={e => setData('provincia', e.target.value)}
                                                />
                                                {errors.provincia && <div className="text-red-500 text-sm">{errors.provincia}</div>}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="codigo_postal">Código Postal</Label>
                                            <Input
                                                id="codigo_postal"
                                                value={data.codigo_postal}
                                                onChange={e => setData('codigo_postal', e.target.value)}
                                            />
                                            {errors.codigo_postal && <div className="text-red-500 text-sm">{errors.codigo_postal}</div>}
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <Button type="submit" disabled={processing}>
                                                Guardar cambios
                                            </Button>

                                            <Transition
                                                show={recentlySuccessful}
                                                enter="transition ease-in-out"
                                                enterFrom="opacity-0"
                                                leave="transition ease-in-out"
                                                leaveTo="opacity-0"
                                            >
                                                <p className="text-sm text-green-600">
                                                    Guardado.
                                                </p>
                                            </Transition>
                                        </div>
                                    </form>
                                )}

                                {activeSection === 'seguridad' && (
                                    <form onSubmit={handlePasswordUpdate} className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-medium">Cambiar Contraseña</h3>
                                            <p className="mt-1 text-sm text-gray-600">
                                                Asegúrate de usar una contraseña larga y segura.
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="current_password">Contraseña Actual</Label>
                                            <Input
                                                id="current_password"
                                                type="password"
                                                value={passwordData.current_password}
                                                onChange={e => setPasswordData('current_password', e.target.value)}
                                            />
                                            {passwordErrors.current_password && (
                                                <div className="text-red-500 text-sm">{passwordErrors.current_password}</div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password">Nueva Contraseña</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={passwordData.password}
                                                onChange={e => setPasswordData('password', e.target.value)}
                                            />
                                            {passwordErrors.password && (
                                                <div className="text-red-500 text-sm">{passwordErrors.password}</div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password_confirmation">Confirmar Nueva Contraseña</Label>
                                            <Input
                                                id="password_confirmation"
                                                type="password"
                                                value={passwordData.password_confirmation}
                                                onChange={e => setPasswordData('password_confirmation', e.target.value)}
                                            />
                                            {passwordErrors.password_confirmation && (
                                                <div className="text-red-500 text-sm">{passwordErrors.password_confirmation}</div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <Button type="submit" disabled={passwordProcessing}>
                                                Actualizar Contraseña
                                            </Button>

                                            <Transition
                                                show={passwordRecentlySuccessful}
                                                enter="transition ease-in-out"
                                                enterFrom="opacity-0"
                                                leave="transition ease-in-out"
                                                leaveTo="opacity-0"
                                            >
                                                <p className="text-sm text-green-600">
                                                    Contraseña actualizada.
                                                </p>
                                            </Transition>
                                        </div>
                                    </form>
                                )}

                                {activeSection === 'talleres' && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Mis Talleres</h3>
                                        {talleres && talleres.length > 0 ? (
                                            <div className="grid gap-4">
                                                {talleres.map((taller) => (
                                                    <Card key={taller.id} className="p-4">
                                                        <h4 className="font-medium">{taller.taller.nombre}</h4>
                                                        <p className="text-sm text-gray-500">
                                                            Fecha: {new Date(taller.fecha).toLocaleDateString()}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            Estado: {taller.estadoPago?.nombre || 'Pendiente'}
                                                        </p>
                                                    </Card>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500">No tienes talleres registrados.</p>
                                        )}
                                    </div>
                                )}

                                {activeSection === 'compras' && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Mis Compras</h3>
                                        {compras && compras.length > 0 ? (
                                            <div className="grid gap-4">
                                                {compras.map((compra) => (
                                                    <Card key={compra.id} className="p-4">
                                                        <h4 className="font-medium">Compra #{compra.id}</h4>
                                                        <p className="text-sm text-gray-500">
                                                            Fecha: {new Date(compra.created_at).toLocaleDateString()}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            Total: ${compra.total}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            Estado: {compra.estado?.nombre || 'Pendiente'}
                                                        </p>
                                                    </Card>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500">No tienes compras registradas.</p>
                                        )}
                                    </div>
                                )}
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
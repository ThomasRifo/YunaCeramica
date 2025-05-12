import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import Alert from '@mui/material/Alert';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;
    const { props } = usePage();

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            apellido: user.apellido,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium ">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm ">
                    Update your account's profile information and email address.
                </p>
            </header>



            <form onSubmit={submit} noValidate className="mt-6 space-y-6 ">
                <div>
                    <InputLabel htmlFor="name" value="Name"/>

                    <TextInput
                        id="name"
                        className="mt-1 block w-full text-black "
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="apellido" value="Apellido"/>

                    <TextInput
                        id="apellido"
                        className="mt-1 block w-full text-black "
                        value={data.apellido}
                        onChange={(e) => setData('apellido', e.target.value)}
                        required
                        autoComplete="apellido"
                    />

                    <InputError className="mt-2" message={errors.apellido} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full text-black"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                {status === 'success' && (
                <Alert variant="filled" severity="success">
                    ¡Perfil actualizado correctamente!
                </Alert>
            )}

            {/* Mensaje de error general (por ejemplo otro error que quieras mostrar) */}
            {props.errors && Object.keys(props.errors).length > 0 && (
                <Alert variant="filled" severity="error">
                    Por favor, corregí los errores e intentá de nuevo.
                </Alert>
            )}

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm ">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm  underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm ">
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}

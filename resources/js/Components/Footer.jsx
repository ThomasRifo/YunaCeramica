import { Link } from '@inertiajs/react';
import { Facebook, Instagram, Landmark, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useState, useCallback, memo, lazy, Suspense } from 'react';
import axios from 'axios';

// Lazy load del toast
const ToastProvider = lazy(() => import('@/hooks/use-toast').then(mod => ({ 
  default: mod.ToastProvider 
})));

const Footer = memo(function Footer() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    // Cargar el toast de manera lazy
    useState(() => {
        import('@/hooks/use-toast').then(({ useToast }) => {
            const { toast } = useToast();
            setToast(toast);
        });
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!email.trim()) return;
        
        setLoading(true);
        try {
            const token = await window.grecaptcha.execute(recaptchaV3Key, { action: "newsletter" });
            const response = await axios.post('/newsletter/subscribe', { email });
            if (toast) {
                toast({
                    title: "¡Suscripción exitosa!",
                    description: response.data.message,
                    variant: "default",
                });
            }
            setEmail('');
        } catch (error) {
            if (toast) {
                toast({
                    title: "Error",
                    description: error.response?.data?.message || 'Hubo un error al suscribirte. Por favor, intenta nuevamente.',
                    variant: "destructive",
                });
            }
        } finally {
            setLoading(false);
        }
    }, [email, toast]);

    const handleEmailChange = useCallback((e) => {
        setEmail(e.target.value);
    }, []);

    return (
        <Suspense fallback={<div className="h-32 bg-black/85" />}>
            <footer className="bg-black/85 text-white pt-16 pb-0">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4">Información</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-6 h-6" />
                                    <span>Cipolletti, Río Negro, Argentina</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="w-6 h-6" />
                                    <span>yunaceramica@gmail.com</span>
                                </div>
                                
                                <div className="flex gap-4 mb-6">
                                    <a 
                                        href="https://instagram.com/yunaceramica" 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="hover:text-gray-300 transition"
                                        aria-label="Síguenos en Instagram"
                                    >
                                        <Instagram className="inline w-6 h-6 mr-2" />
                                        <span className='text-white inline'>Yuna Cerámica</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold mb-4">Enlaces Rápidos</h3>
                            <ul className="space-y-2">
                                {[
                                    { href: '/talleres', text: 'Talleres' },
                                    { href: '/productos', text: 'Productos' },
                                    { href: '/login', text: 'Login' },
                                    { href: '/contacto', text: 'Contacto' }
                                ].map((link) => (
                                    <li key={link.href}>
                                        <Link 
                                            href={link.href} 
                                            className="hover:text-gray-300 transition"
                                        >
                                            {link.text}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold mb-4">Newsletter</h3>
                            <p className="text-gray-300 mb-4">Suscríbite para recibir información sobre nuevos talleres</p>
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <input
                                    type="text"
                                    name="website"
                                    style={{ display: "none" }}
                                    tabIndex={-1}
                                    autoComplete="off"
                                    aria-hidden="true"
                                />
                                <div className="flex gap-1">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={handleEmailChange}
                                        placeholder="Tu correo electrónico"
                                        className="flex-1 px-4 py-2 rounded-lg bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
                                        required
                                        disabled={loading}
                                        aria-label="Correo electrónico para newsletter"
                                    />
                                    <button
                                        type="submit"
                                        className={`bg-white text-black px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                                            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'
                                        }`}
                                        disabled={loading}
                                        aria-label="Suscribirse al newsletter"
                                    >
                                        <Send className={`w-5 h-5 ${loading ? 'animate-pulse' : ''}`} />
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="ml-6">
                            <h3 className="text-xl font-bold mb-4">Métodos de Pago</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <img 
                                        src="/storage/uploads/MercadoPago_horizontal.webp" 
                                        alt="Mercado Pago" 
                                        className="h-8"
                                        loading="lazy"
                                        width="120"
                                        height="32"
                                    />
                                    <Landmark className="w-8 h-8 text-customGray mb-2" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-xs text-gray-400 mt-8 text-center">
                    Este sitio está protegido por reCAPTCHA y se aplican la&nbsp;
                    <a 
                        href="https://policies.google.com/privacy" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="underline"
                    >
                        Política de privacidad
                    </a>
                    &nbsp;y los&nbsp;
                    <a 
                        href="https://policies.google.com/terms" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="underline"
                    >
                        Términos de servicio
                    </a>
                    &nbsp;de Google.
                </div>
                <div className="border-t bg-black border-gray-800 mt-0 py-5 text-center">
                    <p className='md:inline'>&copy; {new Date().getFullYear()} Yuna Cerámica.</p> 
                    <p className='inline'>Todos los derechos reservados.</p>
                </div>
            </footer>
        </Suspense>
    );
});

export default Footer; 
import { Link } from '@inertiajs/react';
import { Facebook, Instagram, Landmark, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import { useToast } from "@/hooks/use-toast";

export default function Footer() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('/newsletter/subscribe', { email });
            toast({
                title: "¡Suscripción exitosa!",
                description: response.data.message,
                variant: "default",
            });
            setEmail('');
        } catch (error) {
            toast({
                title: "Error",
                description: error.response?.data?.message || 'Hubo un error al suscribirte. Por favor, intenta nuevamente.',
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
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
                            <a href="https://instagram.com/yunaceramica" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition">
                                <Instagram className="inline w-6 h-6 mr-2" />
                                <span className='text-white inline'>Yuna Cerámica</span>
                            </a>
                            {/*<a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition">
                                <Facebook className="w-6 h-6" />
                            </a>*/}
                        </div>
                        </div>
                    </div>

                    
                    <div>
                        <h3 className="text-xl font-bold mb-4">Enlaces Rápidos</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/talleres" className="hover:text-gray-300 transition">
                                    Talleres
                                </Link>
                            </li>
                            <li>
                                <Link href="/productos" className="hover:text-gray-300 transition">
                                    Productos
                                </Link>
                            </li>
                            <li>
                                <Link href="/login" className="hover:text-gray-300 transition">
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link href="/contacto" className="hover:text-gray-300 transition">
                                    Contacto
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter para recibir información sobre nuevos talleres */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Newsletter</h3>
                        <p className="text-gray-300 mb-4">Suscríbite para recibir información sobre nuevos talleres</p>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            {/* Honeypot para evitar spam */}
                            <input
                                type="text"
                                name="website"
                                style={{ display: "none" }}
                                tabIndex={-1}
                                autoComplete="off"
                            />
                            <div className="flex gap-1">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Tu correo electrónico"
                                    className="flex-1 px-4 py-2 rounded-lg bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="submit"
                                    className={`bg-white text-black px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                                        loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'
                                    }`}
                                    disabled={loading}
                                >
                                    <Send className={`w-5 h-5 ${loading ? 'animate-pulse' : ''}`} />
                                </button>
                            </div>
                        </form>
                    </div>

                    
                    <div className="ml-6">
                        

                        <h3 className="text-xl font-bold mb-4 ">Métodos de Pago</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <img src="/storage/uploads/MercadoPago_(horizontal).webp" alt="Mercado Pago" className="h-8" />
                                <Landmark className="w-8 h-8 text-customGray mb-2" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                
            </div>
            <div className="text-xs text-gray-400 mt-8 text-center">
                Este sitio está protegido por reCAPTCHA y se aplican la&nbsp;
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">
                    Política de privacidad
                </a>
                &nbsp;y los&nbsp;
                <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline">
                    Términos de servicio
                </a>
                &nbsp;de Google.
            </div>
            <div className="border-t bg-black border-gray-800  mt-0 py-5 text-center">
                    <p className='md:inline'>&copy; {new Date().getFullYear()} Yuna Cerámica.</p> <p className='inline'>Todos los derechos reservados.</p>
                </div>

        </footer>
    );
} 
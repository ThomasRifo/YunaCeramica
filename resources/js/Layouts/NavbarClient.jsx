import { useEffect, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import { Menu } from "lucide-react";
import Dropdown from "@/Components/Dropdown";

export default function NavbarClient({ children }) {
    const [scrolled, setScrolled] = useState(false);
    const { url } = usePage();
    const [menuOpen, setMenuOpen] = useState(false);
    const isTalleres =
        url.startsWith("/talleres") || url.startsWith("/talleres-");
    const user = usePage().props.auth.user;

    const inherit = ["/talleres", "/productos", "/"].includes(url);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 0);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isGray = scrolled || !inherit;

    return (
        <>
            <header
                className={cn(
                    "fixed w-full z-50 transition-all duration-300",
                    isGray ? "bg-customGray shadow-sm" : "bg-inherit",
                )}
            >
                <nav
                    className={cn(
                        'flex justify-between px-12 max-w-screen transition-colors duration-300 font-["Helvetica Neue", Arial, sans-serif]',
                        "text-white",
                    )}
                    style={{
                        fontFamily: '"Helvetica Neue", Arial, sans-serif',
                    }}
                >
                    <Link href="/" className="py-4">
                        <img
                            src="../../../../storage/uploads/yunalogowhite.webp"
                            className="object-contain max-h-12 sm:max-h-20 md:max-h-16"
                            alt="Yuna Cerámica"
                        />
                    </Link>

                    <div className="text-base hidden md:flex place-items-center gap-14 py-4 px-4">
                        <Link href="/">Home</Link>
                        <Link
                            className={cn(
                                "relative transition-all duration-300 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:origin-center after:scale-x-0 after:bg-white after:transition-transform after:duration-300",
                                route().current("productos") &&
                                    "after:scale-x-100",
                            )}
                            href="/productos"
                        >
                            Productos
                        </Link>
                        <Link
                            className={cn(
                                "relative transition-all duration-300 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:origin-center after:scale-x-0 after:bg-white after:transition-transform after:duration-300",
                                isTalleres && "after:scale-x-100",
                            )}
                            href="/talleres"
                        >
                            Talleres
                        </Link>
                        <Link href="/contacto">Contacto</Link>
                        {!user ? (
                            <Link 
                                className={cn(
                                    "relative transition-all duration-300 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:origin-center after:scale-x-0 after:bg-white after:transition-transform after:duration-300",
                                    route().current("login") && "after:scale-x-100"
                                )}
                                href="/login"
                            >
                                Iniciar sesión
                            </Link>
                        ) : (
                          <>
                              <Dropdown>
                               <Dropdown.Trigger>
                               <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-hiden hover:text-gray-300 focus:outline-none transition ease-in-out duration-150">
                                        {user.name}
                                        <svg
                                            className="ms-2 -me-0.5 h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content>
                            <Dropdown.Link
                                className={cn(
                                    "relative transition-all duration-300 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:origin-center after:scale-x-0 after:bg-white after:transition-transform after:duration-300",
                                    route().current("logout") && "after:scale-x-100"
                                )}
                                href={route("profile.show")}
                            >
                                Perfil
                            </Dropdown.Link>
                            <Dropdown.Link 
                            href={route('logout')} 
                            method="post" 
                            as="button"
                            className={cn(
                                "relative transition-all duration-300 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:origin-center after:scale-x-0 after:bg-white after:transition-transform after:duration-300",
                                route().current("logout") && "after:scale-x-100"
                            )}
                            >
                                Cerrar sesión
                            </Dropdown.Link>
                        </Dropdown.Content>
                        </Dropdown>
                        </>
                        )}
                    </div>

                    {/* Mobile Menu Icon */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        <Menu size={28} />
                    </button>
                </nav>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden bg-customGray text-white flex flex-col px-4 py-4 space-y-4 text-lg">
                        <Link href="/" onClick={() => setMenuOpen(false)}>
                            Home
                        </Link>
                        <Link href="/productos" onClick={() => setMenuOpen(false)}>
                            Productos
                        </Link>
                        <Link href="/talleres" onClick={() => setMenuOpen(false)}>
                            Talleres
                        </Link>
                        <Link href="/contacto" onClick={() => setMenuOpen(false)}>
                            Contacto
                        </Link>
                        {!user ? (
                            <Link href="/login" onClick={() => setMenuOpen(false)}>
                                Iniciar sesión
                            </Link>
                        ) : (
                            <>
                                <Link href={route("profile.show")} onClick={() => setMenuOpen(false)}>
                                    Mi Perfil
                                </Link>
                                <Link 
                                method="post"
                                as="button"
                                    href={route('logout')} 
                                   
                                    
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Cerrar sesión
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </header>

            <div>{children}</div>
        </>
    );
}

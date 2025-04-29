import { useEffect, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function NavbarClient({ children }) {
  const [scrolled, setScrolled] = useState(false);
  const { url } = usePage(); // <-- 🚀 Capturamos la URL de Inertia dinámicamente
  const [menuOpen, setMenuOpen] = useState(false);
const isTalleres = url.startsWith('/talleres') || url.startsWith('/talleres-');


  const shouldStartGray = ['/talleres-ceramica-y-gin', '/talleres-ceramica-y-cafe', '/talleres-ceramica-y-cafe#ubicacion','/talleres-ceramica-y-gin#ubicacion' ].includes(url);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isGray = scrolled || shouldStartGray; // 🚀 Si scrolleaste o si debería empezar gris

  return (
    <>
      <header
        className={cn(
          "fixed w-full z-50 transition-all duration-300",
          isGray ? "bg-customGray shadow-sm" : "bg-inherit"
        )}
      >
        <nav
          className={cn(
            "flex justify-between px-12 max-w-screen transition-colors duration-300 font-[\"Helvetica Neue\", Arial, sans-serif]",
            "text-white"
          )}
          style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
        >
          <Link href="/" className="py-4">
            <img
              src="../../../../storage/imagenesFijas/yunalogowhite.png"
              className="object-contain max-h-12 sm:max-h-20 md:max-h-16"
              alt="Yuna Cerámica"
            />
          </Link>

          <div className="text-base hidden md:flex place-items-center gap-14 py-4 px-4">
            <Link href="/">Home</Link>
            <Link
              className={cn(
                "relative transition-all duration-300 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:origin-center after:scale-x-0 after:bg-white after:transition-transform after:duration-300",
                route().current('productos') && "after:scale-x-100"
              )}
              href="/productos"
            >
              Productos
            </Link>
            <Link
  className={cn(
    "relative transition-all duration-300 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:origin-center after:scale-x-0 after:bg-white after:transition-transform after:duration-300",
    isTalleres && "after:scale-x-100"
  )}
  href="/talleres"
>
              Talleres
            </Link>
            <Link href="/contacto">Contacto</Link>
            <Link href="/login">Iniciar sesión</Link>
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
            <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/productos" onClick={() => setMenuOpen(false)}>Productos</Link>
            <Link href="/talleres" onClick={() => setMenuOpen(false)}>Talleres</Link>
            <Link href="/contacto" onClick={() => setMenuOpen(false)}>Contacto</Link>
            <Link href="/login" onClick={() => setMenuOpen(false)}>Iniciar sesión</Link>
          </div>
        )}
      </header>

      <div>
        {children}
      </div>
    </>
  );
}

import { useState, useEffect } from 'react';
import { AspectRatio } from "@/Components/ui/aspect-ratio";

export default function OptimizedImage({ 
    optimizedUrls, 
    aspectRatio = 1.4/1.5, 
    className = "",
    alt = "Imagen optimizada",
    fallbackSrc = null
}) {
    
    // Función para elegir la imagen optimizada según el ancho de pantalla
    const getImageSrc = () => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth <= 768) {
                return optimizedUrls?.mobile;
            } else if (window.innerWidth <= 1024) {
                return optimizedUrls?.desktop;
            } else {
                return optimizedUrls?.large;
            }
        }
        // SSR fallback: usar desktop por defecto
        return optimizedUrls?.desktop;
    };

    // Inicializar el src optimizado en el primer render
    const [currentSrc, setCurrentSrc] = useState(getImageSrc());
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [useFallback, setUseFallback] = useState(false);

    useEffect(() => {
        setIsError(false);
        setIsLoading(true);
        setUseFallback(false);
        setCurrentSrc(getImageSrc());
        // Escuchar cambios de tamaño de ventana
        const handleResize = () => {
            const newSrc = getImageSrc();
            if (newSrc !== currentSrc) {
                setCurrentSrc(newSrc);
                setIsLoading(true);
                setIsError(false);
                setUseFallback(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
        // eslint-disable-next-line
    }, [optimizedUrls]);

    // Si hubo error y hay fallback, mostrar la imagen original
    if (isError && fallbackSrc && !useFallback) {
        setUseFallback(true);
        setIsError(false);
        setIsLoading(true);
        setCurrentSrc(fallbackSrc);
        return null;
    }

    if (isError && useFallback) {
        return (
            <div
                className={`overflow-hidden w-full h-full ${className}`}
                style={{ aspectRatio, position: "relative" }}
            >
                <AspectRatio ratio={aspectRatio} className="relative">
                    <img
                        src={fallbackSrc}
                        alt={alt}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onLoad={() => {
                            setIsLoading(false);
                            setIsError(false);
                        }}
                        onError={() => {
                            setIsLoading(false);
                            setIsError(true);
                            console.error('OptimizedImage - fallback onError:', fallbackSrc);
                        }}
                    />
                    {isLoading && (
                        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                            <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
                        </div>
                    )}
                </AspectRatio>
            </div>
        );
    }

    if (isError) {
        return (
            <div 
                className={`bg-gray-300 flex items-center justify-center ${className}`}
                style={{ aspectRatio }}
            >
                <span className="text-gray-500">Error al cargar imagen</span>
            </div>
        );
    }

    return (
        <div
            className={`overflow-hidden w-full h-full ${className}`}
            style={{ aspectRatio, position: "relative" }}
        >
            <AspectRatio ratio={aspectRatio} className="relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
                    </div>
                )}
                <img
                    src={currentSrc}
                    alt={alt}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                        isLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                    loading="lazy"
                    onLoad={() => {
                        setIsLoading(false);
                        setIsError(false);
        
                    }}
                    onError={() => {
                        setIsError(true);
                        setIsLoading(false);
                        console.error('OptimizedImage - onError:', currentSrc);
                    }}
                />
            </AspectRatio>
        </div>
    );
} 
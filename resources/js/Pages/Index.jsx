import React, { useEffect } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { useToast } from "@/Components/ui/use-toast";
import { AspectRatio } from "@/Components/ui/aspect-ratio";

export default function Index() {
    const { toast } = useToast();
    const { props } = usePage();
    const success = props?.flash?.success;

    useEffect(() => {
        if (typeof success === "string" && success.length) {
            toast({
                title: "¡Gracias!",
                description: success,
                variant: "success",
            });
        }
    }, [success]);
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: "Yuna Cerámica",
        image: "https://yunaceramica.com/storage/uploads/yunalogowhite.webp",
        description:
            "Talleres de cerámica artesanal en Cipolletti y Neuquén. Experiencias creativas combinando cerámica con café y gin.",
        address: {
            "@type": "PostalAddress",
            streetAddress: "Cipolletti",
            addressRegion: "Río Negro",
            addressCountry: "AR",
        },
        geo: {
            "@type": "GeoCoordinates",
            latitude: "-38.9333",
            longitude: "-68.0667",
        },
        url: "https://yunaceramica.com",
        priceRange: "$$",
        openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
            ],
            opens: "09:00",
            closes: "18:00",
        },
        sameAs: ["https://instagram.com/yunaceramica"],
    };

    return (
        <>
            <Head>
                <title></title>

                {/* SEO Metas */}
                <meta
                    name="description"
                    content="Yuna Cerámica - Talleres de cerámica en Cipolletti y Neuquén. Venta de productos artesanales y kits creativos para pintar en casa y hornear en tu casa. ¡Creá piezas únicas!"
                />
                <meta
                    name="keywords"
                    content="cerámica, talleres de cerámica, cerámica artesanal, cerámica Cipolletti, cerámica Neuquén, taller de cerámica, cerámica y café, cerámica y gin, clases de cerámica, cerámica Río Negro"
                />
                <meta name="robots" content="index, follow" />
                <meta name="author" content="Yuna Cerámica" />
                <meta name="geo.region" content="AR-R" />
                <meta name="geo.placename" content="Cipolletti, Río Negro" />
                <link rel="canonical" href="https://yunaceramica.com" />

                {/* Open Graph / Social Media */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://yunaceramica.com" />
                <meta
                    property="og:title"
                    content="Yuna Cerámica - Talleres de Cerámica en Cipolletti"
                />
                <meta
                    property="og:description"
                    content="Descubre el arte de la cerámica en nuestros talleres. Experiencias únicas combinando cerámica con café y gin en Cipolletti."
                />
                <meta
                    property="og:image"
                    content="https://yunaceramica.com/storage/uploads/yunalogowhite.webp"
                />
                <meta property="og:locale" content="es_AR" />

                {/* Twitter Cards */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    name="twitter:title"
                    content="Yuna Cerámica - Talleres de Cerámica"
                />
                <meta
                    name="twitter:description"
                    content="Talleres de cerámica artesanal en Cipolletti. Aprende, crea y disfruta de experiencias únicas."
                />
                <meta
                    name="twitter:image"
                    content="https://yunaceramica.com/storage/uploads/yunalogowhite.webp"
                />

                {/* Schema.org */}
                <script type="application/ld+json">
                    {JSON.stringify(schemaData)}
                </script>
            </Head>
            <div className="">
                {/* Imagen de portada */}
                <div className="relative h-[80vh] w-full ">
                    <img
                        src="/storage/uploads/yunaceramica.webp"
                        alt="Portada Yuna Cerámica"
                        className="object-cover w-full h-full object-bottom"
                    />
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center  text-white text-center px-0 justify-center">
                        <h1 className="text-7xl pt-0 md:text-9xl font-bold">
                            Yuna
                        </h1>
                        <p className="mt-2 md:mt-2 text-2xl md:text-4xl max-w">
                            Arte y diseño en cerámica
                        </p>
                    </div>
                </div>
            </div>
            <section className="mb-20 mx-auto  max-w-7xl ">
                <h2 className="text-4xl md:text-5xl font-bold text-center py-8">
                    Nuestras secciones
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 sm:px-16 py-8 ">
                    <Link href="/productos" className="group relative">
                        <AspectRatio
                            ratio={1.8 / 1.4}
                            className="relative rounded-xl overflow-hidden shadow-lg"
                        >
                            <img
                                src="/storage/uploads/productos.webp"
                                alt="Productos"
                                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/30 flex p-10 justify-center items-center">
                                <h3 className="text-white text-end text-6xl md:text-7xl font-semibold">
                                    PRODUCTOS
                                </h3>
                            </div>
                        </AspectRatio>
                    </Link>

                    <Link href="/talleres" className="group relative">
                        <AspectRatio
                            ratio={1.8 / 1.4}
                            className="relative rounded-xl overflow-hidden shadow-lg"
                        >
                            <img
                                src="/storage/uploads/talleres.webp"
                                alt="Talleres"
                                className="object-cover object-[center_75%]  w-full h-full transition-transform duration-300 group-hover:scale-105 "
                            />
                            <div className="absolute inset-0 bg-black/30 flex p-10 justify-center items-center">
                                <h3 className="text-white text-end text-6xl md:text-7xl font-semibold">
                                    TALLERES
                                </h3>
                            </div>
                        </AspectRatio>
                    </Link>
                </div>
            </section>
        </>
    );
}

import { motion } from "framer-motion";
import { AspectRatio } from "@/Components/ui/aspect-ratio";
import OptimizedImage from "@/Components/Taller/OptimizedImage";

export default function ImageWithText({ image, title, description, extraContent, crop, zoom, optimizedUrls, isLCP }) {
    return (
      <div className="flex w-2xl flex-col md:flex-row md:items-start items-center mx-auto gap-8">
        <div className=" w-36 " ></div>
            <div className="flex-shrink-0 w-full md:w-1/3">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.2 }} 
                    transition={{ duration: 0.6 }}
                >
                    <AspectRatio
                        ratio={1.4 / 1.5}
                        className="relative rounded-xl overflow-hidden shadow-lg"
                    >
                        {optimizedUrls ? (
                            <OptimizedImage
                                optimizedUrls={optimizedUrls}
                                aspectRatio={1.4 / 1.5}
                                alt={title || "Imagen del taller"}
                                fallbackSrc={image}
                                isLCP={isLCP}
                            />
                        ) : image ? (
                            <img
                                src={image}
                                alt={title || "Imagen del taller"}
                                className="w-full h-full object-cover"
                                {...(isLCP ? { fetchpriority: "high" } : { loading: "lazy" })}
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-300" />
                        )}
                    </AspectRatio>
                </motion.div>
            </div>

            <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, amount: 0.8 }}
    transition={{ duration: 1.8 }}
    className="w-full md:w-1/2"
>
    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center md:text-left">{title}</h2>

    <div
        className="text-gray-700 prose max-w-none text-left space-y-4 [&>p]:font-sans [&>p]:font-normal [&>ul]:font-sans [&>ol]:font-sans [&>li]:font-sans [&>span]:font-sans [&>div]:font-sans"
        dangerouslySetInnerHTML={{ __html: description }}
    />

    {extraContent}
</motion.div>
<div className="w-36" ></div>
        </div>
        
    );
}

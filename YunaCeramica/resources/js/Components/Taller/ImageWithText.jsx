import { motion } from "framer-motion";
import { AspectRatio } from "@/Components/ui/aspect-ratio";

export default function ImageWithText({ image, title, description, extraContent }) {
    return (
      <div className="flex flex-col md:flex-row md:items-start items-center gap-8">
            <div className="flex-shrink-0 w-full md:w-1/2">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.2 }} // amount es qué porcentaje debe entrar para activarse
                    transition={{ duration: 0.6 }}
                >
                    <AspectRatio
                        ratio={2 / 1.5}
                        className="relative rounded-xl overflow-hidden shadow-lg"
                    >
                        {image ? (
                            <img
                                src={image}
                                alt={title}
                                className="object-cover w-full h-full"
                                loading="lazy"
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
        className="text-gray-700 prose max-w-none text-left space-y-4"
        dangerouslySetInnerHTML={{ __html: description }}
    />

    {extraContent}
</motion.div>
        </div>
    );
}

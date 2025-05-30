// resources/js/Components/CardMenu.jsx

import { cn } from "@/lib/utils";
import { Checkbox } from "@/Components/ui/checkbox";

export default function CardMenu({ menu, seleccionado, onSelect }) {
    const handleClick = () => {
        onSelect(menu.id);
    };

    return (
        <div
            onClick={handleClick}
            className={cn(
                "cursor-pointer border rounded-2xl p-4 shadow-md transition-all duration-200 mx-auto max-w-80 h-64",
                seleccionado ? "bg-gray-200 border-gray-700" : "bg-white hover:bg-gray-100 border-gray-300"
            )}
        >
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold mx-auto text-gray-800">{menu.nombre}</h3>
                <Checkbox
                    checked={seleccionado}
                    onCheckedChange={handleClick}
                    className="mt-1"
                />
            </div>

            <div
                className="text-lg text-gray-700 overflow-y-auto overflow-x-hidden"
                style={{ maxHeight: 'calc(100% - 2.5rem)' }} // resta el espacio del título + padding
                dangerouslySetInnerHTML={{ __html: menu.pivot.html }}
            />
        </div>
    );
}

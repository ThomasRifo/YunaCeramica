import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs({ items }) {
    return (
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-gray-700">
                Inicio
            </Link>
            {items.map((item, index) => (
                <div key={index} className="flex items-center">
                    <ChevronRight className="w-4 h-4" />
                    {index === items.length - 1 ? (
                        <span className="text-gray-700">{item.label}</span>
                    ) : (
                        <Link href={item.href} className="hover:text-gray-700">
                            {item.label}
                        </Link>
                    )}
                </div>
            ))}
        </nav>
    );
}

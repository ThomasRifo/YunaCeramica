# Componentes Reutilizables de Búsqueda y Filtros

## SearchBar

Componente de búsqueda con debounce automático.

### Props:
- `placeholder` (string): Texto del placeholder
- `onSearch` (function): Callback que se ejecuta con el término de búsqueda
- `debounceMs` (number): Tiempo de debounce en ms (default: 300)
- `className` (string): Clases CSS adicionales
- `showClearButton` (boolean): Mostrar botón de limpiar (default: true)

### Ejemplo de uso:
```jsx
import SearchBar from '@/Components/SearchBar';

<SearchBar
  placeholder="Buscar productos..."
  onSearch={(term) => setSearchTerm(term)}
  debounceMs={500}
/>
```

## SortFilter

Componente de filtros de ordenamiento.

### Props:
- `sortOptions` (array): Opciones de ordenamiento
- `selectedSort` (string): Valor seleccionado actualmente
- `onSortChange` (function): Callback cuando cambia la selección
- `className` (string): Clases CSS adicionales
- `showFilterIcon` (boolean): Mostrar ícono de filtro (default: true)

### Estructura de sortOptions:
```jsx
const sortOptions = [
  { 
    value: 'fecha_desc', 
    label: 'Fecha (más reciente)', 
    field: 'fecha_publicacion', 
    type: 'date', 
    direction: 'desc' 
  },
  { 
    value: 'nombre_asc', 
    label: 'Nombre (A-Z)', 
    field: 'nombre', 
    type: 'string', 
    direction: 'asc' 
  }
];
```

### Tipos soportados:
- `date`: Para fechas
- `string`: Para texto
- `number`: Para números

### Ejemplo de uso:
```jsx
import SortFilter from '@/Components/SortFilter';

<SortFilter
  sortOptions={sortOptions}
  selectedSort={selectedSort}
  onSortChange={setSelectedSort}
/>
```

## useSearchAndFilter Hook

Hook personalizado que combina búsqueda y filtrado.

### Parámetros:
- `data` (array): Array de datos a filtrar
- `searchFields` (array): Campos donde buscar
- `sortOptions` (array): Opciones de ordenamiento

### Retorna:
- `searchTerm`: Término de búsqueda actual
- `setSearchTerm`: Función para actualizar búsqueda
- `selectedSort`: Ordenamiento seleccionado
- `setSelectedSort`: Función para actualizar ordenamiento
- `filteredData`: Datos filtrados y ordenados
- `totalResults`: Número total de resultados

### Ejemplo de uso:
```jsx
import useSearchAndFilter from '@/hooks/useSearchAndFilter';

const {
  searchTerm,
  setSearchTerm,
  selectedSort,
  setSelectedSort,
  filteredData,
  totalResults
} = useSearchAndFilter(products, ['nombre', 'descripcion'], sortOptions);
```

## Ejemplo Completo - Sección de Productos

```jsx
import React from 'react';
import SearchBar from '@/Components/SearchBar';
import SortFilter from '@/Components/SortFilter';
import useSearchAndFilter from '@/hooks/useSearchAndFilter';

export default function ProductosIndex({ productos }) {
  const searchFields = ['nombre', 'descripcion', 'categoria'];
  const sortOptions = [
    { value: 'nombre_asc', label: 'Nombre (A-Z)', field: 'nombre', type: 'string', direction: 'asc' },
    { value: 'precio_asc', label: 'Precio (menor a mayor)', field: 'precio', type: 'number', direction: 'asc' },
    { value: 'fecha_desc', label: 'Fecha (más reciente)', field: 'created_at', type: 'date', direction: 'desc' }
  ];

  const {
    searchTerm,
    setSearchTerm,
    selectedSort,
    setSelectedSort,
    filteredData,
    totalResults
  } = useSearchAndFilter(productos, searchFields, sortOptions);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <div className="flex-1 max-w-md">
          <SearchBar
            placeholder="Buscar productos..."
            onSearch={setSearchTerm}
            className="w-full"
          />
        </div>
        
        <SortFilter
          sortOptions={sortOptions}
          selectedSort={selectedSort}
          onSortChange={setSelectedSort}
        />
      </div>

      <div className="text-sm text-gray-600 mb-4">
        {totalResults} producto{totalResults !== 1 ? 's' : ''} encontrado{totalResults !== 1 ? 's' : ''}
      </div>

      {/* Renderizar productos filtrados */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredData.map(producto => (
          <ProductCard key={producto.id} producto={producto} />
        ))}
      </div>
    </div>
  );
}
```

## Ejemplo - Sección de Clientes

```jsx
import React from 'react';
import SearchBar from '@/Components/SearchBar';
import SortFilter from '@/Components/SortFilter';
import useSearchAndFilter from '@/hooks/useSearchAndFilter';

export default function ClientesIndex({ clientes }) {
  const searchFields = ['nombre', 'apellido', 'email'];
  const sortOptions = [
    { value: 'nombre_asc', label: 'Nombre (A-Z)', field: 'nombre', type: 'string', direction: 'asc' },
    { value: 'fecha_registro_desc', label: 'Fecha de registro', field: 'created_at', type: 'date', direction: 'desc' }
  ];

  const {
    searchTerm,
    setSearchTerm,
    selectedSort,
    setSelectedSort,
    filteredData,
    totalResults
  } = useSearchAndFilter(clientes, searchFields, sortOptions);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <div className="flex-1 max-w-md">
          <SearchBar
            placeholder="Buscar por nombre o email..."
            onSearch={setSearchTerm}
            className="w-full"
          />
        </div>
        
        <SortFilter
          sortOptions={sortOptions}
          selectedSort={selectedSort}
          onSortChange={setSelectedSort}
        />
      </div>

      {/* Renderizar clientes filtrados */}
      <div className="space-y-4">
        {filteredData.map(cliente => (
          <ClienteCard key={cliente.id} cliente={cliente} />
        ))}
      </div>
    </div>
  );
}
``` 
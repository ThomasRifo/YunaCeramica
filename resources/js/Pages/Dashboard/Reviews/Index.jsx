import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import ReviewCardDashboard from '@/Components/ReviewCardDashboard';
import SearchBar from '@/Components/SearchBar';
import SortFilter from '@/Components/SortFilter';
import useSearchAndFilter from '@/hooks/useSearchAndFilter';

export default function ReviewsIndex({ pendingReviews, enabledReviews }) {
  const [localPendingReviews, setLocalPendingReviews] = useState(pendingReviews);
  const [localEnabledReviews, setLocalEnabledReviews] = useState(enabledReviews);

  const handleActionComplete = (updatedReview, action = 'toggle') => {
    if (action === 'delete') {
      // Remover la review de ambas listas
      setLocalPendingReviews(prev => prev.filter(r => r.id !== updatedReview.id));
      setLocalEnabledReviews(prev => prev.filter(r => r.id !== updatedReview.id));
    } else if (action === 'toggle') {
      // Mover la review entre listas según su estado
      if (updatedReview.habilitada) {
        // Mover de pendientes a habilitadas
        setLocalPendingReviews(prev => prev.filter(r => r.id !== updatedReview.id));
        setLocalEnabledReviews(prev => [updatedReview, ...prev]);
      } else {
        // Mover de habilitadas a pendientes
        setLocalEnabledReviews(prev => prev.filter(r => r.id !== updatedReview.id));
        setLocalPendingReviews(prev => [updatedReview, ...prev]);
      }
    }
  };

  // Configuración para búsqueda y filtros de reseñas habilitadas
  const searchFields = ['nombre', 'apellido', 'taller', 'mensaje'];
  const sortOptions = [
    { value: 'fecha_desc', label: 'Fecha (más reciente)', field: 'fecha_publicacion', type: 'date', direction: 'desc' },
    { value: 'fecha_asc', label: 'Fecha (más antigua)', field: 'fecha_publicacion', type: 'date', direction: 'asc' },
    { value: 'nombre_asc', label: 'Nombre (A-Z)', field: 'nombre', type: 'string', direction: 'asc' },
    { value: 'nombre_desc', label: 'Nombre (Z-A)', field: 'nombre', type: 'string', direction: 'desc' },
    { value: 'taller_asc', label: 'Taller (A-Z)', field: 'taller', type: 'string', direction: 'asc' },
    { value: 'taller_desc', label: 'Taller (Z-A)', field: 'taller', type: 'string', direction: 'desc' }
  ];

  const {
    searchTerm,
    setSearchTerm,
    selectedSort,
    setSelectedSort,
    filteredData: filteredEnabledReviews,
    totalResults
  } = useSearchAndFilter(localEnabledReviews, searchFields, sortOptions);

  return (
    <>
      <Head title="Reseñas - Dashboard" />
      <div className="p-6">
        
        
        {/* Sección de Reseñas Pendientes */}
        {localPendingReviews.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-orange-600">
              Reseñas Pendientes ({localPendingReviews.length})
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {localPendingReviews.map((review) => (
                <ReviewCardDashboard 
                  key={review.id} 
                  review={review} 
                  showActions={true}
                  onActionComplete={handleActionComplete}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="h-16 w-16 text-green-500 mx-auto mb-4 flex items-center justify-center">
              <svg className="h-16 w-16" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">¡No hay reseñas pendientes!</h3>
            <p className="text-gray-600">Todas las reseñas han sido revisadas.</p>
          </div>
        )}

        {/* Sección de Reseñas Habilitadas */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-green-600">
            Reseñas Habilitadas ({localEnabledReviews.length})
          </h2>
          
          {/* Barra de búsqueda y filtros */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 max-w-md">
              <SearchBar
                placeholder="Buscar por nombre, taller o mensaje..."
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

          {/* Resultados de búsqueda */}
          {(searchTerm || selectedSort) && (
            <div className="mb-4 text-sm text-gray-600">
              {totalResults} resultado{totalResults !== 1 ? 's' : ''} encontrado{totalResults !== 1 ? 's' : ''}
              {searchTerm && ` para "${searchTerm}"`}
            </div>
          )}

          {/* Grid de reseñas habilitadas */}
          {filteredEnabledReviews.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {filteredEnabledReviews.map((review) => (
                <ReviewCardDashboard 
                  key={review.id} 
                  review={review} 
                  showActions={true}
                  onActionComplete={handleActionComplete}
                />
              ))}
            </div>
          ) : localEnabledReviews.length > 0 ? (
            <div className="text-center py-12">
              <div className="h-16 w-16 text-gray-400 mx-auto mb-4 flex items-center justify-center">
                <svg className="h-16 w-16" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron resultados</h3>
              <p className="text-gray-600">Intenta con otros términos de búsqueda.</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="h-16 w-16 text-gray-400 mx-auto mb-4 flex items-center justify-center">
                <svg className="h-16 w-16" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay reseñas habilitadas</h3>
              <p className="text-gray-600">Las reseñas aparecerán aquí una vez que sean aprobadas.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
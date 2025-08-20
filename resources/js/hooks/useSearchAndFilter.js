import { useState, useMemo } from 'react';

export default function useSearchAndFilter(data, searchFields = [], sortOptions = []) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSort, setSelectedSort] = useState('');

  // Función de búsqueda
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) {
      return data;
    }

    const searchLower = searchTerm.toLowerCase();
    
    return data.filter(item => {
      return searchFields.some(field => {
        const value = item[field];
        if (value === null || value === undefined) return false;
        return value.toString().toLowerCase().includes(searchLower);
      });
    });
  }, [data, searchTerm, searchFields]);

  // Función de ordenamiento
  const sortedAndFilteredData = useMemo(() => {
    if (!selectedSort) {
      return filteredData;
    }

    const sortOption = sortOptions.find(option => option.value === selectedSort);
    if (!sortOption) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortOption.field];
      const bValue = b[sortOption.field];

      if (sortOption.type === 'date') {
        return sortOption.direction === 'asc' 
          ? new Date(aValue) - new Date(bValue)
          : new Date(bValue) - new Date(aValue);
      }

      if (sortOption.type === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortOption.direction === 'asc' ? comparison : -comparison;
      }

      if (sortOption.type === 'number') {
        return sortOption.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [filteredData, selectedSort, sortOptions]);

  return {
    searchTerm,
    setSearchTerm,
    selectedSort,
    setSelectedSort,
    filteredData: sortedAndFilteredData,
    totalResults: sortedAndFilteredData.length
  };
} 
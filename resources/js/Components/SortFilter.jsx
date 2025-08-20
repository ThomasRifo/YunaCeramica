import React from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';

export default function SortFilter({ 
  sortOptions = [],
  selectedSort = '',
  onSortChange,
  className = "",
  showFilterIcon = true 
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showFilterIcon && (
        <Filter className="h-4 w-4 text-gray-500" />
      )}
      
      <Select value={selectedSort} onValueChange={onSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Ordenar por..." />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 
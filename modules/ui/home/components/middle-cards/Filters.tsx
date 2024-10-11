import React from 'react';
import Image from 'next/image';

interface FilterItem {
  id: string;
  name: string;
  icon: string;
}

interface FiltersProps {
  filters: FilterItem[];
  selectedFilter: string | null;
  onFilterSelect: (filterId: string) => void;
}

const Filters: React.FC<FiltersProps> = ({ filters, selectedFilter, onFilterSelect }) => {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex space-x-4 pb-4">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterSelect(filter.id)}
            className={`flex text-xs items-center space-x-1 px-4 py-2 rounded-full transition-colors ${
              selectedFilter === filter.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            <Image
              src={filter.icon}
              alt={filter.name}
              width={24}
              height={24}
              className="rounded-full h-4 w-4"
            />
            <span>{filter.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Filters;

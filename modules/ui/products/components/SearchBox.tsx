import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

interface SearchBoxProps {
  onSearch: (query: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch }) => {
  return (
    <div className="relative w-full mb-4">
      <Input
        type="text"
        placeholder="Search for medicine..."
        className="pl-10 pr-4 py-2 w-full rounded-2xl shadow-lg h-12"
        onChange={(e) => onSearch(e.target.value)}
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </div>
  );
};

export default SearchBox;

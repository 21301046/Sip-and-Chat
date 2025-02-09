import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="relative w-full max-w-xs flex"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Products..."
        className="w-full px-3 py-1.5 text-sm rounded-l-md border border-gray-300 focus:outline-none focus:border-gray-400"
      />
      <button
        type="submit"
        className="px-3 bg-primary-600 hover:bg-primary-600 rounded-r-md flex items-center justify-center"
      >
        <Search className="h-4 w-4 text-white" />
      </button>
    </form>
  );
}
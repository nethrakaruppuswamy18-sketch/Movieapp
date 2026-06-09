import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

export function SearchBar({
  onSearch,
  initialValue = "",
  placeholder = "Search for movies by title (e.g. Inception, Dune...)",
}) {
  const [query, setQuery] = useState(initialValue);

  // Sync internal value with initialValue prop if it changes externally
  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  // Debouncing effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearch(query);
    }, 450); // 450ms debounce time is perfect for responsive feel without over-fetching

    return () => clearTimeout(delayDebounceFn);
  }, [query, onSearch]);

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Background Glow */}
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 opacity-25 blur-sm transition duration-300 group-focus-within:opacity-40" />

      <div className="relative flex items-center bg-gray-900 border border-gray-800 rounded-2xl p-0.5 overflow-hidden focus-within:border-red-500/50 focus-within:ring-2 focus-within:ring-red-950 transition-all duration-300">
        <div className="pl-4 text-gray-500 flex items-center justify-center">
          <Search className="h-5 w-5 stroke-[1.5]" />
        </div>

        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          aria-label="Search movies"
          className="w-full bg-transparent px-4 py-3.5 text-base text-white placeholder-gray-500 outline-none focus:ring-0"
        />

        {query && (
          <button
            onClick={handleClear}
            className="p-2 mr-2 text-gray-400 hover:text-white rounded-xl hover:bg-gray-800 transition-colors"
            title="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}

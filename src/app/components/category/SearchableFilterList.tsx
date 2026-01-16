// src/app/components/category/SearchableFilterList.tsx
"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import FilterCheckboxRow from "./FilterCheckboxRow";

interface SearchableListProps {
  items: { id: string; name: string; value: string }[]; // Unified format
  selectedValues: string[];
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchableFilterList({
  items,
  selectedValues,
  onChange,
  placeholder = "Search...",
}: SearchableListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter list based on search
  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  return (
    <div className="flex flex-col h-full max-h-60">
      {/* Search Bar (Sticky Top) */}
      <div className="relative mb-2 shrink-0">
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-brand-primary/50 transition-colors"
        />
        <Search
          size={12}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
      </div>

      {/* Scrollable List */}
      <div className="overflow-y-auto custom-scrollbar pr-1 grow space-y-0.5">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <FilterCheckboxRow
              key={item.id}
              label={item.name}
              checked={selectedValues.includes(item.value)}
              onChange={() => onChange(item.value)}
            />
          ))
        ) : (
          <p className="text-xs text-center text-gray-400 py-4">
            No matches found
          </p>
        )}
      </div>
    </div>
  );
}
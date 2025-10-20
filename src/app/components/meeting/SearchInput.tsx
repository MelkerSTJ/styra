"use client";

import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Sök möte...",
}: SearchInputProps) {
  return (
    <div className="w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm bg-white/80 dark:bg-slate-900/70 border border-gray-200 dark:border-slate-700
          text-gray-800 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>
    </div>
  );
}

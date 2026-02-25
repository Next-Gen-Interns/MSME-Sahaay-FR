"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";

export default function MultiSelectFilter({
  title,
  options = [],
  selectedValues = [],
  onChange,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter options by search
  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const toggleValue = (value) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full border px-3 py-2 rounded flex justify-between items-center bg-white"
      >
        <span className="truncate">
          {selectedValues.length > 0
            ? `${title} (${selectedValues.length})`
            : title}
        </span>
        <ChevronDown size={16} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white border rounded shadow max-h-72 overflow-y-auto p-3">
          {/* Search Input */}
          <input
            type="text"
            placeholder={`Search ${title.toLowerCase()}...`}
            className="w-full border px-2 py-1 mb-3 rounded text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Options */}
          {filtered.length === 0 && (
            <div className="text-sm text-gray-500 text-center py-2">
              No results
            </div>
          )}

          {filtered.map((option) => (
            <div
              key={option.value}
              onClick={() => toggleValue(option.value)}
              className="flex items-center justify-between px-2 py-1 hover:bg-gray-100 cursor-pointer rounded"
            >
              <span className="text-sm truncate">
                {option.label}
              </span>

              {selectedValues.includes(option.value) && (
                <Check size={14} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
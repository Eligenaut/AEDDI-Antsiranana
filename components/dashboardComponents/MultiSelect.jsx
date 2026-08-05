"use client";
import { useState, useRef, useEffect } from "react";
import { Search, X, Check } from "lucide-react";

export function MultiSelect({ options, selectedValues = [], onChange, placeholder = "Rechercher...", disabled = false, error }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = options.filter(
    (o) => o.name.toLowerCase().includes(search.toLowerCase())
  );

  const isSelected = (id) => selectedValues.includes(id);

  const toggle = (id) => {
    if (isSelected(id)) {
      onChange(selectedValues.filter((v) => v !== id));
    } else {
      onChange([...selectedValues, id]);
    }
  };

  const remove = (id, e) => {
    e.stopPropagation();
    onChange(selectedValues.filter((v) => v !== id));
  };

  const selectedOptions = options.filter((o) => selectedValues.includes(o.id));

  return (
    <div className="relative" ref={containerRef}>
      <div
        className={`w-full border rounded-lg px-3 py-2 text-sm cursor-pointer flex flex-wrap gap-1.5 min-h-[38px] items-center ${
          error ? "border-red-300" : "border-gray-300"
        } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
        onClick={() => { if (!disabled) { setIsOpen(!isOpen); setSearch(""); } }}
      >
        {selectedOptions.length === 0 && (
          <span className="text-gray-400">{placeholder}</span>
        )}
        {selectedOptions.map((o) => (
          <span
            key={o.id}
            className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 rounded-full px-2 py-0.5 text-xs font-medium"
          >
            {o.name}
            <button
              type="button"
              onClick={(e) => remove(o.id, e)}
              className="hover:bg-purple-200 rounded-full p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 flex flex-col">
          <div className=" flex items-center gap-2 px-3 py-2 border-b border-gray-100">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un membre..."
              className="w-full text-sm outline-none text-black placeholder-gray-400"
              autoFocus
            />
          </div>
          <div className="overflow-y-auto flex-1">
            {filtered.length === 0 ? (
              <div className="px-3 py-4 text-sm text-gray-400 text-center">
                Aucun résultat
              </div>
            ) : (
              filtered.map((o) => (
                <div
                  key={o.id}
                  className={`flex items-center gap-2 px-3 py-2 cursor-pointer text-sm hover:bg-purple-50 ${
                    isSelected(o.id) ? "bg-purple-50" : ""
                  }`}
                  onClick={() => toggle(o.id)}
                >
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center ${
                      isSelected(o.id)
                        ? "bg-purple-600 border-purple-600"
                        : "border-gray-300"
                    }`}
                  >
                    {isSelected(o.id) && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className={isSelected(o.id) ? "text-purple-700 font-medium" : "text-gray-700"}>
                    {o.name}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

type FilterKey = "ALL" | "UPCOMING" | "ENDED" | "NOPROTOCOL";

interface FilterBarProps {
  active: FilterKey;
  onChange: (f: FilterKey) => void;
  totalCount: number;
}

const pills: { key: FilterKey; label: string }[] = [
  { key: "ALL", label: "Alla" },
  { key: "UPCOMING", label: "Kommande" },
  { key: "ENDED", label: "Avslutade" },
  { key: "NOPROTOCOL", label: "Protokoll saknas" },
];

export default function FilterBar({ active, onChange, totalCount }: FilterBarProps) {
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        {/* Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {pills.map((p) => {
            const isActive = p.key === active;
            return (
              <button
                key={p.key}
                onClick={() => onChange(p.key)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all border
                ${isActive
                  ? "bg-white text-gray-900 border-gray-300 shadow-sm dark:bg-slate-800 dark:text-gray-100 dark:border-slate-600"
                  : "bg-transparent text-gray-700 border-gray-200 hover:bg-white/60 dark:text-gray-300 dark:border-slate-700 dark:hover:bg-slate-800/60"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Counter */}
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {totalCount} {totalCount === 1 ? "möte" : "möten"}
        </div>
      </div>
    </div>
  );
}

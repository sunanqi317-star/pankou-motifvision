interface ChipGroupProps {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
}

export function ChipGroup({ label, options, value, onChange }: ChipGroupProps) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium text-stone-600">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = value === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`rounded-full px-3 py-1.5 text-xs transition-all ${
                active
                  ? 'bg-[#2c2825] text-[#faf8f4]'
                  : 'border border-stone-200 bg-white text-stone-600 hover:border-amber-800/30'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

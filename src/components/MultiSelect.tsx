export default function MultiSelect<T extends { id: string; label: string; color?: string }>({
  options, selected, onToggle,
}: {
  options: T[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="studio-multiselect">
      {options.map((opt) => {
        const active = selected.includes(opt.id);
        return (
          <button
            type="button"
            key={opt.id}
            className={`studio-multiselect-chip ${active ? "active" : ""}`}
            style={active && opt.color ? { background: opt.color, borderColor: opt.color, color: "#fff" } : undefined}
            onClick={() => onToggle(opt.id)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

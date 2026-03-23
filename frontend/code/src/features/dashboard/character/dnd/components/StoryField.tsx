import { fontStyles } from "../constants/theme";

interface StoryFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export function StoryField({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: StoryFieldProps) {
  return (
    <div
      className="rounded-xl border border-[#2a1f0f] overflow-hidden"
      style={{ background: "#140f0a" }}
    >
      <div className="px-4 py-2.5 border-b border-[#1a1510]">
        <span
          className="text-[#a89070] text-xs uppercase tracking-widest"
          style={fontStyles.display}
        >
          {label}
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full bg-transparent text-[#a89070] placeholder:text-[#2a1f0f] outline-none px-4 py-3 resize-none text-sm leading-relaxed"
        style={{ fontFamily: "'Crimson Text', serif", fontSize: "1rem" }}
      />
    </div>
  );
}

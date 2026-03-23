import { LABEL_CLASS, fontStyles } from "../constants/theme";

interface StatBoxProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  color?: string;
}

export function StatBox({
  label,
  value,
  onChange,
  color = "#e8d5b0",
}: StatBoxProps) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl border border-[#2a1f0f] p-2 gap-0 w-[110px] h-[130px]"
      style={{ background: "#140f0a" }}
    >
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="text-center bg-transparent outline-none w-full h-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        style={{
          color,
          fontFamily: "'Cinzel', serif",
          fontSize: "1.5rem",
          fontWeight: 700,
        }}
      />
      <span
        className={LABEL_CLASS + " mb-0 text-center px-1 w-full whitespace-normal break-words leading-tight tracking-normal mt-1"}
        style={{ ...fontStyles.display, fontSize: "0.65rem" }}
      >
        {label}
      </span>
    </div>
  );
}

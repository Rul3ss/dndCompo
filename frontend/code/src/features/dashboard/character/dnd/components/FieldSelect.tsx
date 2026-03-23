import { LABEL_CLASS, SELECT_CLASS, fontStyles } from "../constants/theme";

interface FieldSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
}

export function FieldSelect({ label, value, onChange, options }: FieldSelectProps) {
  return (
    <div>
      <label className={LABEL_CLASS} style={fontStyles.display}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={SELECT_CLASS}
        style={{ ...fontStyles.body, background: "#0f0c09" }}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

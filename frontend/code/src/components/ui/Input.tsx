import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: ReactNode;
}

export default function Input({
  label,
  error,
  helperText,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="flex flex-col gap-2 relative">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-semibold text-text-main uppercase tracking-wider"
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        className={`
          bg-bg-input 
          border border-border-default 
          rounded 
          px-4 py-3 
          text-white 
          text-base
          transition-all
          focus:outline-none 
          focus:border-primary 
          focus:ring-1
          focus:ring-primary
          placeholder:text-border-focus
          disabled:bg-white/5
          disabled:text-gray-500
          disabled:cursor-not-allowed
          ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
          ${className}
        `}
        {...props}
      />

      {helperText && !error && (
        <span className="text-xs text-text-muted">{helperText}</span>
      )}

      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}

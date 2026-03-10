import type { ReactNode } from "react";

interface AlertProps {
  variant?: "error" | "success" | "warning" | "info";
  children: ReactNode;
  className?: string;
}

export default function Alert({
  variant = "info",
  children,
  className = "",
}: AlertProps) {
  const variants = {
    error: "bg-primary/10 border-primary/50 text-red-400",
    success: "bg-green-500/10 border-green-500/50 text-green-400",
    warning: "bg-yellow-500/10 border-yellow-500/50 text-yellow-400",
    info: "bg-blue-500/10 border-blue-500/50 text-blue-400",
  };

  return (
    <div
      className={`
        px-4 py-3 
        rounded 
        text-sm 
        font-medium 
        border
        ${variants[variant]} 
        ${className}
      `}
    >
      {children}
    </div>
  );
}

import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export default function Card({
  children,
  className = "",
  hover = false,
  padding = "md",
}: CardProps) {
  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-10",
  };

  return (
    <div
      className={`
        bg-bg-panel 
        border border-border-default 
        rounded-lg
        ${paddings[padding]}
        ${hover ? "transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-border-focus" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

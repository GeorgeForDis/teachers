import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "accent";
}

export const GlassButton = ({ 
  children, 
  className, 
  onClick,
  variant = "primary",
  ...props
}: GlassButtonProps) => {
  const variantStyles = {
    primary: "glass hover:glow-primary text-foreground",
    secondary: "glass hover:glow-secondary text-secondary-foreground bg-secondary/40",
    accent: "glass hover:glow-accent text-accent-foreground bg-accent/40",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-xl px-6 py-3 font-medium transition-all duration-300",
        "hover:scale-105 active:scale-95",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

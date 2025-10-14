import { cn } from "@/lib/utils";

interface TagProps {
  children: string;
  variant?: "primary" | "secondary" | "accent";
  className?: string;
}

export const Tag = ({ children, variant = "primary", className }: TagProps) => {
  const variantStyles = {
    primary: "bg-primary/20 text-primary border-primary/30",
    secondary: "bg-secondary/30 text-secondary-foreground border-secondary/40",
    accent: "bg-accent/30 text-accent-foreground border-accent/40",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg px-3 py-1 text-sm font-medium",
        "border backdrop-blur-sm",
        "transition-all duration-300 hover:scale-105",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

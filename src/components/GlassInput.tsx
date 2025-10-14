import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { InputHTMLAttributes } from "react";

interface GlassInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange?: (value: string) => void;
  hideIcon?: boolean;
}

export const GlassInput = ({ 
  placeholder = "Поиск...", 
  value, 
  onChange,
  className,
  hideIcon = false,
  ...props
}: GlassInputProps) => {
  return (
    <div className={cn("relative", className)}>
      {!hideIcon && (
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      )}
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "glass w-full rounded-xl pr-4 py-3",
          hideIcon ? "pl-4" : "pl-12",
          "text-foreground placeholder:text-muted-foreground",
          "focus:outline-none focus:ring-2 focus:ring-primary/50",
          "transition-all duration-300"
        )}
        {...props}
      />
    </div>
  );
};

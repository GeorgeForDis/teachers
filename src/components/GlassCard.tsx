import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: (e?: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

export const GlassCard = ({ children, className, hover = false, onClick, style }: GlassCardProps) => {
  return (
    <div
      onClick={onClick}
      style={style}
      className={cn(
        "glass rounded-2xl p-6 transition-all duration-300",
        hover && "hover:scale-[1.02] hover:glow-primary cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
};

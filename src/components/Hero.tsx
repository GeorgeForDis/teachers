import { GlassCard } from "./GlassCard";

interface HeroProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
}

export const Hero = ({ 
  title = "Наши преподаватели",
  subtitle = "Профессионалы, которые вдохновляют",
  backgroundImage = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&h=600&fit=crop"
}: HeroProps) => {
  return (
    <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden mb-8 md:mb-12">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background md:from-background/60 md:via-background/40 backdrop-blur-[2px] md:backdrop-blur-0" />
      </div>
      
      {/* Content */}
      <div className="relative h-full flex items-center justify-center px-4">
        <GlassCard className="max-w-3xl w-full text-center animate-scale-in">
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-base md:text-xl lg:text-2xl text-muted-foreground">
            {subtitle}
          </p>
        </GlassCard>
      </div>
    </div>
  );
};

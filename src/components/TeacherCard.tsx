import { GlassCard } from "./GlassCard";

interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  position: string;
  subjects: string[];
  photo_url?: string;
}

interface TeacherCardProps {
  teacher: Teacher;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const TeacherCard = ({ teacher, onClick, className, style }: TeacherCardProps) => {
  const fullName = [teacher.last_name, teacher.first_name, teacher.middle_name]
    .filter(Boolean)
    .join(" ");
  
  const displaySubjects = teacher.subjects.slice(0, 2).join(", ");
  
  return (
    <GlassCard 
      hover 
      onClick={onClick} 
      className={`group w-full flex flex-col overflow-hidden p-0 ${className || ''}`}
      style={{ aspectRatio: '3/4', ...style }}
    >
      {/* Portrait Photo - strictly 3:4 aspect ratio */}
      <div className="relative w-full overflow-hidden bg-muted/20">
        <div className="relative w-full" style={{ aspectRatio: '3/4' }}>
          <img
            src={teacher.photo_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=533&fit=crop"}
            alt={fullName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
      
      {/* Text section */}
      <div className="flex flex-col items-center justify-center text-center px-3 py-3 space-y-1">
        <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2 w-full leading-tight">
          {fullName}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-1 w-full">
          {teacher.position}
        </p>
        {displaySubjects && (
          <p className="text-xs text-muted-foreground/80 line-clamp-1 w-full">
            {displaySubjects}
          </p>
        )}
      </div>
    </GlassCard>
  );
};

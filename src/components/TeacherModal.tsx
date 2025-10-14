import { X } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { Teacher } from "@/hooks/useTeachers";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface TeacherModalProps {
  teacher: Teacher | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TeacherModal = ({ teacher, isOpen, onClose }: TeacherModalProps) => {
  const isMobile = useIsMobile();
  
  if (!isOpen || !teacher) return null;

  const fullName = [teacher.last_name, teacher.first_name, teacher.middle_name]
    .filter(Boolean)
    .join(" ");

  const content = (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-shrink-0">
        <div className="w-full md:w-48 h-64 rounded-2xl overflow-hidden ring-4 ring-white/20">
          <img
            src={teacher.photo_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=533&fit=crop"}
            alt={fullName}
            className="w-full h-full object-cover object-center"
            style={{ objectPosition: 'center 20%' }}
          />
        </div>
      </div>
      
      <div className="flex-1 space-y-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {fullName}
          </h2>
          <p className="text-base md:text-lg font-medium text-primary mb-1">
            {teacher.position}
          </p>
          {teacher.categories.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {teacher.categories.join(", ")}
            </p>
          )}
        </div>
        
        {teacher.subjects.length > 0 && (
          <div>
            <h4 className="font-semibold text-foreground mb-2">Предметы:</h4>
            <p className="text-sm text-foreground/90">{teacher.subjects.join(", ")}</p>
          </div>
        )}
        
        <div className="space-y-3 text-sm text-foreground/90">
          {teacher.bio && <p>{teacher.bio}</p>}
          
          {(teacher.contact_email || teacher.contact_phone) && (
            <div>
              <h4 className="font-semibold text-foreground mb-1">Контакты:</h4>
              <div className="space-y-1">
                {teacher.contact_email && <p>Email: {teacher.contact_email}</p>}
                {teacher.contact_phone && <p>Телефон: {teacher.contact_phone}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Mobile: Bottom sheet
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="bottom" className="h-[85vh] glass border-t border-white/20">
          <SheetHeader>
            <SheetTitle className="text-foreground">{fullName}</SheetTitle>
          </SheetHeader>
          <div className="mt-4 overflow-y-auto h-[calc(85vh-80px)] pb-6">
            {content}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: Modal
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-scale-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      <GlassCard
        className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg glass hover:glow-primary transition-all duration-300 z-10"
        >
          <X className="h-5 w-5" />
        </button>
        
        {content}
      </GlassCard>
    </div>
  );
};

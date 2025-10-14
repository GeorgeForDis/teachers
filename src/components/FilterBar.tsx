import { useState } from "react";
import { GlassCard } from "./GlassCard";
import { GlassInput } from "./GlassInput";
import { ChevronDown, Filter } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedSubject: string;
  onSubjectChange: (value: string) => void;
  categories: string[];
  subjects: string[];
}
export const FilterBar = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedSubject,
  onSubjectChange,
  categories,
  subjects
}: FilterBarProps) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const filterContent = <div className="grid grid-cols-1 gap-4">
      {/* Search */}
      <GlassInput placeholder="Поиск по имени..." value={searchQuery} onChange={onSearchChange} />
      
      {/* Category Filter */}
      <div className="relative">
        <select value={selectedCategory} onChange={e => onCategoryChange(e.target.value)} className="glass w-full rounded-xl px-4 py-3 pr-10 appearance-none cursor-pointer text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300">
          <option value="">Все категории</option>
          {categories.map(category => <option key={category} value={category}>
              {category}
            </option>)}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
      </div>
      
      {/* Subject Filter */}
      <div className="relative">
        
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
      </div>
    </div>;

  // Mobile: Floating button with bottom sheet
  if (isMobile) {
    return <>
        <div className="mb-6">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="glass px-6 py-3 rounded-full flex items-center gap-2 shadow-lg hover:glow-primary transition-all duration-300 mx-auto">
                <Filter className="h-5 w-5" />
                <span className="font-medium">Фильтры</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="glass border-t border-white/20">
              <SheetHeader>
                <SheetTitle className="text-foreground">Фильтры поиска</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4 pb-6">
                {filterContent}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </>;
  }

  // Desktop: Full filter bar
  return <GlassCard className="mb-8">
      {filterContent}
    </GlassCard>;
};
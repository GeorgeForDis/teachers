import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Hero } from "@/components/Hero";
import { FilterBar } from "@/components/FilterBar";
import { TeacherCard } from "@/components/TeacherCard";
import { TeacherModal } from "@/components/TeacherModal";
import { GlassCard } from "@/components/GlassCard";
import { useTeachers, Teacher } from "@/hooks/useTeachers";
import { useAuth } from "@/hooks/useAuth";
import { LogIn, LayoutDashboard, LogOut } from "lucide-react";

const Index = () => {
  const { teachers, loading } = useTeachers();
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const categories = Array.from(new Set(teachers.flatMap(t => t.categories)));
  const subjects = Array.from(new Set(teachers.flatMap(t => t.subjects)));

  const filteredTeachers = teachers.filter(teacher => {
    const fullName = [teacher.last_name, teacher.first_name, teacher.middle_name].filter(Boolean).join(" ");
    const matchesSearch = fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || teacher.categories.includes(selectedCategory);
    const matchesSubject = !selectedSubject || teacher.subjects.includes(selectedSubject);
    return matchesSearch && matchesCategory && matchesSubject;
  });

  // Group teachers by their first category
  const groupedTeachers = filteredTeachers.reduce((acc, teacher) => {
    const category = teacher.categories[0] || "Без категории";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(teacher);
    return acc;
  }, {} as Record<string, Teacher[]>);

  return (
    <div className="min-h-screen bg-gradient-glass">
      {/* Top Navigation */}
      <div className="fixed top-4 right-4 z-40 flex gap-2">
        {user ? (
          <>
            {isAdmin && (
              <button
                onClick={() => navigate("/admin")}
                className="glass px-4 md:px-6 py-2 md:py-3 rounded-full flex items-center gap-2 shadow-lg hover:glow-primary transition-all duration-300"
              >
                <LayoutDashboard className="h-4 w-4 md:h-5 md:w-5" />
                <span className="hidden md:inline font-medium">Админ-панель</span>
              </button>
            )}
            <button
              onClick={signOut}
              className="glass px-4 md:px-6 py-2 md:py-3 rounded-full flex items-center gap-2 shadow-lg hover:glow-primary transition-all duration-300"
            >
              <LogOut className="h-4 w-4 md:h-5 md:w-5" />
              <span className="hidden md:inline font-medium">Выход</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate("/auth")}
            className="glass px-4 md:px-6 py-2 md:py-3 rounded-full flex items-center gap-2 shadow-lg hover:glow-primary transition-all duration-300"
          >
            <LogIn className="h-4 w-4 md:h-5 md:w-5" />
            <span className="font-medium">Вход</span>
          </button>
        )}
      </div>

      {/* Hero Section */}
      <Hero />

      {/* Content */}
      <div className="container mx-auto px-4 pb-16">
        {/* Filters */}
        <div className="max-w-6xl mx-auto mb-8">
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedSubject={selectedSubject}
            onSubjectChange={setSelectedSubject}
            categories={categories}
            subjects={subjects}
          />
        </div>

        {/* Teachers Grid by Categories */}
        {loading ? (
          <div className="text-center py-12">
            <GlassCard className="max-w-md mx-auto">
              <p className="text-muted-foreground">Загрузка...</p>
            </GlassCard>
          </div>
        ) : (
          <>
            {Object.entries(groupedTeachers).map(([category, categoryTeachers]) => (
              <div key={category} className="mb-12">
                {/* Category Header */}
                <div className="max-w-7xl mx-auto px-2 md:px-0 mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground glass inline-block px-6 py-3 rounded-full">
                    {category}
                  </h2>
                </div>
                
                {/* Divider */}
                <div className="max-w-7xl mx-auto px-2 md:px-0 mb-8">
                  <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                </div>
                
                {/* Grid of Teachers */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 max-w-7xl mx-auto px-2 md:px-0">
                  {categoryTeachers.map((teacher, index) => (
                    <TeacherCard
                      key={teacher.id}
                      teacher={teacher}
                      onClick={() => setSelectedTeacher(teacher)}
                      className="animate-scale-in"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    />
                  ))}
                </div>
              </div>
            ))}

            {filteredTeachers.length === 0 && (
              <div className="text-center py-12">
                <GlassCard className="max-w-md mx-auto">
                  <p className="text-muted-foreground">
                    Преподаватели не найдены. Попробуйте изменить параметры поиска.
                  </p>
                </GlassCard>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      <TeacherModal
        teacher={selectedTeacher}
        isOpen={selectedTeacher !== null}
        onClose={() => setSelectedTeacher(null)}
      />
    </div>
  );
};

export default Index;

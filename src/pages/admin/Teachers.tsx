import { useState } from "react";
import { useTeachers } from "@/hooks/useTeachers";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { TeacherForm } from "@/components/admin/TeacherForm";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { Teacher } from "@/hooks/useTeachers";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";


// Sortable Teacher Card component
const SortableTeacherCard = ({ 
  teacher, 
  onEdit, 
  onDelete 
}: { 
  teacher: Teacher; 
  onEdit: () => void; 
  onDelete: () => void; 
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ 
    id: teacher.id 
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <div ref={setNodeRef} style={style}>
      <GlassCard className="p-6">
        <div className="flex gap-4">
          {/* Drag handle */}
          <div 
            {...attributes} 
            {...listeners} 
            className="cursor-grab active:cursor-grabbing flex items-start pt-1"
          >
            <GripVertical className="w-5 h-5 text-muted-foreground" />
          </div>
          
          {/* Teacher content */}
          <div className="flex-1 flex gap-4">
            <img
              src={teacher.photo_url || "https://via.placeholder.com/100"}
              alt={teacher.first_name}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="font-bold text-foreground">
                {[teacher.last_name, teacher.first_name].join(" ")}
              </h3>
              <p className="text-sm text-muted-foreground">{teacher.position}</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <button
            onClick={onEdit}
            className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </GlassCard>
    </div>
  );
};

export default function Teachers() {
  const { teachers, loading, addTeacher, updateTeacher, deleteTeacher } = useTeachers();
  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | undefined>();

  const handleSave = async (data: Partial<Teacher>) => {
    if (editingTeacher) {
      await updateTeacher(editingTeacher.id, data);
    } else {
      await addTeacher(data as Omit<Teacher, "id" | "created_at" | "updated_at">);
    }
    setShowForm(false);
    setEditingTeacher(undefined);
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Удалить преподавателя?")) {
      await deleteTeacher(id);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;
    
    const oldIndex = teachers.findIndex(t => t.id === active.id);
    const newIndex = teachers.findIndex(t => t.id === over.id);
    
    const reorderedTeachers = arrayMove(teachers, oldIndex, newIndex);
    
    // Update order_index for all affected teachers
    const updates = reorderedTeachers.map((teacher, index) => 
      updateTeacher(teacher.id, { order_index: index })
    );
    
    await Promise.all(updates);
  };

  if (showForm) {
    return (
      <TeacherForm
        teacher={editingTeacher}
        allTeachers={teachers}
        onSave={handleSave}
        onCancel={() => {
          setShowForm(false);
          setEditingTeacher(undefined);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-foreground">Преподаватели</h2>
        <GlassButton onClick={() => setShowForm(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Добавить
        </GlassButton>
      </div>

      {loading ? (
        <GlassCard className="p-6 text-center">
          <p className="text-muted-foreground">Загрузка...</p>
        </GlassCard>
      ) : (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={teachers.map(t => t.id)} strategy={verticalListSortingStrategy}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachers.map((teacher) => (
                <SortableTeacherCard
                  key={teacher.id}
                  teacher={teacher}
                  onEdit={() => handleEdit(teacher)}
                  onDelete={() => handleDelete(teacher.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

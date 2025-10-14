import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  position: string;
  categories: string[];
  subjects: string[];
  bio?: string;
  photo_url?: string;
  contact_email?: string;
  contact_phone?: string;
  public: boolean;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

export const useTeachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("teachers")
        .select("*")
        .eq("public", true)
        .order("order_index", { ascending: true });

      if (error) throw error;
      setTeachers(data || []);
    } catch (error: any) {
      toast({
        title: "Ошибка загрузки",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addTeacher = async (teacher: Omit<Teacher, "id" | "created_at" | "updated_at">) => {
    try {
      const { error } = await supabase.from("teachers").insert([teacher]);
      if (error) throw error;
      
      toast({
        title: "Успех",
        description: "Преподаватель добавлен",
      });
      
      await fetchTeachers();
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateTeacher = async (id: string, updates: Partial<Teacher>) => {
    try {
      const { error } = await supabase
        .from("teachers")
        .update(updates)
        .eq("id", id);
      
      if (error) throw error;
      
      toast({
        title: "Успех",
        description: "Данные обновлены",
      });
      
      await fetchTeachers();
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteTeacher = async (id: string) => {
    try {
      const { error } = await supabase
        .from("teachers")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      
      toast({
        title: "Успех",
        description: "Преподаватель удален",
      });
      
      await fetchTeachers();
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchTeachers();

    // Set up realtime subscription
    const channel = supabase
      .channel("teachers-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "teachers",
        },
        () => {
          fetchTeachers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    teachers,
    loading,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    refetch: fetchTeachers,
  };
};

// Helper functions to get unique categories and subjects
export const getAllCategories = (teachers: Teacher[]): string[] => {
  const categories = new Set<string>();
  teachers.forEach((teacher) => {
    teacher.categories?.forEach((cat) => categories.add(cat));
  });
  return Array.from(categories).sort();
};

export const getAllSubjects = (teachers: Teacher[]): string[] => {
  const subjects = new Set<string>();
  teachers.forEach((teacher) => {
    teacher.subjects?.forEach((subj) => subjects.add(subj));
  });
  return Array.from(subjects).sort();
};

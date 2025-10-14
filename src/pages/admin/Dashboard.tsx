import { useAuth } from "@/hooks/useAuth";
import { useTeachers } from "@/hooks/useTeachers";
import { GlassCard } from "@/components/GlassCard";
import { Users, Eye, CheckCircle } from "lucide-react";
export default function Dashboard() {
  const {
    user
  } = useAuth();
  const {
    teachers
  } = useTeachers();
  const stats = [{
    title: "Всего преподавателей",
    value: teachers.length,
    icon: Users,
    color: "text-primary"
  }, {
    title: "Опубликовано",
    value: teachers.filter(t => t.public).length,
    icon: CheckCircle,
    color: "text-green-500"
  }, {
    title: "Скрыто",
    value: teachers.filter(t => !t.public).length,
    icon: Eye,
    color: "text-orange-500"
  }];
  return <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Добро пожаловать!
        </h2>
        <p className="text-muted-foreground">
          {user?.email}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map(stat => <GlassCard key={stat.title} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-full bg-muted/20 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </GlassCard>)}
      </div>

      <GlassCard className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-4">
          Быстрый старт
        </h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            <span className="font-semibold text-foreground">1.</span> Перейдите в раздел "Преподаватели" для управления данными
          </p>
          <p>
            <span className="font-semibold text-foreground">2.</span> Используйте кнопку "Добавить преподавателя" для создания новой карточки
          </p>
          <p>
            <span className="font-semibold text-foreground">3.</span> Измените порядок карточек перетаскиванием
          </p>
          
        </div>
      </GlassCard>
    </div>;
}
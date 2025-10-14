import { useState } from "react";
import { Teacher, getAllCategories, getAllSubjects } from "@/hooks/useTeachers";
import { GlassCard } from "@/components/GlassCard";
import { GlassInput } from "@/components/GlassInput";
import { GlassButton } from "@/components/GlassButton";
import { ChevronRight, ChevronLeft, Upload, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { X } from "lucide-react";

interface TeacherFormProps {
  teacher?: Teacher;
  allTeachers: Teacher[];
  onSave: (data: Partial<Teacher>) => void;
  onCancel: () => void;
}

const STEPS = [
  { id: 1, title: "Фото", hint: "Загрузите вертикальное фото преподавателя" },
  { id: 2, title: "Основное", hint: "ФИО и должность" },
  { id: 3, title: "Предметы", hint: "Категории и предметы преподавания" },
  { id: 4, title: "Описание", hint: "Краткая биография и контакты" },
  { id: 5, title: "Предпросмотр", hint: "Проверьте данные перед сохранением" },
];

export function TeacherForm({ teacher, allTeachers, onSave, onCancel }: TeacherFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Teacher>>({
    first_name: teacher?.first_name || "",
    last_name: teacher?.last_name || "",
    middle_name: teacher?.middle_name || "",
    position: teacher?.position || "",
    categories: teacher?.categories || [],
    subjects: teacher?.subjects || [],
    bio: teacher?.bio || "",
    photo_url: teacher?.photo_url || "",
    contact_email: teacher?.contact_email || "",
    contact_phone: teacher?.contact_phone || "",
    public: teacher?.public ?? true,
    order_index: teacher?.order_index || 0,
  });

  const handleNext = () => {
    if (step < STEPS.length) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  const fullName = [formData.last_name, formData.first_name, formData.middle_name]
    .filter(Boolean)
    .join(" ");

  return (
    <GlassCard className="max-w-3xl mx-auto p-6">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {STEPS.map((s, idx) => (
            <div key={s.id} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  s.id === step
                    ? "bg-primary text-primary-foreground"
                    : s.id < step
                    ? "bg-primary/50 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {s.id < step ? <Check className="w-5 h-5" /> : s.id}
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={`w-8 h-1 mx-2 ${
                    s.id < step ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-foreground">
            {STEPS[step - 1].title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {STEPS[step - 1].hint}
          </p>
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[300px]">
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex flex-col items-center">
              {formData.photo_url ? (
                <div className="relative">
                  <img
                    src={formData.photo_url}
                    alt="Preview"
                    className="w-48 h-64 object-cover rounded-2xl"
                  />
                  <button
                    onClick={() => setFormData({ ...formData, photo_url: "" })}
                    className="absolute -top-2 -right-2 p-2 bg-destructive text-destructive-foreground rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="w-48 h-64 border-2 border-dashed border-muted rounded-2xl flex items-center justify-center">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
            </div>
            <GlassInput
              placeholder="URL фотографии"
              value={formData.photo_url}
              onChange={(value) =>
                setFormData({ ...formData, photo_url: value })
              }
              hideIcon
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <GlassInput
              placeholder="Фамилия *"
              value={formData.last_name}
              onChange={(value) =>
                setFormData({ ...formData, last_name: value })
              }
              hideIcon
            />
            <GlassInput
              placeholder="Имя *"
              value={formData.first_name}
              onChange={(value) =>
                setFormData({ ...formData, first_name: value })
              }
              hideIcon
            />
            <GlassInput
              placeholder="Отчество"
              value={formData.middle_name}
              onChange={(value) =>
                setFormData({ ...formData, middle_name: value })
              }
              hideIcon
            />
            <GlassInput
              placeholder="Должность *"
              value={formData.position}
              onChange={(value) =>
                setFormData({ ...formData, position: value })
              }
              hideIcon
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <Label className="mb-2 block">Категории</Label>
              <MultiSelect
                options={getAllCategories(allTeachers)}
                selected={formData.categories || []}
                onChange={(categories) =>
                  setFormData({ ...formData, categories })
                }
                placeholder="Выберите или добавьте категории"
                allowCreate={true}
              />
            </div>

            <div>
              <Label className="mb-2 block">Предметы</Label>
              <MultiSelect
                options={getAllSubjects(allTeachers)}
                selected={formData.subjects || []}
                onChange={(subjects) =>
                  setFormData({ ...formData, subjects })
                }
                placeholder="Выберите или добавьте предметы"
                allowCreate={true}
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Биография</Label>
              <Textarea
                placeholder="Краткая информация о преподавателе"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                rows={5}
                className="glass"
              />
            </div>
            <GlassInput
              placeholder="Email для связи"
              type="email"
              value={formData.contact_email}
              onChange={(value) =>
                setFormData({ ...formData, contact_email: value })
              }
              hideIcon
            />
            <GlassInput
              placeholder="Телефон для связи"
              value={formData.contact_phone}
              onChange={(value) =>
                setFormData({ ...formData, contact_phone: value })
              }
              hideIcon
            />
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between glass p-4 rounded-xl">
              <Label htmlFor="public">Опубликовать на сайте</Label>
              <Switch
                id="public"
                checked={formData.public}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, public: checked })
                }
              />
            </div>

            <GlassCard className="p-6">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-32 h-42 rounded-xl overflow-hidden">
                    <img
                      src={
                        formData.photo_url ||
                        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=533&fit=crop"
                      }
                      alt={fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">
                      {fullName}
                    </h3>
                    <p className="text-primary">{formData.position}</p>
                  </div>
                  {formData.categories && formData.categories.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-1">
                        Категории:
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formData.categories.join(", ")}
                      </p>
                    </div>
                  )}
                  {formData.subjects && formData.subjects.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-1">
                        Предметы:
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formData.subjects.join(", ")}
                      </p>
                    </div>
                  )}
                  {formData.bio && (
                    <p className="text-sm text-muted-foreground">
                      {formData.bio}
                    </p>
                  )}
                </div>
              </div>
            </GlassCard>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-6 border-t border-border/40">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={step === 1}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Назад
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Отмена
          </Button>
          {step < STEPS.length ? (
            <GlassButton onClick={handleNext} className="gap-2">
              Далее
              <ChevronRight className="w-4 h-4" />
            </GlassButton>
          ) : (
            <GlassButton onClick={handleSubmit} className="gap-2">
              <Check className="w-4 h-4" />
              Сохранить
            </GlassButton>
          )}
        </div>
      </div>
    </GlassCard>
  );
}

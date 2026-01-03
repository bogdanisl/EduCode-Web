// src/pages/EditCoursePage.tsx (рекомендую переименовать)
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../context/AuthProvider";
import NotFound from "../../notFound";
import { useNavigate, useParams } from "react-router-dom";
import type { Category } from "../../../types/interfaces/CourseCategory";
import type { Module } from "../../../types/interfaces/Module";
import CourseCurriculumEditor from "../components/LessonsEditor";
import { Plus } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;

interface Difficulty {
  id: number;
  title: string;
}

const DIFFICULTIES: Difficulty[] = [
  { id: 0, title: "beginner" },
  { id: 1, title: "intermediate" },
  { id: 2, title: "advanced" },
];

function ModuleCategory({ open, onClose, onSave, errors }: any) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 border border-white/20 rounded-xl p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold mb-2">{"Add new category"}</h2>
        <div className="space-y-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-white/5 p-2 rounded border border-white/10 outline-none"
            placeholder="Title"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white/5 p-2 rounded border border-white/10 outline-none h-24 resize-none"
            placeholder="Description"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}

        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="px-4 py-2 rounded bg-white/5 hover:bg-white/10">
            Cancel
          </button>
          <button onClick={() => onSave({ title, description })} className="px-4 py-2 rounded bg-green-600 hover:bg-green-700">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EditCoursePage() {
  const { role } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [modules, setModules] = useState<Partial<Module>[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryModalErrors, setCategoryModalErrors] = useState<{ title: string, description: string }>({ title: '', description: '' })

  // Data
  const [categories, setCategories] = useState<Category[]>([]);

  // UI
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Загрузка категорий + данных курса (если редактирование)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Загружаем категории
        const catRes = await fetch("/api/courses/category/list");
        if (!catRes.ok) throw new Error("Failed to load categories");
        const catData = await catRes.json();
        setCategories(catData.categories || []);

        // Если это редактирование — загружаем курс
        if (isEditMode) {
          const courseRes = await fetch(`/api/course/${id}`, {
            credentials: "include",
          });

          if (!courseRes.ok) {
            if (courseRes.status === 404) {
              setErrors({ general: "Course not found" });
            } else {
              throw new Error("Failed to load course");
            }
            return;
          }

          const { course } = await courseRes.json();

          setTitle(course.title || "");
          setDescription(course.description || "");
          setDifficulty(String(course.difficulty ?? ""));
          setCategoryId(String(course.categoryId ?? ""));
          setModules(course.modules || []);
          setImagePreview(`${API_URL}/assets/courses/covers/${course.id}.png`); // предполагается, что бэк возвращает URL
        }
      } catch (err) {
        setErrors({ general: "Failed to load data. Please try again." });
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [id, isEditMode]);

  // Обработчик изображения
  const handleImageChange = (file: File | undefined) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, image: "Please upload a valid image" }));
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: "Image must be under 10MB" }));
      return;
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleImageChange(file);
  };

  const handleAddCategory = async (data: any) => {
    if (!data.title || data.title == '') {
      setCategoryModalErrors({ title: "Title shoud be provided", description: categoryModalErrors.description })
      return;
    }
    if (!data.description || data.description == '') {
      setCategoryModalErrors({ title: categoryModalErrors.description, description: "Description should be provided" })
      return;
    }
    try {
      const res = await fetch(`/api/courses/category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: data.title, description: data.description }),
      });
      if (!res.ok) throw new Error();
      const added = await res.json();
      if (!added) throw new Error();
      categories.push(added)
      setCategoryId(added.id);
      setIsCategoryModalOpen(false);
    } catch {
      alert("Failed to add category");
    }
  }

  const clearImage = () => {
    setImage(null);
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Валидация и отправка
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");
    setSubmitting(true);

    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = "Title is required";
    if (description.trim() === "") newErrors.description = "Description is required";
    if (!difficulty) newErrors.difficulty = "Select difficulty level";
    if (!categoryId) newErrors.category = "Select a category";
    if (!imagePreview && !image) newErrors.image = "Course image is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("difficulty", difficulty);
    formData.append("categoryId", categoryId);
    formData.append("modules", JSON.stringify(modules));
    if (image) formData.append("cover", image);

    try {
      const url = isEditMode ? `/api/course/${id}` : "/api/course";
      const method = isEditMode ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const err: Record<string, string> = {};
        if (data.message) err.general = data.message;
        throw err;
      }

      setSuccess(`Course ${isEditMode ? "updated" : "created"} successfully!`);
      //setTimeout(() => navigate("/courses"), 1500);
    } catch (err: any) {
      setErrors(err.general ? { general: err.general } : { general: "Something went wrong" });
    } finally {
      setSubmitting(false);
    }
  };

  // Защита доступа
  if (role !== "admin") return <NotFound />;

  // Пока грузим
  if (loading) {
    return (
      <main className="flex-grow flex items-center justify-center">
        <div className="text-xl">Loading course data...</div>
      </main>
    );
  }

  return (
    <main className="flex-grow bg-background-light dark:bg-background-dark text-gray-800 dark:text-white">
      <div className="px-4 sm:px-10 md:px-20 lg:px-20 lg:px-40 py-10 md:py-16">
        <div className="mx-auto max-w-4xl space-y-12">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter">
              {isEditMode ? "Edit Course" : "Add New Course"}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {isEditMode
                ? "Update course details and curriculum."
                : "Fill out the form to create a new course."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Основная колонка */}
            <div className="md:col-span-2 space-y-8">
              {/* Информация о курсе */}
              <section className="space-y-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white/5 p-6">
                <h2 className="text-xl font-bold">Course Information</h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Course Title
                    </label>
                    <input
                      className={`mt-1 block w-full rounded-md border bg-background-light dark:bg-background-dark text-sm ${errors.title ? "border-red-500 animate-shake" : "border-gray-300 dark:border-white/20"
                        }`}
                      placeholder="e.g., Advanced React & TypeScript"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        errors.title && setErrors((p) => ({ ...p, title: "" }));
                      }}
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Description
                    </label>
                    <textarea
                      rows={5}
                      className={`mt-1 block w-full rounded-md border bg-background-light dark:bg-background-dark text-sm ${errors.description ? "border-red-500 animate-shake" : "border-gray-300 dark:border-white/20"
                        }`}
                      placeholder="Brief overview of what students will learn..."
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        errors.description && setErrors((p) => ({ ...p, description: "" }));
                      }}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                    )}
                  </div>
                </div>
              </section>

              {/* Редактор уроков */}
              <CourseCurriculumEditor modules={modules} setModules={setModules} />

              {/* Загрузка изображения */}
              <section className="space-y-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white/5 p-6">
                <h2 className="text-xl font-bold">Course Cover Image</h2>

                <div
                  className="relative border-2 border-dashed border-gray-300 dark:border-white/20 rounded-lg px-6 py-10 text-center"
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {imagePreview ? (
                    <div>
                      <img
                        src={imagePreview}
                        alt="Course cover preview"
                        className="mx-auto max-h-64 rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={clearImage}
                        className="mt-4 text-sm text-red-500 hover:underline"
                      >
                        Remove image
                      </button>
                    </div>
                  ) : (
                    <div>
                      <span className="material-symbols-outlined text-6xl text-gray-400">
                        image
                      </span>
                      <div className="mt-4">
                        <label
                          htmlFor="cover-upload"
                          className="cursor-pointer text-primary font-medium hover:text-primary/80"
                        >
                          Upload image
                          <input
                            ref={fileInputRef}
                            id="cover-upload"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(e) => handleImageChange(e.target.files?.[0])}
                          />
                        </label>
                        <span className="text-gray-500"> or drag and drop</span>
                      </div>
                      <p className="mt-2 text-xs text-gray-500">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </div>
                {errors.image && <p className="text-red-500 text-sm mt-2">{errors.image}</p>}
              </section>
            </div>

            {/* Правая колонка */}
            <div className="space-y-8">
              <section className="space-y-5 rounded-xl border border-gray-200 dark:border-white/10 bg-white/5 p-6">
                <h2 className="text-xl font-bold">Settings</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => {
                      setDifficulty(e.target.value);
                      console.log(e.target.value);
                      errors.difficulty && setErrors((p) => ({ ...p, difficulty: "" }));
                    }}
                    className={`mt-1 block w-full rounded-md border text-sm ${errors.difficulty
                      ? "border-red-500 animate-shake"
                      : "border-gray-300 dark:border-white/20"
                      } bg-background-light dark:bg-background-dark`}
                  >
                    <option value="">Choose level</option>
                    {DIFFICULTIES.map((d) => (
                      <option key={d.id} value={d.title}>
                        {d.title.charAt(0).toUpperCase() + d.title.slice(1)}
                      </option>
                    ))}
                  </select>
                  {errors.difficulty && (
                    <p className="text-red-500 text-sm mt-1">{errors.difficulty}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                    Category
                  </label>

                  <div className="mt-1 flex items-center gap-2">
                    <select
                      value={categoryId}
                      onChange={(e) => {
                        setCategoryId(e.target.value);
                        errors.category && setErrors((p) => ({ ...p, category: "" }));
                      }}
                      className={`flex-1 rounded-md border text-sm
        ${errors.category
                          ? "border-red-500 animate-shake"
                          : "border-gray-300 dark:border-white/20"}
        bg-background-light dark:bg-background-dark
      `}
                    >
                      <option value="">Select category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition"
                      title="Add category"
                      onClick={() => setIsCategoryModalOpen(!isCategoryModalOpen)}
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                  )}
                </div>
              </section>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-12 rounded-lg bg-primary font-bold text-white hover:bg-primary/90 disabled:opacity-70 transition"
              >
                {submitting ? "Saving..." : isEditMode ? "Update Course" : "Create Course"}
              </button>

              {errors.general && (
                <p className="text-center text-red-500 font-medium">{errors.general}</p>
              )}
              {success && (
                <p className="text-center text-green-500 font-medium">{success}</p>
              )}
            </div>
          </form>
        </div>
      </div>
      <ModuleCategory open={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} onSave={handleAddCategory} errors={categoryModalErrors} />
    </main>
  );
}
// src/pages/admin/hooks/useCourseForm.ts
import { useEffect, useState } from "react";
import type { Category } from "../../../types/courseCategory";
import type { Module } from "../../../types/module";

interface UseCourseFormParams {
  courseId?: string;
  isEditMode: boolean;
  setTitle: (v: string) => void;
  setDescription: (v: string) => void;
  setDifficulty: (v: string) => void;
  setCategoryId: (v: string) => void;
  setModules: (v: Partial<Module>[]) => void;
  setAutorID: (v: number | null) => void;
  setImagePreview: (v: string) => void;
}

const API_URL = import.meta.env.VITE_API_URL;

export function useCourseForm({
  courseId,
  isEditMode,
  setTitle,
  setDescription,
  setDifficulty,
  setCategoryId,
  setModules,
  setAutorID,
  setImagePreview,
}: UseCourseFormParams) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Pobieranie kategorii
        const catRes = await fetch("/api/courses/category/list");
        if (!catRes.ok) throw new Error("Failed to load categories");

        const catData = await catRes.json();
        setCategories(catData.categories ?? []);

        // Pobieranie kursu (tryb edycji)
        if (isEditMode && courseId) {
          const courseRes = await fetch(`/api/course/${courseId}`, {
            credentials: "include",
          });

          if (!courseRes.ok) {
            if (courseRes.status === 404) {
              throw new Error("Course not found");
            }
            throw new Error("Failed to load course");
          }

          const { course } = await courseRes.json();

          setTitle(course.title ?? "");
          setDescription(course.description ?? "");
          setDifficulty(String(course.difficulty ?? ""));
          setCategoryId(String(course.categoryId ?? ""));
          setAutorID(course.createdBy ?? null);
          setModules(course.modules ?? []);
          setImagePreview(
            `${API_URL}/assets/courses/covers/${course.id}.png`
          );
        }
      } catch (err: any) {
        setError(err.message ?? "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, isEditMode]);

  return {
    categories,
    loading,
    error,
  };
}

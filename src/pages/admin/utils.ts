export function validateCourseImport(data: any) {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid JSON structure");
  }

  if (!data.title || !data.modules) {
    throw new Error("Course must have title and modules");
  }

  if (!Array.isArray(data.modules)) {
    throw new Error("Modules must be an array");
  }
  return data;
}

function generateId() {
  return Date.now() + Math.floor(Math.random() * 10000);
}

export function normalizeImportedCourse(course: any) {
  return {
    ...course,
    id: generateId(),
    modules: course.modules.map((m: any, mIndex: number) => ({
      ...m,
      id: generateId(),
      order: mIndex,
      lessons: (m.lessons || []).map((l: any, lIndex: number) => ({
        ...l,
        id: generateId(),
        order: lIndex,
        tasks: (l.tasks || []).map((t: any, tIndex: number) => ({
          ...t,
          id: generateId(),
          order: tIndex,
          options: (t.options || []).map((o: any, oIndex: number) => ({
            ...o,
            text: o.text || "",
            id: generateId(),
            order: oIndex,
            isCorrect: Boolean(o.isCorrect),
          })),
        })),
      })),
    })),
  };
}

export const formatDate = (timestamp: number) =>
  timestamp ? new Date(timestamp * 1000).toLocaleString() : "—";
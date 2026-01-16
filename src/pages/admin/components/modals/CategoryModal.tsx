// src/pages/admin/courses/components/CategoryModal.tsx
import { useState } from "react";

interface CategoryModalErrors {
  title?: string;
  description?: string;
}

interface CategoryModalProps {
  open: boolean;
  errors: CategoryModalErrors;
  onClose: () => void;
  onSave: (data: { title: string; description: string }) => void;
}

export default function CategoryModal({
  open,
  errors,
  onClose,
  onSave,
}: CategoryModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-xl border border-white/20 bg-white/10 p-6 space-y-4">
        <h2 className="text-xl font-bold">Add new category</h2>

        <div className="space-y-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full rounded border border-white/10 bg-white/5 p-2 outline-none"
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title}</p>
          )}

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="h-24 w-full resize-none rounded border border-white/10 bg-white/5 p-2 outline-none"
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded bg-white/5 px-4 py-2 hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave({ title, description })}
            className="rounded bg-green-600 px-4 py-2 hover:bg-green-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

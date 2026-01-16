// src/pages/CreateArticlePage.tsx
import { useState, useRef } from "react";

import MDEditor from "@uiw/react-md-editor";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../../../context/AuthProvider";
import NotFound from "../../NotFoundPage";

export default function CreateArticlePage() {
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [cover, setCover] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user || user.role !== "admin") return <NotFound />;

  const handleCoverChange = (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, cover: "Please upload a valid image" }));
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, cover: "Image must be under 10MB" }));
      return;
    }

    setCover(file);
    setCoverPreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, cover: "" }));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files[0]) handleCoverChange(e.dataTransfer.files[0]);
  };

  const clearCover = () => {
    setCover(null);
    setCoverPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");
    setSubmitting(true);

    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!content.trim()) newErrors.content = "Content is required";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      setSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subtitle", subtitle);
    formData.append("content", content);
    if (cover) formData.append("cover", cover);

    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        const err: Record<string, string> = {};
        switch (data.code) {
          case "INVALID_TITLE":
            err.title = data.message;
            break;
          case "INVALID_CONTENT":
            err.content = data.message;
            break;
          case "INVALID_FILE":
            err.cover = Array.isArray(data.message) ? data.message.join(", ") : data.message;
            break;
          default:
            err.general = data.message || "Something went wrong";
        }
        setErrors(err);
        return;
      }

      setSuccess(data.message);
      toast.success(data.message, { theme: "dark" });
      setTitle("");
      setSubtitle("");
      setContent("");
      clearCover();
    } catch {
      setErrors({ general: "Network error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex-grow bg-background-light dark:bg-background-dark text-gray-800 dark:text-white min-h-screen">
      <div className="px-4 sm:px-10 md:px-20 lg:px-40 py-10 md:py-16">
        <div className="mx-auto max-w-3xl space-y-12">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter">Create New Article</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Fill out the form to create a new article.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title & Subtitle */}
            <section className="space-y-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-bold">Article Information</h2>

              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Title
                </label>
                <input
                  className={`mt-1 block w-full rounded-md border bg-background-light dark:bg-background-dark text-sm ${errors.title ? "border-red-500 animate-shake" : "border-gray-300 dark:border-white/20"}`}
                  placeholder="Article title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors((p) => ({ ...p, title: "" }));
                  }}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Subtitle (optional)
                </label>
                <input
                  className="mt-1 block w-full rounded-md border bg-background-light dark:bg-background-dark text-sm border-gray-300 dark:border-white/20"
                  placeholder="Article subtitle"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                />
              </div>
            </section>

            {/* Content */}
            <section className="rounded-xl border border-gray-200 dark:border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-bold mb-2">Content</h2>
              <MDEditor
                value={content}
                onChange={(v) => setContent(v || "")}
                height={300}
                className={`${errors.content ? "border-red-500" : ""} rounded-lg overflow-hidden`}
              />
              {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
            </section>

            {/* Cover Image */}
            <section className="rounded-xl border border-gray-200 dark:border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-bold mb-2">Cover Image</h2>
              <div
                className="relative border-2 border-dashed border-gray-300 dark:border-white/20 rounded-lg px-6 py-10 text-center"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                {coverPreview ? (
                  <div>
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="mx-auto max-h-64 rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={clearCover}
                      className="mt-4 text-sm text-red-500 hover:underline"
                    >
                      Remove image
                    </button>
                  </div>
                ) : (
                  <div>
                    <span className="material-symbols-outlined text-6xl text-gray-400">image</span>
                    <div className="mt-4">
                      <label
                        htmlFor="cover-upload"
                        className="cursor-pointer text-primary font-medium hover:text-primary/80"
                      >
                        Upload image
                        <input
                          id="cover-upload"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          ref={fileInputRef}
                          onChange={(e) => handleCoverChange(e.target.files?.[0])}
                        />
                      </label>
                      <span className="text-gray-500"> or drag and drop</span>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                )}
                {errors.cover && <p className="text-red-500 text-sm mt-2">{errors.cover}</p>}
              </div>
            </section>

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-12 rounded-lg bg-primary font-bold text-white hover:bg-primary/90 disabled:opacity-70 transition"
            >
              {submitting ? "Creating..." : "Create Article"}
            </button>

            {errors.general && (
              <p className="text-center text-red-500 font-medium">{errors.general}</p>
            )}
            {success && (
              <p className="text-center text-green-500 font-medium">{success}</p>
            )}
          </form>
        </div>
      </div>

      <ToastContainer />
    </main>
  );
}

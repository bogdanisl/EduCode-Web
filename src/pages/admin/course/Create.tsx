// src/pages/AddCoursePage.tsx
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../context/AuthProvider";
import NotFound from "../../notFound";
import { useNavigate } from "react-router-dom";
import type { Category } from "../../../types/interfaces/CourseCategory";
import CourseCurriculumEditor from "../components/LessonsEditor";



export default function AddCoursePage() {
  const { role } = useAuth();
  const navigate = useNavigate();

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Data
  const difficulties = [{
    id: 0,
    title: 'begginer'
  }, {
    id: 1,
    title: 'intermediate'
  }, {
    id: 2,
    title: 'advanced'
  }]
  const [categories, setCategories] = useState<Category[]>([]);

  // UI State
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch difficulties and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await fetch('/api/course/category',{
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        if (!catRes.ok) throw new Error("Failed to load data");
        const catData = await catRes.json();
        setCategories(catData.categories || []);
      } catch (err) {
        setErrors({ general: "Failed to load course options. Please try again." });
      }
    };

    fetchData();
  }, []);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors({ ...errors, image: "Please upload a valid image" });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrors({ ...errors, image: "Image must be under 10MB" });
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors({ ...errors, image: "" });
  };

  // Handle drag & drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const fakeEvent = { target: { files: [file] } } as any;
      handleImageChange(fakeEvent);
    }
  };

  // Clear error on input
  const handleChange = (field: string, value: string, setter: (v: string) => void) => {
    setter(value);
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess("");

    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!difficulty) newErrors.difficulty = "Please select difficulty";
    if (!category) newErrors.category = "Please select category";
    if (!price || isNaN(Number(price)) || Number(price) < 0)
      newErrors.price = "Enter a valid price";
    if (!image) newErrors.image = "Course image is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("difficultyId", difficulty);
    formData.append("categoryId", category);
    if (image) formData.append("cover", image);

    try {
      const response = await fetch("/api/course", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        const err: { [key: string]: string } = {};
        if (data.code === "TITLE_REQUIRED") err.title = data.message;
        else if (data.code === "INVALID_PRICE") err.price = data.message;
        else if (data.code === "IMAGE_REQUIRED") err.image = data.message;
        else err.general = data.message || "Failed to create course";
        throw err;
      }

      setSuccess("Course created successfully!");
      // Reset form
      setTitle("");
      setDescription("");
      setDifficulty("");
      setCategory("");
      setPrice("");
      setImage(null);
      setImagePreview("");
      if (fileInputRef.current) fileInputRef.current.value = "";

      setTimeout(() => navigate("/courses"), 1500);
    } catch (err: any) {
      setErrors(err);
    } finally {
      setLoading(false);
    }
  };

  if (role !== "admin") return <NotFound />;

  return (
    <main className="flex-grow bg-background-light dark:bg-background-dark text-gray-800 dark:text-white">
      <div className="px-4 sm:px-10 md:px-20 lg:px-40 py-10 md:py-16">
        <div className="mx-auto max-w-4xl space-y-12">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter">Add New Course</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Fill out the details below to create a new course offering.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Left Column */}
            <div className="md:col-span-2 space-y-8">
              {/* Course Info */}
              <div className="space-y-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white/5 p-6">
                <h2 className="text-xl font-bold">Course Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Course Title
                    </label>
                    <input
                      className={`form-input mt-1 block w-full rounded-md border bg-background-light dark:bg-background-dark text-sm ${errors.title ? "border-red-500 animate-shake" : ""
                        }`}
                      placeholder="e.g., Advanced JavaScript"
                      value={title}
                      onChange={(e) => handleChange("title", e.target.value, setTitle)}
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Description
                    </label>
                    <textarea
                      className={`form-input mt-1 block w-full rounded-md border bg-background-light dark:bg-background-dark text-sm ${errors.description ? "border-red-500 animate-shake" : ""
                        }`}
                      placeholder="A brief summary..."
                      rows={4}
                      value={description}
                      onChange={(e) => handleChange("description", e.target.value, setDescription)}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                    )}
                  </div>
                </div>
              </div>

              <CourseCurriculumEditor/>

              {/* Course Media */}
              <div className="space-y-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white/5 p-6">
                <h2 className="text-xl font-bold">Course Image</h2>
                <div
                  className="mt-1 flex justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-white/20 px-6 py-10 relative"
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {imagePreview ? (
                    <div className="text-center">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mx-auto h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImage(null);
                          setImagePreview("");
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="mt-2 text-sm text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <span className="material-symbols-outlined text-5xl text-gray-500">
                        upload_file
                      </span>
                      <div className="mt-4 flex text-sm leading-6 text-gray-400">
                        <label
                          className="relative cursor-pointer rounded-md font-semibold text-primary hover:text-primary/80"
                          htmlFor="file-upload"
                        >
                          <span>Upload a file</span>
                          <input
                            ref={fileInputRef}
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleImageChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </div>
                {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
              </div>
            </div>

            {/* Right Column */}
            <div className="md:col-span-1 space-y-8">
              <div className="space-y-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white/5 p-6">
                <h2 className="text-xl font-bold">Configuration</h2>

                {/* Difficulty */}
                <div>
                  <label className="text-sm font-medium  text-gray-600 dark:text-gray-300">
                    Difficulty
                  </label>
                  <select
                    className={`form-select mt-1 block w-full rounded-md bg-background-light dark:bg-background-dark border text-sm ${errors.difficulty ? "border-red-500 animate-shake" : ""
                      }`}
                    value={difficulty}
                    onChange={(e) => handleChange("difficulty", e.target.value, setDifficulty)}
                  >
                    <option value="">Select difficulty</option>
                    {difficulties.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.title}
                      </option>
                    ))}
                  </select>
                  {errors.difficulty && (
                    <p className="text-red-500 text-sm mt-1">{errors.difficulty}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Category
                  </label>
                  <select
                    className={`form-select bg-background-light dark:bg-background-dark mt-1 block w-full rounded-md border text-sm ${errors.category ? "border-red-500 animate-shake" : ""
                      }`}
                    value={category}
                    onChange={(e) => handleChange("category", e.target.value, setCategory)}
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                  )}
                </div>

                {/* Price */}
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Price ($)
                  </label>
                  <input
                    className={`form-input mt-1 bg-background-light dark:bg-background-dark block w-full rounded-md border text-sm ${errors.price ? "border-red-500 animate-shake" : ""
                      }`}
                    placeholder="99.00"
                    value={price}
                    onChange={(e) => handleChange("price", e.target.value, setPrice)}
                  />
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 px-4 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-70"
              >
                {loading ? "Creating..." : "Save Course"}
              </button>

              {errors.general && (
                <p className="text-red-500 text-center font-medium">{errors.general}</p>
              )}
              {success && (
                <p className="text-green-400 text-center font-medium">{success}</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
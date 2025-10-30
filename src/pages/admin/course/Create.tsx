import { useAuth } from "../../../context/AuthProvider";
import NotFound from "../../notFound";

// src/pages/AddCoursePage.tsx
export default function AddCoursePage() {
    const { role } = useAuth();
    if(role !== 'admin') return <NotFound/>

  return (
    <main className="flex-grow bg-background-light dark:bg-background-dark text-gray-800 dark:text-white">
      <div className="px-4 sm:px-10 md:px-20 lg:px-40 py-10 md:py-16">
        <div className="mx-auto max-w-4xl space-y-12">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter">Add New Course</h1>
            <p className="text-gray-500 dark:text-gray-400">Fill out the details below to create a new course offering on the platform.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Left Column: Course Information, Curriculum, Media */}
            <div className="md:col-span-2 space-y-8">
              {/* Course Information */}
              <div className="space-y-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white/5 p-6">
                <h2 className="text-xl font-bold">Course Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300" htmlFor="course-title">
                      Course Title
                    </label>
                    <input
                      className="form-input mt-1 block w-full rounded-md border text-sm"
                      id="course-title"
                      placeholder="e.g., Advanced JavaScript"
                      type="text"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300" htmlFor="course-description">
                      Description
                    </label>
                    <textarea
                      className="form-input mt-1 block w-full rounded-md border text-sm"
                      id="course-description"
                      placeholder="A brief summary of the course..."
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              {/* Curriculum Details */}
              <div className="space-y-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white/5 p-6">
                <h2 className="text-xl font-bold">Curriculum Details</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-lg bg-gray-100 dark:bg-black/20 p-3">
                    <span className="material-symbols-outlined text-gray-400">drag_indicator</span>
                    <input
                      className="form-input flex-grow rounded-md border bg-transparent p-2 text-sm"
                      placeholder="Module 1: Introduction"
                      type="text"
                    />
                    <button className="text-gray-400 hover:text-red-500 transition-colors">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-gray-100 dark:bg-black/20 p-3">
                    <span className="material-symbols-outlined text-gray-400">drag_indicator</span>
                    <input
                      className="form-input flex-grow rounded-md border bg-transparent p-2 text-sm"
                      placeholder="Module 2: Core Concepts"
                      type="text"
                    />
                    <button className="text-gray-400 hover:text-red-500 transition-colors">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                  <button className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 dark:border-white/20 py-3 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-800 dark:hover:text-white transition-colors">
                    <span className="material-symbols-outlined">add_circle</span>
                    <span>Add Module</span>
                  </button>
                </div>
              </div>

              {/* Course Media */}
              <div className="space-y-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white/5 p-6">
                <h2 className="text-xl font-bold">Course Media</h2>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Course Image</label>
                  <div className="mt-1 flex justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-white/20 px-6 py-10">
                    <div className="text-center">
                      <span className="material-symbols-outlined text-5xl text-gray-500">upload_file</span>
                      <div className="mt-4 flex text-sm leading-6 text-gray-400">
                        <label
                          className="relative cursor-pointer rounded-md font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary/80 focus-within:ring-offset-2 focus-within:ring-offset-background-dark hover:text-primary/80"
                          htmlFor="file-upload"
                        >
                          <span>Upload a file</span>
                          <input className="sr-only" id="file-upload" name="file-upload" type="file" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Configuration + Save Button */}
            <div className="md:col-span-1 space-y-8">
              {/* Configuration */}
              <div className="space-y-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white/5 p-6">
                <h2 className="text-xl font-bold">Configuration</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300" htmlFor="instructor">
                      Assign Instructor
                    </label>
                    <select className="form-select mt-1 block w-full rounded-md border text-sm" id="instructor">
                      <option>Select an instructor</option>
                      <option>Dr. Evelyn Reed</option>
                      <option>John Smith</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300" htmlFor="price">
                      Pricing ($)
                    </label>
                    <input
                      className="form-input mt-1 block w-full rounded-md border text-sm"
                      id="price"
                      placeholder="99.00"
                      type="text"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <button className="w-full flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors">
                <span className="truncate">Save Course</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
import { useEffect, useState } from "react";
import type { Category } from "../../../types/courseCategory";

interface FiltersSidebarProps {
  apply: (
    categories?: number[],
    difficulty?: string[],
    searchText?: string
  ) => void;
}

export default function FiltersSidebar({ apply }: FiltersSidebarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`/api/courses/category/list`);
        const data = await response.json();
        setCategories(data.categories || []);
      } catch (err) {
        console.error("Fetch category error:", err);
      }
    };

    fetchCategories();
  }, []);

  const toggleCategory = (id: number) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleDifficulty = (level: string) => {
    setSelectedDifficulty((prev) =>
      prev.includes(level) ? prev.filter((d) => d !== level) : [...prev, level]
    );
  };

  const handleApply = () => {
    apply(selectedCategories, selectedDifficulty, searchText);
  };

  const handleReset = () => {
    setSelectedCategories([]);
    setSelectedDifficulty([]);
    setSearchText("");
    apply([], [], "");
  };

  return (
    <aside className="w-full lg:w-64 xl:w-72 flex-shrink-0">
      <div className="flex flex-col gap-4 bg-[#F6F7F8] dark:bg-gray-800/50 rounded-xl p-4">
        <h2 className="text-gray-900 dark:text-white text-lg font-bold">Filters</h2>

        {/* Search */}
        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search courses..."
          className="h-11 rounded-lg bg-gray-100/50 dark:bg-gray-700/50 text-gray-900 dark:text-white px-4 outline-none focus:ring-2 focus:ring-primary/50"
        />

        {/* Categories */}
        <div className="border-t border-gray-300/20 dark:border-gray-500/20 pt-4">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Topic</h3>
          {categories.map((category) => (
            <label key={category.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-400/50 dark:border-gray-500/50 bg-transparent text-primary"
                checked={selectedCategories.includes(Number(category.id))}
                onChange={() => toggleCategory(Number(category.id))}
              />
              <span className="text-gray-700 dark:text-gray-300">{category.name}</span>
            </label>
          ))}
        </div>

        {/* Difficulty */}
        <div className="border-t border-gray-300/20 dark:border-gray-500/20 pt-4">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Difficulty</h3>
          {[
            { label: "Beginner", value: 1 },
            { label: "Intermediate", value: 2 },
            { label: "Advanced", value: 3 },
          ].map((level) => (
            <label key={level.value} className="flex items-center gap-2">
              <input
                className="h-4 w-4 rounded border-gray-400/50 dark:border-gray-500/50 bg-transparent text-primary"
                type="checkbox"
                checked={selectedDifficulty.includes(level.label.toLowerCase())}
                onChange={() => toggleDifficulty(level.label.toLowerCase())}
              />
              <span className="text-gray-700 dark:text-gray-300">{level.label}</span>
            </label>
          ))}
        </div>

        {/* Buttons */}
        <div className="border-t border-gray-300/20 dark:border-gray-500/20 pt-4 flex flex-col gap-2">
          <button
            onClick={handleApply}
            className="h-10 rounded-lg bg-primary text-white font-bold hover:bg-primary/90"
          >
            Apply Filters
          </button>

          <button
            onClick={handleReset}
            className="h-10 rounded-lg bg-gray-200/20 dark:bg-gray-700/30 text-gray-900 dark:text-white hover:bg-gray-300/30 dark:hover:bg-gray-600/30"
          >
            Reset
          </button>
        </div>
      </div>
    </aside>
  );
}

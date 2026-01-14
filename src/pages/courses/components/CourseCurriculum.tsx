// src/components/CourseCurriculum.tsx
import { useState } from "react";
import type { Module } from "../../../types/Module";

interface CourseCurriculumProps {
  modules: Module[];
}

export default function CourseCurriculum({ modules }: CourseCurriculumProps) {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>
      <div className="space-y-3">
        {modules.map((module, i) => {
          const isOpen = openId === module.id;

          return (
            <div
              key={module.id}
              className="border border-white/10 rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm"
            >
              {/* Header */}
              <button
                onClick={() => setOpenId(isOpen ? null : module.id)}
                className="w-full p-4 flex justify-between items-center text-left hover:bg-white/10 transition-colors"
              >
                <h3 className="font-semibold">
                  Module {i + 1}: {module.title}
                </h3>
                <span
                  className="material-symbols-outlined text-gray-400 transition-transform duration-300 ease-in-out"
                  style={{
                    transform: `rotate(${isOpen ? -180 : 0}deg)`,
                  }}
                >
                  expand_more
                </span>
              </button>

              {/* Animated content */}
              <div
                className={`transition-all duration-700 ease-[cubic-bezier(0, 0, 1,0.5)] overflow-hidden ${
                  isOpen ? "max-h-[500px]" : "max-h-0"
                }`}
              >
                <div
                  className={`p-4 space-y-2 border-t border-white/10 transform transition-all duration-500 ${
                    isOpen
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-4"
                  }`}
                >
                  {module.lessons.length > 0 ? (
                    module.lessons
                      .sort((a, b) => a.order! - b.order!)
                      .map((lesson, index) => (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-2 text-sm text-gray-300 pl-4 transition-all duration-500"
                          style={{
                            transitionDelay: `${index * 60}ms`,
                            opacity: isOpen ? 1 : 0,
                            transform: `translateY(${isOpen ? 0 : 6}px)`,
                          }}
                        >
                          <span className="material-symbols-outlined text-xs text-green-400">
                            check
                          </span>
                          <span>{lesson.title}</span>
                        </div>
                      ))
                  ) : (
                    <p className="text-sm text-gray-500 italic pl-4">
                      No lessons in this module
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

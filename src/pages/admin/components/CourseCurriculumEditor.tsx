import { useState, useRef, useEffect, type JSX } from "react";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { motion, Reorder } from "framer-motion";

interface ModuleItem {
  id: number;
  title: string;
  isOpen: boolean;
  lessons?: { id: number; title: string; order?: number }[];
}

export default function CourseCurriculumEditor(): JSX.Element {
  const [modules, setModules] = useState<ModuleItem[]>([
    { id: 1, title: "First module", isOpen: true, lessons: [] },
    { id: 2, title: "Second module (example)", isOpen: false, lessons: [] },
  ]);

  // Fix: type the refs as a record keyed by module id -> input element | null
  const inputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  // Focus on newly created module (or reasonable next one after delete)
  useEffect(() => {
    const last = modules[modules.length - 1];
    if (last && inputRefs.current[last.id]) {
      inputRefs.current[last.id]?.focus();
      // move caret to end
      const el = inputRefs.current[last.id];
      if (el) {
        const len = el.value.length;
        el.setSelectionRange(len, len);
      }
    }
  }, [modules.length]);

  const addModule = () => {
    const newModule: ModuleItem = {
      id: Date.now(),
      title: "",
      isOpen: true,
      lessons: [],
    };
    setModules((prev) => [...prev, newModule]);
  };

  const updateTitle = (id: number, value: string) => {
    setModules((prev) => prev.map((m) => (m.id === id ? { ...m, title: value } : m)));
  };

  const toggleOpen = (id: number) => {
    setModules((prev) => prev.map((m) => (m.id === id ? { ...m, isOpen: !m.isOpen } : m)));
  };

  const deleteModule = (id: number) => {
    // Ensure at least one module remains
    setModules((prev) => {
      if (prev.length <= 1) return prev; // don't delete
      const idx = prev.findIndex((m) => m.id === id);
      const next = prev.filter((m) => m.id !== id);
      // after deleting, try to focus the module at same index or previous
      const focusIndex = Math.min(Math.max(0, idx), next.length - 1);
      // schedule focus in next tick
      setTimeout(() => {
        const m = next[focusIndex];
        if (m && inputRefs.current[m.id]) inputRefs.current[m.id]?.focus();
      }, 50);
      return next;
    });
  };

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Course Curriculum (Editable)</h2>

      <div className="flex justify-end">
        <button
          onClick={addModule}
          className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition"
        >
          <Plus size={18} /> Add Module
        </button>
      </div>

      <Reorder.Group axis="y" values={modules} onReorder={(v) => setModules(v)} className="space-y-3">
        {modules.map((module, i) => (
          <Reorder.Item key={module.id} value={module}>
            <div className="border border-white/10 rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm">
              {/* Header */}
              <div className="flex items-center">
                <div className="cursor-grab p-3 text-gray-400">
                  <GripVertical size={18} />
                </div>

                <button
                  onClick={() => toggleOpen(module.id)}
                  className="flex-1 p-4 flex justify-between items-center text-left hover:bg-white/10 transition-colors"
                >
                  <input
                    ref={(el) => {(inputRefs.current[module.id] = el)}}
                    value={module.title}
                    onChange={(e) => updateTitle(module.id, e.target.value)}
                    placeholder={`Module ${i + 1} title...`}
                    className="bg-transparent outline-none font-semibold w-full"
                  />

                  <span
                    className="material-symbols-outlined text-gray-400 transition-transform duration-300 ease-in-out"
                    style={{ transform: `rotate(${module.isOpen ? -180 : 0}deg)` }}
                  >
                    expand_more
                  </span>
                </button>

                <div className="pr-3">
                  <button
                    onClick={() => deleteModule(module.id)}
                    disabled={modules.length <= 1}
                    title={modules.length <= 1 ? "At least one module required" : "Delete module"}
                    className="p-2 rounded hover:bg-white/5 disabled:opacity-40 text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Animated content */}
              <motion.div initial={false} animate={{ height: module.isOpen ? "auto" : 0 }} className="overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: module.isOpen ? 1 : 0, y: module.isOpen ? 0 : -10 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 border-t border-white/10 text-sm text-gray-300"
                >
                                      
                </motion.div>
              </motion.div>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </section>
  );
}

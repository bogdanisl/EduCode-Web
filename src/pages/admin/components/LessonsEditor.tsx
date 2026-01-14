import { useState, type JSX } from "react";
import { GripVertical, Plus, Pencil, Trash2 } from "lucide-react";
import { motion, Reorder } from "framer-motion";
import type { Module } from "../../../types/module";
import ModuleModal from "./modals/ModuleModal";
import LessonModal from "./modals/LessonModal";
import ItemModal from "./modals/ItemModal";

export default function CourseCurriculumEditor({
    modules,
    setModules
}: {
    modules: Partial<Module>[];
    setModules: React.Dispatch<React.SetStateAction<Partial<Module>[]>>;
}): JSX.Element {

    const [openId, setOpenId] = useState<number>();
    const [lessonOpenId, setLessonOpenId] = useState<number>();

    // module modal
    const [editModuleData, setEditModuleData] = useState<any>(null);
    const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);

    // lesson modal
    const [modalLessonModuleId, setModalLessonModuleId] = useState<number | null>(null);
    const [editLessonData, setEditLessonData] = useState<any>(null);
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);

    // assignment modal
    const [modalAssignmentModuleId, setModalAssignmentModuleId] = useState<number | null>(null);
    const [modalAssignmentLessonId, setModalAssignmentLessonId] = useState<number | null>(null);
    const [editAssignmentData, setEditAssignmentData] = useState<any>(null);
    const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);

    //const inputRefs = useRef<Record<number, HTMLInputElement | null>>({});

    // -----------------
    // Module functions
    // -----------------
    const openAddModule = () => { setEditModuleData(null); setIsModuleModalOpen(true); };
    const saveModule = (data: any) => {
        if (editModuleData) {
            setModules(prev => prev.map(m => m.id === editModuleData.id ? { ...m, ...data } : m));
        } else {
            const new_mod: Partial<Module> = {
                id: Date.now(),
                title: data.title,
                description: data.description,
                lessons: [],
                order: 0,
            }
            modules.push(new_mod)
            //setModules(prev => [...prev, { id: Date.now(), title: data.title, description: data.description, isOpen: true, lessons: [] }]);
        }
        setIsModuleModalOpen(false);
    };
    const editModule = (module: any) => { setEditModuleData(module); setIsModuleModalOpen(true); };
    const deleteModule = (id: number) => { setModules(prev => prev.filter(m => m.id !== id)); };
    const reorderModules = (newOrder: any[]) => { setModules(newOrder); };
    const toggleOpenModule = (moduleId: number) => {
        if (moduleId != openId) {
            setOpenId(moduleId);
        }
        else {
            setOpenId(-1);
        }
    };

    // -----------------
    // Lesson functions
    // -----------------
    const openAddLesson = (moduleId: number) => { setModalLessonModuleId(moduleId); setEditLessonData(null); setIsLessonModalOpen(true); };
    const saveLesson = (data: any) => {
        if (!modalLessonModuleId) return;
        setModules(prev => prev.map(m => {
            if (m.id !== modalLessonModuleId) return m;
            if (editLessonData) {
                return {
                    ...m,
                    lessons: m.lessons!.map((l: any) => l.id === editLessonData.id ? { ...l, ...data } : l),
                };
            }

            return {

                ...m,
                lessons: [...m.lessons!, { id: Date.now(), title: data.title, description: data.description, tasks: [], order: 0 }],
            };
        }));
        setIsLessonModalOpen(false);
    };
    const editLesson = (moduleId: number, lesson: any) => { setModalLessonModuleId(moduleId); setEditLessonData(lesson); setIsLessonModalOpen(true); };
    const deleteLesson = (moduleId: number, lessonId: number) => {
        setModules(prev => prev.map(m => m.id === moduleId ? { ...m, lessons: m.lessons!.filter((l: any) => l.id !== lessonId) } : m));
    };
    const reorderLessons = (moduleId: number, newOrder: any[]) => {
        setModules(prev => prev.map(m => m.id === moduleId ? { ...m, lessons: newOrder } : m));
    };
    const toggleOpenLesson = (lessonId: number) => {
        if (lessonOpenId == lessonId) {
            setLessonOpenId(-1);
        }
        else {
            setLessonOpenId(lessonId);
        }
    };

    // -----------------
    // Assignment functions (только к конкретному уроку)
    // -----------------
    const openAddAssignment = (moduleId: number, lessonId: number) => {
        setModalAssignmentModuleId(moduleId);
        setModalAssignmentLessonId(lessonId);
        setEditAssignmentData(null);
        setIsAssignmentModalOpen(true);
    };
    const saveAssignment = (data: any) => {
        if (modalAssignmentModuleId == null || modalAssignmentLessonId == null) return;
        setModules(prev => prev.map(m => {
            if (m.id !== modalAssignmentModuleId) return m;
            return {
                ...m,
                lessons: m.lessons!.map((l: any) => {
                    if (l.id !== modalAssignmentLessonId) return l;
                    if (editAssignmentData) {
                        return { ...l, tasks: l.tasks.map((a: any) => a.id === editAssignmentData.id ? { ...a, ...data } : a) };
                    }
                    return { ...l, tasks: [...(l.tasks || []), { id: Date.now(), order: 0, ...data }] };
                }),
            };
        }));
        console.log(modules);
        setIsAssignmentModalOpen(false);
    };
    const editAssignment = (moduleId: number, lessonId: number, assignment: any) => {
        setModalAssignmentModuleId(moduleId);
        setModalAssignmentLessonId(lessonId);
        setEditAssignmentData(assignment);
        setIsAssignmentModalOpen(true);
    };
    const deleteAssignment = (moduleId: number, lessonId: number, assignmentId: number) => {
        setModules(prev => prev.map(m => {
            if (m.id !== moduleId) return m;
            return {
                ...m,
                lessons: m.lessons!.map((l: any) => l.id === lessonId ? { ...l, tasks: (l.tasks || []).filter((a: any) => a.id !== assignmentId) } : l),
            };
        }));
    };
    const reorderAssignments = (moduleId: number, lessonId: number, newOrder: any[]) => {
        setModules(prev => prev.map(m => {
            if (m.id !== moduleId) return m;
            return { ...m, lessons: m.lessons!.map((l: any) => l.id === lessonId ? { ...l, tasks: newOrder } : l) };
        }));
    };

    // -----------------
    // Render
    // -----------------
    return (
        <section className="space-y-6">
            <h2 className="text-2xl font-bold">Course Curriculum (Editable)</h2>
            <div className="flex justify-end">
                <button type="button" onClick={openAddModule} className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition">
                    <Plus size={18} /> Add Module
                </button>
            </div>

            <Reorder.Group axis="y" values={modules} onReorder={(v: any) => reorderModules(v)} className="space-y-3">
                {modules.map((module: any) => (
                    <Reorder.Item key={module.id} value={module}>
                        <div className="border border-white/10 rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm">
                            <div className="flex items-center">
                                <div className="cursor-grab p-3 text-gray-400"><GripVertical size={18} /></div>

                                <button type="button" onClick={() => toggleOpenModule(module.id)} className="flex-1 p-4 flex justify-between items-center text-left hover:bg-white/10 transition-colors">
                                    <p className="bg-transparent outline-none font-semibold w-full">{module.title}</p>
                                    <span className="material-symbols-outlined text-gray-400 transition-transform duration-300" style={{ transform: `rotate(${module.id == openId ? -180 : 0}deg)` }}>expand_more</span>
                                </button>

                                <div className="pr-3 flex gap-2">
                                    <button type="button" onClick={() => editModule(module)} className="p-2 hover:bg-white/5 rounded text-blue-400" title="Edit module"><Pencil size={16} /></button>
                                    <button type="button" onClick={() => deleteModule(module.id)} className="p-2 hover:bg-white/5 rounded text-red-400" title="Delete module"><Trash2 size={16} /></button>
                                </div>
                            </div>

                            <motion.div initial={false} animate={{ height: openId == module.id ? "auto" : 0 }} className="overflow-hidden">
                                <motion.div className="p-4 border-t border-white/10 text-sm text-gray-300 space-y-3">
                                    {/* Lessons (drag) */}
                                    {(module.lessons && module.lessons.length) > 0 ? (
                                        <Reorder.Group axis="y" values={module.lessons} onReorder={(v: any) => reorderLessons(module.id, v)} className="space-y-2">
                                            {module.lessons.map((lesson: any) => (
                                                <Reorder.Item key={lesson.id} value={lesson}>
                                                    <div className=" bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm">
                                                        <div className="flex items-center gap-3 px-3">
                                                            <GripVertical size={16} className="text-gray-400 cursor-grab" />
                                                            <button type="button" onClick={() => toggleOpenLesson(lesson.id)}
                                                                className="flex-1 p-4 flex justify-between items-center text-left hover:bg-white/10 transition-colors">
                                                                <p className="bg-transparent outline-none font-semibold w-full">{lesson.title}</p>
                                                                <span className="material-symbols-outlined text-gray-400 transition-transform duration-300"
                                                                    style={{
                                                                        transform: `rotate(${lesson.id == lessonOpenId ? -180 : 0}deg)`
                                                                    }}
                                                                >
                                                                    expand_more
                                                                </span>
                                                            </button>
                                                            <button type="button" onClick={() => editLesson(module.id, lesson)} className="p-2 hover:bg-white/10 rounded text-blue-400"><Pencil size={16} /></button>
                                                            <button type="button" onClick={() => deleteLesson(module.id, lesson.id)} className="p-2 hover:bg-white/10 rounded text-red-400"><Trash2 size={16} /></button>
                                                        </div>

                                                        {/* Assignments (drag) — visible only when lesson.isOpen */}
                                                        <motion.div
                                                            initial={false}
                                                            animate={{ height: lesson.id == lessonOpenId ? "auto" : 0 }}
                                                            transition={{ duration: 0.25 }}   // такая же скорость как у модуля
                                                            className="overflow-hidden"
                                                        >
                                                            <motion.div className="p-4 border-t border-white/10 text-sm text-gray-300 space-y-3">

                                                                <div className="pl-6 space-y-2 ">
                                                                    {lesson.tasks && lesson.tasks.length > 0 ? (
                                                                        <Reorder.Group axis="y" values={lesson.tasks} onReorder={(v: any) => reorderAssignments(module.id, lesson.id, v)} className="space-y-2">
                                                                            {lesson.tasks.map((assign: any) => (
                                                                                <Reorder.Item key={assign.id} value={assign}>
                                                                                    <div className="flex items-center gap-3 bg-white/3 p-3 rounded-lg border border-white/10">
                                                                                        <GripVertical size={16} className="text-gray-400 cursor-grab" />
                                                                                        <div className="flex-1">
                                                                                            <p className="font-semibold">{assign.title} [{assign.type}]</p>
                                                                                            {assign.type === "quiz" && <p className="text-xs text-gray-400">Quiz — {assign.options?.filter(Boolean).length} options</p>}
                                                                                            {assign.type === "code" && <p className="text-xs text-gray-400">Code — {assign.languageName || ""}</p>}
                                                                                        </div>
                                                                                        <button type="button" onClick={() => editAssignment(module.id, lesson.id, assign)} className="p-2 hover:bg-white/10 rounded text-blue-400"><Pencil size={16} /></button>
                                                                                        <button type="button" onClick={() => deleteAssignment(module.id, lesson.id, assign.id)} className="p-2 hover:bg-white/10 rounded text-red-400"><Trash2 size={16} /></button>
                                                                                    </div>
                                                                                </Reorder.Item>
                                                                            ))}
                                                                        </Reorder.Group>
                                                                    ) : (
                                                                        <p className="text-sm text-gray-500 italic pl-1">No assignments in this lesson</p>
                                                                    )}

                                                                    <div className="pt-2">
                                                                        <button type="button" onClick={() => openAddAssignment(module.id, lesson.id)} className="flex items-center gap-2 px-3 py-1 bg-purple-600 rounded hover:bg-purple-700 text-white">
                                                                            <Plus size={16} /> Add Assignment
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                            </motion.div>
                                                        </motion.div>
                                                    </div>
                                                </Reorder.Item>
                                            ))}
                                        </Reorder.Group>
                                    ) : (
                                        <p className="text-sm text-gray-500 italic pl-4">No lessons in this module</p>
                                    )}

                                    <div className="pt-2">
                                        <button onClick={() => openAddLesson(module.id)} className="flex items-center gap-2 px-3 py-1 bg-green-600 rounded hover:bg-green-700 text-white">
                                            <Plus size={16} /> Add Lesson
                                        </button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </Reorder.Item>
                ))}
            </Reorder.Group>

            {/* Modals */}
            <ModuleModal open={isModuleModalOpen} onClose={() => setIsModuleModalOpen(false)} onSave={saveModule} initial={editModuleData} />
            <LessonModal open={isLessonModalOpen} onClose={() => setIsLessonModalOpen(false)} onSave={saveLesson} initial={editLessonData} />
            <ItemModal open={isAssignmentModalOpen} onClose={() => setIsAssignmentModalOpen(false)} onSave={saveAssignment} initial={editAssignmentData} />
        </section >
    );
}

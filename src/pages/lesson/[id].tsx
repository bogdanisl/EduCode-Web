import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import type { Lesson } from "../../types/interfaces/Lesson";

const LessonPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
    const [code, setCode] = useState("// Write your code here\n");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{ correct: boolean } | null>(null);

    const [leftWidth, setLeftWidth] = useState(380);
    const containerRef = useRef<HTMLDivElement>(null);
    const resizing = useRef<{ left?: boolean }>({});

    const runCode = async (): Promise<string> => {
        const userCode = code; // то, что в редакторе

        // Оборачиваем код пользователя в функцию, которая перехватывает console.log
        const wrappedCode = `
    (function() {
      const logs = [];
      const originalLog = console.log;
      console.log = (...args) => {
        logs.push(args.map(arg => String(arg)).join(' '));
      };

      try {
        ${userCode}
      } catch (err) {
        logs.push("Error: " + err.message);
      } finally {
        console.log = originalLog;
      }

      return logs.join('\\n');
    })();
  `;

        // Выполняем в изолированном контексте
        const func = new Function(wrappedCode);
        const output = func();

        return output || "";
    };

    // === FETCH LESSON ===
    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const res = await fetch(`/api/lesson/${id}`, { credentials: "include" });
                if (!res.ok) throw new Error("Failed to load lesson");
                const data = await res.json();
                setLesson(data.lesson);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLesson();
    }, [id]);

    // === RESIZE EVENTS ===
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current || !resizing.current.left) return;
            const rect = containerRef.current.getBoundingClientRect();
            const newWidth = e.clientX - rect.left;
            setLeftWidth(Math.min(Math.max(newWidth, 260), rect.width - 400));
        };

        const handleMouseUp = () => {
            resizing.current = {};
            document.body.style.cursor = "default";
            document.body.style.userSelect = "auto";
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    const handleSubmit = async () => {
        if (!task) return;

        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            let body: any = {};

            if (task.type === "quiz") {
                const selected = document.querySelector(
                    `input[name="task-${task.id}"]:checked`
                ) as HTMLInputElement;
                if (!selected) {
                    alert("Выбери вариант ответа!");
                    setIsSubmitting(false);
                    return;
                }
                body.selectedOptionId = Number(selected.value);
            }

            if (task.type === "code") {
                const output = await runCode();
                console.log(output)
                body.output = output; // Здесь потом будет настоящий вывод, пока отправляем код
                // В будущем: запустишь код и отправишь реальный console.log
            }

            if (task.type === "text") {
                // В будущем — текстовое поле ввода
                body.answer = "твой текст"; // пока заглушка
            }

            const res = await fetch(`/api/task/${task.id}/check`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (res.ok && data.correct === true) {
                setSubmitStatus({ correct: true });
                // Автоматический переход через 1 секунду
                setTimeout(() => {
                    if (lesson && currentTaskIndex < lesson.tasks.length - 1) {
                        setCurrentTaskIndex((i) => i + 1);
                        setSubmitStatus(null);
                        setCode("// Write your code here\n"); // сброс кода
                    }
                }, 1000);
            } else {
                setSubmitStatus({ correct: false });
            }
        } catch (err) {
            console.error(err);
            setSubmitStatus({ correct: false });
        } finally {
            setIsSubmitting(false);
        }
    };


    const startLeftResize = (e: React.MouseEvent) => {
        e.preventDefault();
        resizing.current.left = true;
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
    };

    if (loading) return <div className="text-white text-xl p-10">Loading...</div>;
    if (!lesson) return null;

    const task = lesson.tasks[currentTaskIndex];
    const isQuiz = task.type === "quiz";
    const isCode = task.type === "code";
    const isText = task.type === "text";

    return (
        <div
            ref={containerRef}
            className="flex flex-col h-screen bg-[#0e1117] text-white overflow-hidden"
        >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-3 bg-[#16181f]">
                <h1 className="text-xl font-bold">{lesson.title}</h1>
                <div className="text-sm text-gray-400">
                    Task {currentTaskIndex + 1} / {lesson.tasks.length}
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* LEFT PANEL */}
                <div
                    style={{ width: `${leftWidth}px` }}
                    className="border-r border-white/10 p-6 bg-[#12151b] overflow-y-auto"
                >
                    <h2 className="text-2xl font-bold mb-4">{lesson.title}</h2>
                    <p className="text-gray-300 mb-6">{lesson.description}</p>
                    <div className="text-sm text-gray-400">
                        Module: <span className="text-white">{lesson.module.title}</span>
                    </div>

                    {isCode && (
                        <>
                            <br></br>
                            <h2 className="text-2xl font-bold mb-4">{task.title}</h2>
                            <p className="text-gray-300 mb-6">{task.description}</p>
                        </>
                    )}
                </div>

                {/* RESIZER */}
                <div
                    onMouseDown={startLeftResize}
                    className="w-1 bg-transparent hover:bg-primary/70 cursor-col-resize transition-all"
                />

                {/* RIGHT CONTENT */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Task Header */}
                    <div className="border-b border-white/10 px-6 py-3 bg-[#16181f]">
                        {isCode ? (
                            <div className="text-sm text-gray-400">

                                <span className="text-white font-bold">
                                    {task.language || "TypeScript"}
                                </span>
                            </div>
                        ) : (
                            <>
                                <h3 className="font-bold text-lg">{task.title}</h3>
                                <p className="text-gray-400 text-sm">{task.description}</p>
                            </>
                        )}
                    </div>

                    {/* Task Content */}
                    <div className="flex-1 overflow-auto p-6 bg-[#1e1e1e]">
                        {isQuiz && (
                            <div className="space-y-4">
                                {task.options?.map((opt) => (
                                    <label
                                        key={opt.id}
                                        className="block p-4 bg-[#16181f] rounded-lg border border-white/10 hover:border-primary/50 cursor-pointer transition-colors"
                                    >
                                        <input
                                            type="radio"
                                            name={`task-${task.id}`}
                                            value={opt.id}
                                            className="mr-3 accent-primary"
                                        />
                                        {opt.text}
                                    </label>
                                ))}
                            </div>
                        )}

                        {isCode && (
                            <Editor
                                height="100%"
                                defaultLanguage={task.language || "typescript"}
                                value={task.startCode || code}
                                onChange={(value) => setCode(value || "")}
                                theme="vs-dark"
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 15,
                                    lineNumbers: "on",
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                    padding: { top: 20, bottom: 20 },
                                }}
                            />
                        )}

                        {isText && (
                            <div className="prose prose-invert max-w-none">
                                <p>{task.description}</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {/* Footer */}
                    <div className="border-t border-white/10 flex justify-between px-6 py-3 bg-[#16181f]">
                        <button
                            disabled={currentTaskIndex === 0}
                            onClick={() => setCurrentTaskIndex((i) => i - 1)}
                            className="px-5 py-2 bg-white/10 rounded-lg hover:bg-white/20 disabled:opacity-50 transition"
                        >
                            Previous
                        </button>

                        <div className="flex gap-4 items-center">
                            {/* Сообщение о результате */}
                            {submitStatus && (
                                <span
                                    className={`font-bold text-lg ${submitStatus.correct ? "text-green-400" : "text-red-400"
                                        }`}
                                >
                                    {submitStatus.correct ? "Правильно!" : "Неправильно, попробуй ещё!"}
                                </span>
                            )}

                            {/* Кнопка отправки */}
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className={`px-6 py-2.5 rounded-lg font-bold transition ${isSubmitting
                                    ? "bg-white/20 cursor-not-allowed"
                                    : "bg-primary hover:bg-primary/90"
                                    }`}
                            >
                                {isSubmitting ? "Проверка..." : isCode ? "Run Code" : "Submit"}
                            </button>
                        </div>

                        <button
                            disabled={currentTaskIndex === lesson.tasks.length - 1 || !submitStatus?.correct}
                            onClick={() => setCurrentTaskIndex((i) => i + 1)}
                            className="px-5 py-2 bg-primary hover:bg-primary/90 rounded-lg font-bold disabled:opacity-50 transition"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonPage;

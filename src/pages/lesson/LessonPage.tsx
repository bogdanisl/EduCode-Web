// LessonPage.tsx
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Lesson } from "../../types/lesson";
import CodeConsole from "./components/CodeConsole";
import TaskArea from "./components/TaskArea";
import { toast, ToastContainer } from "react-toastify";
import { X } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";

const LessonPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [code, setCode] = useState("//code");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ correct: boolean } | null>(null);
  const [consoleOutput, setConsoleOutput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const [leftWidth, setLeftWidth] = useState(380);
  const [bottomHeight, setBottomHeight] = useState(250);
  const containerRef = useRef<HTMLDivElement>(null);
  const resizingRef = useRef<{ left: boolean; bottom: boolean }>({ left: false, bottom: false });

  // === Fetch Lesson ===
  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setLesson(null);
    setCurrentTaskIndex(0);
    setCode("// Write your code here\n");
    setConsoleOutput("");
    setError(null);
    setSubmitStatus(null);

    const fetchLesson = async () => {
      try {
        const res = await fetch(`/api/lesson/${id}`, { credentials: "include" });
        if (!res.ok) throw new Error("Failed to load lesson");

        const data = await res.json();
        setLesson(data.lesson);

        const firstTask = data.lesson.tasks[0];
        if (firstTask?.type === "code") {
          setCode(firstTask.startCode || "// Write your code here\n");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [id]);

  // === Resizing ===
  const startLeftResize = (e: React.MouseEvent) => {
    e.preventDefault();
    resizingRef.current.left = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  const startBottomResize = (e: React.MouseEvent) => {
    e.preventDefault();
    resizingRef.current.bottom = true;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
  };

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (resizingRef.current.left) {
        const newWidth = e.clientX;
        if (newWidth > 240 && newWidth < window.innerWidth - 300) setLeftWidth(newWidth);
      }

      if (resizingRef.current.bottom && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const newHeight = rect.bottom - e.clientY;
        if (newHeight > 120 && newHeight < rect.height - 120) setBottomHeight(newHeight);
      }
    }

    function onMouseUp() {
      resizingRef.current.left = false;
      resizingRef.current.bottom = false;
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const handleSubmit = async () => {
    if (!lesson || !task) return;

    setIsSubmitting(true);
    setSubmitStatus(null);
    setConsoleOutput("");
    setError(null);

    try {
      let body: any = {};
      if (task.type === "quiz") {
        const selected = document.querySelector(`input[name="task-${task.id}"]:checked`) as HTMLInputElement | null;
        if (!selected) {
          toast.info("You should select an option.", { theme: "dark" });
          setIsSubmitting(false);
          return;
        }
        body.selectedOptionId = Number(selected.value);
      }

      if (task.type === "code") body.code = code;

      const res = await fetch(`/api/task/${task.id}/check`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      setSubmitStatus({ correct: data.correct });
      if (task.type === "code") {
        setConsoleOutput(data.console || "");
        setError(data.error || null);
      }

      if (res.ok && data.correct) {
        setTimeout(() => {
          if (currentTaskIndex < lesson.tasks.length - 1) {
            setCurrentTaskIndex(i => i + 1);
            setCode("// Write your code here\n");
            setConsoleOutput("");
            setError(null);
            setSubmitStatus(null);
          } else {
            const nextLessonId = data.nextLessonId;
            if (nextLessonId && nextLessonId !== -1 && data.nextLessonId !== -2) {
              navigate(`/lesson/${nextLessonId}`, { replace: true });
            } else if (data.nextLessonId === -2) {
              toast.success("Congratulations! You have completed the course.");
              navigate(`/dashboard`, { replace: true });
            }
          }
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      setSubmitStatus({ correct: false });
      setError("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="text-black dark:text-white text-xl p-10">Loading...</div>;
  if (!lesson) return null;

  const task = lesson.tasks[currentTaskIndex];
  if (!task) return <div className="text-black dark:text-white p-10">Task not found</div>;
  const isCode = task.type === "code";

  return (
    <div ref={containerRef} className="flex flex-col h-screen overflow-hidden bg-white dark:bg-[#0e1117] text-black dark:text-white">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 px-6 py-3 bg-background-light dark:bg-background-dark">
        <div className="flex gap-5">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition"
            aria-label="Close"
          >
            <X size={20} />
          </button>
          <h1 className="text-xl font-bold">{lesson.module.title}</h1>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Task {currentTaskIndex + 1} / {lesson.tasks.length}</div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div
          style={{ width: `${leftWidth}px` }}
          className="border-r border-gray-200 dark:border-white/10 p-6 overflow-y-auto bg-white dark:bg-[#0D1117]"
        >
          <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">{lesson.title}</h2>
          <MDEditor.Markdown source={lesson.description || ""} />
          {(isCode || task.type === "quiz") && (
            <>
              <h3 className="text-xl font-bold mb-3 text-black dark:text-white">{task.title}</h3>
              <MDEditor.Markdown source={task.description || ""} />
            </>
          )}
        </div>

        {/* Left Resizer */}
        <div onMouseDown={startLeftResize} className="w-1 cursor-col-resize hover:bg-gray-300 dark:hover:bg-white/20"></div>

        {/* Right Panel */}
        <div className="flex-1 flex flex-col">
          <TaskArea task={task} code={code} onCodeChange={setCode} isSubmitting={isSubmitting} onSubmit={handleSubmit} />

          {isCode && (
            <>
              <div onMouseDown={startBottomResize} className="h-1 cursor-row-resize hover:bg-gray-300 dark:hover:bg-white/20"></div>
              <CodeConsole consoleOutput={consoleOutput} error={error} height={bottomHeight} correctOutput={task.correctOutput || ""} />
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-white/10 px-6 py-3 bg-white dark:bg-[#16181f] flex items-center justify-between">
        <button
          disabled={currentTaskIndex === 0}
          onClick={() => setCurrentTaskIndex(i => i - 1)}
          className="px-6 py-2.5 bg-gray-100 dark:bg-white/10 rounded-lg hover:bg-gray-200 dark:hover:bg-white/20 disabled:opacity-50 font-medium"
        >
          Previous
        </button>

        {submitStatus && (
          <span
            className={`font-bold text-lg px-4 py-2 rounded-lg ${
              submitStatus.correct ? "text-green-400 bg-green-500/10" : "text-red-400 bg-red-500/10"
            }`}
          >
            {submitStatus.correct ? "Correct!" : "Try again!"}
          </span>
        )}

        <button
          disabled={currentTaskIndex === lesson.tasks.length - 1 || !submitStatus?.correct}
          onClick={() => setCurrentTaskIndex(i => i + 1)}
          className="px-6 py-2.5 bg-primary hover:bg-primary/90 rounded-lg font-bold disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default LessonPage;

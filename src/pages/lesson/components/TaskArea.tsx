import Editor from "@monaco-editor/react";

export default function TaskArea({ task, code, onCodeChange, isSubmitting, onSubmit }: any) {
  const isQuiz = task.type === "quiz";
  const isCode = task.type === "code";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-white/10 px-6 py-3 bg-white dark:bg-[#16181f] flex items-center justify-between">
        {isCode && (
          <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
            <span className="text-black dark:text-white font-bold">{task.languageName || "JavaScript"}</span>
          </span>
        )}
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className={`px-6 text-white py-2 rounded-lg font-bold ${isSubmitting ? "bg-gray-200 dark:bg-white/20" : "bg-primary hover:bg-primary/90"
            }`}
        >
          {isSubmitting ? "Checking..." : isCode ? "Run & Check" : "Submit"}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {/* Quiz */}
        {isQuiz && task.options && (
          <div className="p-6 space-y-4">
            {task.options.map((opt: any) => (
              <label
                key={opt.id}
                className="block p-4 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#16181f] hover:border-primary/50 cursor-pointer"
              >
                <input type="radio" name={`task-${task.id}`} value={opt.id} className="mr-3 accent-primary" />
                <span className="text-black dark:text-white">{opt.text}</span>
              </label>
            ))}
          </div>
        )}

        {/* Code */}
        {isCode && (
          <Editor
            height="100%"
            defaultLanguage={task.languageName?.toLowerCase() || "typescript"}
            value={code}
            onChange={(v) => onCodeChange(v || "")}
            theme="vs-dark"
            options={{ minimap: { enabled: false }, fontSize: 15, padding: { top: 20 } }}
          />
        )}

        {/* Text Task */}
        {task.type === "text" && (
          <div className="p-6">
            <textarea
              className="w-full h-64 rounded-lg p-4 border border-gray-200 dark:border-white/10 bg-white dark:bg-[#16181f] text-black dark:text-white"
              placeholder="Напиши ответ..."
            />
          </div>
        )}
      </div>
    </div>
  );
}

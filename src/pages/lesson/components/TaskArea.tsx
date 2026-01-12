import Editor from "@monaco-editor/react";

export default function TaskArea({ task, code, onCodeChange, isSubmitting, onSubmit }: any) {
  const isQuiz = task.type === "quiz";
  const isCode = task.type === "code";

  return (
    <>
      <div className="border-b border-white/10 px-6 py-3 bg-[#16181f] flex items-center justify-between">
        {isCode && (
          <span className="text-sm font-mono text-gray-400">
            <span className="text-white font-bold">{task.languageName || "JavaScript"}</span>
          </span>
        )}
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className={`px-6 py-2 rounded-lg font-bold ${isSubmitting ? "bg-white/20" : "bg-primary hover:bg-primary/90"}`}
        >
          {isSubmitting ? "Checking..." : isCode ? "Run & Check" : "Submit"}
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {isQuiz && task.options && (
          <div className="p-6 space-y-4">
            {task.options.map((opt: any) => (
              <label key={opt.id} className="block p-4 bg-[#16181f] rounded-lg border border-white/10 hover:border-primary/50 cursor-pointer">
                <input type="radio" name={`task-${task.id}`} value={opt.id} className="mr-3 accent-primary" />
                <span>{opt.text}</span>
              </label>
            ))}
          </div>
        )}

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

        {task.type === "text" && (
          <div className="p-6">
            <textarea className="w-full h-64 bg-[#16181f] rounded-lg p-4 border border border-white/10" placeholder="Напиши ответ..." />
          </div>
        )}
      </div>
    </>
  );
}
import { useState } from "react";

export default function CodeConsole({
  consoleOutput,
  error,
  correctOutput,
  height,
}: {
  consoleOutput: string;
  error: string | null;
  correctOutput: string;
  height: number;
}) {
  const [tab, setTab] = useState<"console" | "expected">("console");

  return (
    <div style={{ height }} className="border-t border-gray-300 dark:border-white/10 flex flex-col bg-white dark:bg-[#0e1117]">
      
      {/* Tabs */}
      <div className="flex border-b border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-[#16181f]">
        <button
          onClick={() => setTab("console")}
          className={`px-6 py-3 font-medium border-b-2 ${
            tab === "console"
              ? "border-primary text-primary"
              : "border-transparent hover:text-gray-600 dark:hover:text-gray-300"
          }`}
        >
          Console
        </button>

        <button
          onClick={() => setTab("expected")}
          className={`px-6 py-3 font-medium border-b-2 ${
            tab === "expected"
              ? "border-primary text-primary"
              : "border-transparent hover:text-gray-600 dark:hover:text-gray-300"
          }`}
        >
          Expected Output
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 font-mono text-sm bg-white dark:bg-[#0e1117]">
        {tab === "console" && (
          <>
            {error ? (
              <pre className="text-red-600 dark:text-red-400">{error}</pre>
            ) : consoleOutput ? (
              <pre className="text-gray-900 dark:text-gray-300 whitespace-pre-wrap">{consoleOutput}</pre>
            ) : (
              <div className="text-gray-400 dark:text-gray-500">Click "Run & Check" to see output</div>
            )}
          </>
        )}

        {tab === "expected" && (
          <>
            {correctOutput ? (
              <pre className="text-gray-900 dark:text-gray-300 whitespace-pre-wrap">{correctOutput}</pre>
            ) : (
              <div className="text-gray-400 dark:text-gray-500">No expected output provided.</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

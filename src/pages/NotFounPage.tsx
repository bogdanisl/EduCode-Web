import { Link, useLocation } from "react-router-dom";

export default function NotFound() {
  const location = useLocation();
  const currentPath = location.pathname || "unknown";

  return (
    <div className="flex flex-col items-center gap-8 px-4 py-16 text-center">
      <div className="flex flex-col items-center gap-6">
        {/* Code Block */}
        <div className="w-full max-w-[560px] p-6 bg-background-dark dark:bg-black/20 rounded-xl border border-white/10">
          <pre className="text-left text-sm text-gray-300 overflow-x-auto">
            <code className="language-javascript">
              <span className="text-purple-400">function</span>{" "}
              <span className="text-primary">findPage</span>(
              <span className="text-orange-400">path</span>) {"{\n  "}
              <span className="text-purple-400">if</span> (
              <span className="text-orange-400">path</span> ==={" "}
              <span className="text-green-400">'{currentPath}'</span>) {" {\n    "}
              <span className="text-purple-400">    return</span>{" "}
              <span className="text-blue-400">page
                <span className="text-gray-500">
                ;
              </span></span>{"\n    } "} 
              <span className="text-purple-400">else</span>{" {\n    "}
              <span className="text-purple-400">    return</span>{" "}
              <span className="text-red-500 font-bold">null</span>
              <span className="text-gray-500">
                ; // Oops! "
              </span>
              <span className="text-red-400 font-mono text-xs">
                {currentPath}
              </span>
              <span className="text-gray-500">" not found</span>
                {"\n    }"}
              {"\n}"}
            </code>
          </pre>
        </div>

        {/* Title & Description */}
        <div className="flex max-w-[480px] flex-col items-center gap-2">
          <p className="text-black dark:text-white text-4xl sm:text-5xl font-bold leading-tight tracking-tighter font-display">
            404: Page Not Found
          </p>
          <p className="text-gray-400 text-base font-normal leading-normal max-w-[480px] text-center">
            We've hit a null pointer. The page you're looking for couldn't be
            compiled. Please check the path and try again.
          </p>
        </div>

        {/* Primary Button */}
        <Link
          to="/"
          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
        >
          <span className="truncate">Run main()</span>
        </Link>
      </div>
    </div>
  );
}
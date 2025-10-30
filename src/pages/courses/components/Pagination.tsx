// src/components/courses/Pagination.jsx
export default function Pagination() {
  return (
    <div className="flex justify-center mt-10">
      <nav className="flex items-center gap-2">
        <button className="flex items-center justify-center size-9 rounded-lg bg-white/5 text-white/70 hover:bg-primary hover:text-white transition-colors">
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <button className="flex items-center justify-center size-9 rounded-lg bg-primary text-white text-sm font-bold">1</button>
        {[2, 3].map((n) => (
          <button
            key={n}
            className="flex items-center justify-center size-9 rounded-lg bg-white/5 text-white/70 hover:bg-primary hover:text-white transition-colors text-sm font-bold"
          >
            {n}
          </button>
        ))}
        <span className="text-white/70">...</span>
        <button className="flex items-center justify-center size-9 rounded-lg bg-white/5 text-white/70 hover:bg-primary hover:text-white transition-colors text-sm font-bold">
          8
        </button>
        <button className="flex items-center justify-center size-9 rounded-lg bg-white/5 text-white/70 hover:bg-primary hover:text-white transition-colors">
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </nav>
    </div>
  );
}
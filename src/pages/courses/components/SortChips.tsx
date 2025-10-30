// src/components/courses/SortChips.jsx
export default function SortChips() {
  return (
    <div className="flex gap-2 p-1 overflow-x-auto mb-6">
      <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white/10 pl-4 pr-3 text-sm font-medium text-white hover:bg-white/20 transition-colors">
        <span>Sort by Popularity</span>
        <span className="material-symbols-outlined">expand_more</span>
      </button>
      {['Newest', 'Rating'].map((label) => (
        <button
          key={label}
          className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white/5 pl-4 pr-3 text-sm font-medium text-white/70 hover:bg-white/20 hover:text-white transition-colors"
        >
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
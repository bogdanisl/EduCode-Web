// src/components/courses/FiltersSidebar.jsx
export default function FiltersSidebar() {
  return (
    <aside className="w-full lg:w-64 xl:w-72 flex-shrink-0">
      <div className="top-28">
        <div className="flex flex-col gap-4 bg-white/5 rounded-xl p-4">
          <h2 className="text-white text-lg font-bold">Filters</h2>

          {/* Search in Sidebar */}
          <div className="py-2">
            <label className="flex flex-col min-w-40 h-11 w-full">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                <div className="text-[#92adc9] flex border-none bg-black/20 items-center justify-center pl-3 rounded-l-lg border-r-0">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border-none bg-black/20 focus:border-none h-full placeholder:text-[#92adc9] px-4 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal"
                  placeholder="Search courses..."
                />
              </div>
            </label>
          </div>

          {/* Topic */}
          <div className="flex flex-col gap-2 border-t border-white/10 pt-4">
            <h3 className="font-semibold text-white">Topic</h3>
            <div className="flex flex-col gap-2 pl-1">
              {['Python', 'UI/UX Design', 'Data Science'].map((topic, i) => (
                <label key={topic} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={i === 1}
                    className="h-4 w-4 rounded border-white/20 bg-transparent text-primary focus:ring-primary/50"
                  />
                  <span className="text-sm text-white/80">{topic}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div className="flex flex-col gap-2 border-t border-white/10 pt-4">
            <h3 className="font-semibold text-white">Difficulty</h3>
            <div className="flex flex-col gap-2 pl-1">
              {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                <label key={level} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-white/20 bg-transparent text-primary focus:ring-primary/50"
                  />
                  <span className="text-sm text-white/80">{level}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Format */}
          <div className="flex flex-col gap-2 border-t border-white/10 pt-4">
            <h3 className="font-semibold text-white">Format</h3>
            <div className="flex flex-col gap-2 pl-1">
              {['Video', 'Interactive', 'Text-based'].map((format) => (
                <label key={format} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-white/20 bg-transparent text-primary focus:ring-primary/50"
                  />
                  <span className="text-sm text-white/80">{format}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-2 border-t border-white/10 pt-4">
            <button className="w-full flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors">
              Apply Filters
            </button>
            <button className="w-full flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-white/10 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-white/20 transition-colors">
              Reset
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
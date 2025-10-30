// src/components/BlogList.tsx
import React from "react";

const posts = [
  { title: "5 Tips for Landing Your First Tech Job", date: "July 21, 2024" },
  { title: "A Deep Dive into CSS Grid", date: "July 18, 2024" },
];

const BlogList: React.FC = () => {
  return (
    <div>
      <h2 className="text-gray-800 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3">
        What's New from Our Blog
      </h2>
      <div className="space-y-4">
        {posts.map((p) => (
          <div
            key={p.title}
            className="bg-white dark:bg-[#1c2127] p-4 rounded-lg border border-gray-200 dark:border-[#283039]"
          >
            <h3 className="font-semibold text-gray-800 dark:text-white text-base">{p.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Published on {p.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;

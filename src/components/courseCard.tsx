// src/components/CourseCard.tsx
import React from "react";

type Props = {
  title: string;
  subtitle: string;
  coverUrl: string;
  onView?: () => void;
};

const CourseCard: React.FC<Props> = ({ title, subtitle, coverUrl, onView }) => {
  return (
    <div className="flex h-full flex-1 flex-col gap-4 rounded-lg bg-background-light dark:bg-[#1c2127] shadow-md dark:shadow-none border border-gray-200 dark:border-[#283039] ">
      <div
        className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-t-lg"
        style={{ backgroundImage: `url("${coverUrl}")` }}
        role="img"
        aria-label={title}
      />
      <div className="flex flex-col flex-1 justify-between p-4 pt-0 gap-4">
        <div>
          <p className="text-gray-800 dark:text-white text-base font-medium leading-normal">{title}</p>
          <p className="text-gray-500 dark:text-[#9dabb9] text-sm font-normal leading-normal">{subtitle}</p>
        </div>
        <button
          onClick={onView}
          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-200 dark:bg-[#283039] hover:bg-gray-300 dark:hover:bg-[#39424d] text-gray-800 dark:text-white text-sm font-bold tracking-[0.015em] transition-colors"
        >
          <span className="truncate">View Course</span>
        </button>
      </div>
    </div>
  );
};

export default CourseCard;

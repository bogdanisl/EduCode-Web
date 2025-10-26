// src/components/Hero.tsx
import React from "react";

const Hero: React.FC = () => {
  return (
    <div className="@container">
      <div className="@[480px]:p-4">
        <div
          className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-center justify-center p-4"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCqLI3lpWFGgde4PuCbQw4boJ_-OEX7YLZRBcRt2OxSmE7B9btmg6i4uSha9pRhhvWZf-faSykt28K3M_lrk1Wa51dKgUymhe-ZR63UuJ45kT5xQr1p6FvtsJv3Vx_SEjAq8G5oygrSmuXkfU3232_GTDZrn4f_4DnOwAhJvcIhHwhgM-zWwiAi_l561MbUpfp-mogdTTIYLGL4zE4t94VJgf8Y6x0hbuRWOwL2QALYuHQBsmsh-MLTkrogmAwJ97peH1QaS9S7l0CB")',
          }}
          aria-label="Hero background"
        >
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl">
              Unlock Your Coding Potential
            </h1>
            <h2 className="text-gray-200 dark:text-gray-300 text-sm font-normal leading-normal @[480px]:text-base max-w-xl">
              Learn to code and build your future with our engaging and comprehensive courses,
              designed for all skill levels.
            </h2>
          </div>

          <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-primary hover:bg-primary/90 text-white text-sm font-bold tracking-[0.015em] transition-colors">
            <span className="truncate">Explore All Courses</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;

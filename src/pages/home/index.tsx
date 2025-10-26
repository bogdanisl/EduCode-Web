// src/App.tsx
import React from "react";
import Hero from "./hero";
import CoursesCarousel from "./courseCarousel";
import AboutMission from "./ourMission";
import BlogList from "./blogList";


const HomeIndex: React.FC = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-white min-h-screen">
      <div className="relative flex w-full flex-col overflow-x-hidden">
        <main className="flex-1">
          <div className="px-4 sm:px-0 lg:px-10 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-[75%] flex-1 gap-12 pt-20">
              <Hero />
              <section>
                <h2 className="text-gray-800 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                  Popular Courses
                </h2>
                <CoursesCarousel />
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 py-5">
                <AboutMission />
                <BlogList />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomeIndex;

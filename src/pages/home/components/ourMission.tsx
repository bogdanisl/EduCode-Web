// src/components/AboutMission.tsx
import React from "react";

const AboutMission: React.FC = () => {
  return (
    <div>
      <h2 className="text-gray-800 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3">
        Our Mission
      </h2>
      <div className="bg-background-light dark:bg-[#1c2127] p-6 rounded-lg border border-gray-200 dark:border-[#283039]">
        <p className="text-gray-600 dark:text-gray-300 text-base">
          Our mission is to make high-quality programming education accessible to everyone, everywhere.
          We believe that learning to code is an empowering skill that opens up a world of opportunities.
          Join us and start building your future today.
        </p>
      </div>
    </div>
  );
};

export default AboutMission;

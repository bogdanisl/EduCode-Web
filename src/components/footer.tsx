// src/components/Footer.tsx
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-[#1c2127] border-t border-gray-200 dark:border-t-[#283039] mt-12">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-40">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">© 2024 CodeAcademy. All rights reserved.</div>
          <div className="flex space-x-6">
            <a className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary" href="#">
              Privacy Policy
            </a>
            <a className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary" href="#">
              Terms of Service
            </a>
            <a className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary" href="#">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

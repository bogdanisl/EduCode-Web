import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const toggleProfileMenu = () => setProfileMenuOpen(!profileMenuOpen);
  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
  };
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-b-[#283039] px-4 sm:px-10 lg:px-40 py-3 bg-background-light dark:bg-background-dark">
      {/* Left: Logo + Title + Nav */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4 text-gray-800 dark:text-white">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 text-primary">
                <svg fill="currentColor" viewBox="0 0 48 48">
                  <g clipPath="url(#clip0)">
                    <path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z" />
                    <path
                      clipRule="evenodd"
                      d="M7.24189 26.4066C7.31369 26.4411 7.64204 26.5637 8.52504 26.3738C9.59462 26.1438 11.0343 25.5311 12.7183 24.4963C14.7583 23.2426 17.0256 21.4503 19.238 19.238C21.4503 17.0256 23.2426 14.7583 24.4963 12.7183C25.5311 11.0343 26.1438 9.59463 26.3738 8.52504C26.5637 7.64204 26.4411 7.31369 26.4066 7.24189C26.345 7.21246 26.143 7.14535 25.6664 7.1918C24.9745 7.25925 23.9954 7.5498 22.7699 8.14278C20.3369 9.32007 17.3369 11.4915 14.4142 14.4142C11.4915 17.3369 9.32007 20.3369 8.14278 22.7699C7.5498 23.9954 7.25925 24.9745 7.1918 25.6664C7.14534 26.143 7.21246 26.345 7.24189 26.4066ZM29.9001 10.7285C29.4519 12.0322 28.7617 13.4172 27.9042 14.8126C26.465 17.1544 24.4686 19.6641 22.0664 22.0664C19.6641 24.4686 17.1544 26.465 14.8126 27.9042C13.4172 28.7617 12.0322 29.4519 10.7285 29.9001L21.5754 40.747C21.6001 40.7606 21.8995 40.931 22.8729 40.7217C23.9424 40.4916 25.3821 39.879 27.0661 38.8441C29.1062 37.5904 31.3734 35.7982 33.5858 33.5858C35.7982 31.3734 37.5904 29.1062 38.8441 27.0661C39.879 25.3821 40.4916 23.9425 40.7216 22.8729C40.931 21.8995 40.7606 21.6001 40.747 21.5754L29.9001 10.7285ZM29.2403 4.41187L43.5881 18.7597C44.9757 20.1473 44.9743 22.1235 44.6322 23.7139C44.2714 25.3919 43.4158 27.2666 42.252 29.1604C40.8128 31.5022 38.8165 34.012 36.4142 36.4142C34.012 38.8165 31.5022 40.8128 29.1604 42.252C27.2666 43.4158 25.3919 44.2714 23.7139 44.6322C22.1235 44.9743 20.1473 44.9757 18.7597 43.5881L4.41187 29.2403C3.29027 28.1187 3.08209 26.5973 3.21067 25.2783C3.34099 23.9415 3.8369 22.4852 4.54214 21.0277C5.96129 18.0948 8.43335 14.7382 11.5858 11.5858C14.7382 8.43335 18.0948 5.9613 21.0277 4.54214C22.4852 3.8369 23.9415 3.34099 25.2783 3.21067C26.5973 3.08209 28.1187 3.29028 29.2403 4.41187Z"
                      fillRule="evenodd"
                    />
                  </g>
                </svg>
              </div>
              <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] text-gray-800 dark:text-white">
                EduCode
              </h2>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-9">
            <Link className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm font-medium" to="courses">
              Courses
            </Link>
            <Link className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm font-medium" to="news">
              What's New
            </Link>
            <Link className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm font-medium" to="about-us">
              About Us
            </Link>
            {isAuthenticated && (
              <Link className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm font-medium" to="dashboard">
                My Courses
              </Link>
            )}
            {user?.role == 'admin' && (
              <Link className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm font-medium" to="users">
                Users
              </Link>
            )}
          </nav>
        </div>
      </div>

      {/* Right: Search & Profile/Login */}
      <div className="flex flex-1 justify-end gap-4 sm:gap-8 items-center">
        {/* Search */}
        {isAuthenticated && (
          <label className="hidden sm:flex flex-col min-w-40 !h-10 max-w-64">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-gray-100 dark:bg-[#283039]">
              <div className="text-gray-400 dark:text-[#9dabb9] flex items-center justify-center pl-3">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 dark:text-white focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-gray-400 dark:placeholder:text-[#9dabb9] px-2 text-base font-normal leading-normal"
                placeholder="Search"
              />
            </div>
          </label>
        )}

        {/* Profile or Login */}
        {isAuthenticated ? (
          <div className="relative">
            <button
              onClick={toggleProfileMenu}
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 w-10 h-10"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCdINxs8UXlwCH3l-MtpmC2o_cUfgz5FW3V6pa-K8EJiSenrhMGbOEsNbucPJI02Yvdr5Ahf0acq_UOm5rB1tLmOFuQebQU6_l6na_YeM2poyDSBPXqK-YJpXgoHVUTFL5m9Bh07SZlEkYhJnR-gJq_eEPk2OtqAjVqRgEFgJarZ_fL-JDS8FChHrsUK0gHKnnCFdAUva1SF71Ah05qzl1GTXueohRpetCLWGGh6g8jb-yNqSI651E8-3iCqjagMlSpXky38E88ushp")',
              }}
            />
            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md py-2 z-50">
                <p className="block px-4 py-2 text-gray-800 dark:text-gray-200">{user?.fullName}</p>
                <br />
                <Link to="/profile" className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Profile</Link>
                <Link to="/settings" className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Settings</Link>
                <Link to="/help" className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Help</Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Logout</button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate("/auth/login")}
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition"
          >
            Log in
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;

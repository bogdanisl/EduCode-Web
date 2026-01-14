import { Routes, Route } from "react-router-dom";
import App from "../App";
import Login from "../pages/auth/LoginPage";
import Register from "../pages/auth/RegisterPage";
import ResetPassword from "../pages/auth/ResetPage";
import CoursesIndex from "../pages/courses/CoursesPage";
import NotFound from "../pages/NotFounPage";
import AddCoursePage from "../pages/admin/courses/CreateCoursePage";
import DashboardIndex from "../pages/user/dashboard/UserDashboardPage";
import LessonPage from "../pages/lesson/LessonPage";
import CoursePage from "../pages/courses/CoursePage";
import UsersPage from "../pages/admin/users/UsersPage";
import EditUserPage from "../pages/admin/users/UserPage";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/courses" element={<CoursesIndex />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="auth/reset" element={<ResetPassword/>}></Route>
      <Route path="*" element={<NotFound />} />
      <Route path="/admin/course/create" element={<AddCoursePage />} />
      <Route path="/admin/course/edit/:id" element={<AddCoursePage />} />
      <Route path="/dashboard" element={<DashboardIndex />} />
      <Route path="/courses/:id" element={<CoursePage />} />
      <Route path="/lesson/:id" element={<LessonPage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/users/:id" element={<EditUserPage />} />
    </Routes>
  );
}

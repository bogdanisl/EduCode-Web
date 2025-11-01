import { Routes, Route } from "react-router-dom";
import App from "../App";
import Login from "../auth/Login";
import Register from "../auth/Register";
import ResetPassword from "../auth/Reset";
import CoursesIndex from "../pages/courses";
import NotFound from "../pages/notFound";
import AddCoursePage from "../pages/admin/course/Create";
import DashboardIndex from "../pages/user/dashboard";
import Course from "../pages/courses/[id]";


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
      <Route path="/dashboard" element={<DashboardIndex />} />
      <Route path="/courses/:id" element={<Course />} />
    </Routes>
  );
}

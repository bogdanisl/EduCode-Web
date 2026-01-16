import { Routes, Route } from "react-router-dom";
import App from "../App";
import Login from "../pages/auth/LoginPage";
import Register from "../pages/auth/RegisterPage";
import ResetPassword from "../pages/auth/ResetPage";
import CoursesIndex from "../pages/courses/CoursesPage";
import NotFound from "../pages/NotFoundPage";
import AddCoursePage from "../pages/admin/courses/CreateCoursePage";
import DashboardIndex from "../pages/user/dashboard/UserDashboardPage";
import LessonPage from "../pages/lesson/LessonPage";
import CoursePage from "../pages/courses/CoursePage";
import UsersPage from "../pages/admin/users/UsersPage";
import ProfilePage from "../pages/user/ProfilePage";
import AdminEditUserPage from "../pages/admin/users/AdminUserPage";
import ArticlesPage from "../pages/article/ArticlesPage";
import ArticleCreatePage from "../pages/admin/articles/ArticleCreatePage";
import ArticlePage from "../pages/article/ArticlePage";
import AboutPage from "../pages/AboutPage";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/courses" element={<CoursesIndex />} />
      <Route path="/articles" element={<ArticlesPage />} />
      <Route path="/articles/:id" element={<ArticlePage />} />
      <Route path='/about-us' element={<AboutPage/>}/>
      <Route path="/admin/article/create" element={<ArticleCreatePage />} />
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
      <Route path="/users/:id" element={<AdminEditUserPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}

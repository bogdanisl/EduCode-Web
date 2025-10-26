import { Routes, Route } from "react-router-dom";
import App from "../App";
import Login from "../auth/Login";
import Register from "../auth/Register";
import ResetPassword from "../auth/Reset";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="auth/reset" element={<ResetPassword/>}></Route>
    </Routes>
  );
}

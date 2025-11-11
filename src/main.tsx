import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";
import "./index.css";
import { BrowserRouter, useLocation } from "react-router-dom";
import AppRoutes from "./Routes/routes.tsx";
import Header from "./components/header.tsx";
import Footer from "./components/footer.tsx";
import { AuthProvider } from "./context/AuthProvider.tsx";

const LayoutWrapper = () => {
  const location = useLocation();

  // Список путей, где хедер и футер скрываются
  const hideLayoutPaths = [/^\/lesson\/\d+$/]; // пример: /lesson/1, /lesson/23

  // Проверяем, совпадает ли текущий путь с шаблоном
  const hideLayout = hideLayoutPaths.some((regex) => regex.test(location.pathname));

  return (
    <>
      {!hideLayout && <Header />}
      <AppRoutes />
      {!hideLayout && <Footer />}
    </>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <LayoutWrapper />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);

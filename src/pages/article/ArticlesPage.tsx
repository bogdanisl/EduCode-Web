import React from "react";
import { useArticles } from "../../hooks/useArticles";
import ArticleCard from "./components/ArticleCard";
import { useAuth } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";

const ArticlesPage: React.FC = () => {
  const { articles, loading, error } = useArticles();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (loading) return <div className="text-white p-10">Loading articles...</div>;
  if (error) return <div className="text-red-500 p-10">{error}</div>;

  return (
    <main className="min-h-screen bg-background-light dark:bg-background-dark p-6 sm:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Latest Articles</h1>

          {user?.role === "admin" && (
            <button
              onClick={() => navigate("/admin/article/create")}
              className="px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition"
            >
              Add New Article
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.length > 0 ? (
            articles.map(article => <ArticleCard key={article.title} article={article} />)
          ) : (
            <p className="text-gray-400">No articles found.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default ArticlesPage;

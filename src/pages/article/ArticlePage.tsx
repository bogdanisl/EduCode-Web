import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import { useAuth } from "../../context/AuthProvider";
import type { Article } from "../../types/article";
import { toast, ToastContainer } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

const ArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { role } = useAuth();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await fetch(`${API_URL}api/articles/${id}`);
        if (!res.ok) throw new Error("Failed to fetch article");
        const data = await res.json();
        if (data.code !== "SUCCESS") throw new Error(data.message || "Article fetch failed");
        setArticle({
          ...data.article,
          photo: `${API_URL}/assets/articles/${data.article.id}.png`,
        });
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      const res = await fetch(`${API_URL}api/articles/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete article");
      toast.success("Article deleted successfully!");
      navigate("/articles");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

  if (loading) return <div className="text-white p-10">Loading article...</div>;
  if (error) return <div className="text-red-500 p-10">{error}</div>;
  if (!article) return <div className="text-gray-400 p-10">Article not found.</div>;

  return (
    <main className="min-h-screen bg-background-light dark:bg-background-dark p-6 sm:p-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          to="/articles"
          className="text-primary font-medium hover:underline text-sm"
        >
          ← Back to Articles
        </Link>

        <div className="flex justify-between items-start gap-4">
          <div className="space-y-2">
            <p className="text-primary font-semibold text-sm">
              {new Date(article.createdAt).toLocaleDateString('pl')}
            </p>
            <h1 className="text-4xl font-bold text-white">{article.title}</h1>
            {article.subtitle && (
              <p className="text-gray-400">{article.subtitle}</p>
            )}
          </div>

          {role === "admin" && (
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/admin/article/edit/${article.id}`)}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-500/90 font-semibold"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-500/90 font-semibold"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {article.photo && (
          <img
            src={article.photo}
            alt={article.title}
            className="w-full rounded-lg max-h-96 object-cover"
          />
        )}

        <div className="mt-6 bg-white/5 dark:bg-black/20 rounded-lg p-6">
          <MDEditor.Markdown
            source={article.content}
            style={{ backgroundColor: "transparent", color: "inherit" }}
          />
        </div>
      </div>
      <ToastContainer/>
    </main>
  );
};

export default ArticlePage;

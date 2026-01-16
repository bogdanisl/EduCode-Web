import { useState, useEffect } from "react";
import type { Article } from "../types/article";

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/articles", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch articles");
        const data = await res.json();
        setArticles(data.articles || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return { articles, loading, error };
}

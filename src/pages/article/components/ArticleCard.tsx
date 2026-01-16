import React from "react";
import { Link } from "react-router-dom";
import type { Article } from "../../../types/article";

interface ArticleCardProps {
  article: Article;
}
const API_URL = import.meta.env.VITE_API_URL;

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const { title, subtitle, createdAt, id } = article;

  const formattedDate =
    typeof createdAt === "string"
      ? new Date(createdAt).toLocaleDateString()
      : createdAt.toLocaleDateString();

  return (
    <Link to={`/articles/${id}`} className="block">
      <div className="bg-white/5 dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        {/* Image */}
        <div className="w-full h-48 overflow-hidden rounded-t-xl">
          <img
            src={`${API_URL}/assets/articles/${id}.png`}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-2">
          <h3 className="text-xl font-bold text-white dark:text-white truncate">{title}</h3>
          <p className="text-gray-300 dark:text-gray-400 text-sm line-clamp-2">{subtitle}</p>
          <span className="text-gray-500 dark:text-gray-500 text-xs mt-2">{formattedDate}</span>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;

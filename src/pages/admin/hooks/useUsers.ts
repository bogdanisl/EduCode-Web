import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import type { User } from "../../../types/user";
import { useNavigate } from "react-router-dom";

export function useUsers(role: string | undefined) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (role !== "admin") return;

    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error("Error loading users");
        const data: User[] = await res.json();
        setUsers(data);
      } catch {
        setError("Failed to load users");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [role]);

  const handleEdit = (userId: number) => {
    navigate(`/users/${userId}`);
  };

  const handleRemove = async (userId: number) => {
    if (!confirm("Are you sure you want to remove this user?")) return;

    try {
      const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch {
      toast.error("Failed to remove user.", { theme: "dark" });
    }
  };

  return { users, isLoading, error, handleEdit, handleRemove };
}

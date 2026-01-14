import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import type { User } from "../../../types/user";

export function useUser(userId: string | undefined) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${userId}`);
        if (!res.ok) throw new Error();

        const data: User = await res.json();
        setUser(data);
      } catch {
        setError("Failed to load user");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!user) return;
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: name === "lives" ? Number(value) : value,
    });
  };

  const handleSubmit = async (navigate: (path: string) => void) => {
    if (!user) return;

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      if (!res.ok) throw new Error();
      navigate("/users");
    } catch {
      toast.error("Failed to update user.", { theme: "dark" });
    }
  };

  return { user, isLoading, error, handleChange, handleSubmit };
}

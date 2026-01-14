import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthProvider";

interface LoginErrors {
  email?: string;
  password?: string;
  general?: string;
}

export function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (field: "email" | "password", value: string) => {
    if (field === "email") setEmail(value);
    else setPassword(value);

    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess("");

    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        const newErrors: LoginErrors = {};
        if (["INVALID_EMAIL", "EMAIL_REQUIRED", "USER_NOT_FOUND"].includes(data.code)) {
          newErrors.email = data.message;
        } else if (["INVALID_PASSWORD", "PASSWORD_REQUIRED"].includes(data.code)) {
          newErrors.password = data.message;
        } else {
          newErrors.general = data.message;
        }
        throw newErrors;
      }

      const data = await response.json();
      login(data.user);
      setSuccess("Login successful!");
      setEmail("");
      setPassword("");
      navigate(-1);
    } catch (err: any) {
      if (typeof err === "object") setErrors(err);
      else setErrors({ general: err.message || "Login failed" });
    } finally {
      setLoading(false);
    }
  };

  return { email, password, loading, errors, success, handleChange, handleLogin };
}

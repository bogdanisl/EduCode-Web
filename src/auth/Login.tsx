import { useState } from "react";
import "../styles/_form.scss";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const {login} = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess("");

    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Important for session cookies
      });

      if (!response.ok) {
        const data = await response.json();
        const newErrors: { [key: string]: string } = {};
        if (data.code === "INVALID_EMAIL" || data.code === "EMAIL_REQUIRED" || data.code === "USER_NOT_FOUND") {
          newErrors.email = data.message;
        } else if (data.code === "INVALID_PASSWORD" || data.code === "PASSWORD_REQUIRED") {
          newErrors.password = data.message;
        } else {
          newErrors.general = data.message;
        }
        throw newErrors;
      }

      const data = await response.json();
      setSuccess("Login successful!");
      console.log("Logged in user:", data.user);
      login(data.user)
      setEmail("");
      setPassword("");
      navigate('../')
    } catch (err: any) {
      if (typeof err === "object") setErrors(err);
      else setErrors({ general: err.message || "Login failed" });
    } finally {
      setLoading(false);
    }
  };

  // Clear errors on typing
  const handleChange = (field: string, value: string, setter: (v: string) => void) => {
    setter(value);
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a202c]">
      <div className="form-card w-full max-w-md">
        <h1 className="text-3xl font-bold text-[#63b3ed] mb-6">Welcome Back</h1>

        <form className="flex flex-col gap-4" onSubmit={handleLogin} noValidate>
          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => handleChange("email", e.target.value, setEmail)}
              className={`input-field w-full ${errors.email ? "border-red-500 animate-shake" : ""}`}
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => handleChange("password", e.target.value, setPassword)}
              className={`input-field w-full ${errors.password ? "border-red-500 animate-shake" : ""}`}
              required
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {errors.general && <p className="text-red-500 mt-4 text-center font-medium">{errors.general}</p>}
        {success && <p className="text-green-400 mt-4 text-center font-medium">{success}</p>}

        <div className="flex items-center justify-center my-6">
          <div className="border-t border-[#4a5568] w-1/3"></div>
          <span className="mx-2 text-[#a0aec0] text-sm">or</span>
          <div className="border-t border-[#4a5568] w-1/3"></div>
        </div>

        {/* OAuth Buttons */}
        <div className="flex flex-col gap-3">
          <button type="button" className="oauth-btn">
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
              alt="Google"
            />
            Continue with Google
          </button>

          <button type="button" className="oauth-btn">
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg"
              alt="Facebook"
            />
            Continue with Facebook
          </button>
        </div>

        <p className="text-center text-[#a0aec0] text-sm mt-6">
          Don’t have an account?{" "}
          <a href="/auth/register" className="text-[#63b3ed] font-medium hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;

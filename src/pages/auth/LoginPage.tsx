import "../../styles/_form.scss";
import { useLogin } from "./hooks/useLogin";

export default function Login() {
  const { email, password, loading, errors, success, handleChange, handleLogin } = useLogin();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a202c]">
      <div className="form-card w-full max-w-md">
        <h1 className="text-3xl font-bold text-[#63b3ed] mb-6">Welcome Back</h1>

        <form className="flex flex-col gap-4" onSubmit={handleLogin} noValidate>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={`input-field w-full ${errors.email ? "border-red-500 animate-shake" : ""}`}
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => handleChange("password", e.target.value)}
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

        <div className="flex flex-col gap-3">
          <button type="button" className="oauth-btn">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google" />
            Continue with Google
          </button>

          <button type="button" className="oauth-btn">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg" alt="Facebook" />
            Continue with Facebook
          </button>
        </div>

        <p className="text-center text-[#a0aec0] text-sm mt-6">
          Don't have an account?{" "}
          <a href="/auth/register" className="text-[#63b3ed] font-medium hover:underline">Register</a>
        </p>
        <p className="text-center text-[#a0aec0] text-sm mt-6">
          Forgot password?{" "}
          <a href="/auth/reset" className="text-[#63b3ed] font-medium hover:underline">Reset</a>
        </p>
      </div>
    </div>
  );
}

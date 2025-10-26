import { useState, useEffect } from "react"
import "../styles/_form.scss"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthProvider"

type Step = "email" | "code" | "new-password"

function ResetPassword() {
  const [step, setStep] = useState<Step>("email")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [success, setSuccess] = useState("")
  const [resendTimer, setResendTimer] = useState(0)
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    if (resendTimer <= 0) return
    const interval = setInterval(() => setResendTimer((t) => t - 1), 1000)
    return () => clearInterval(interval)
  }, [resendTimer])


  // універсальна функція для очищення помилок при вводі
  const handleChange = (field: string, value: string, setter: (v: string) => void) => {
    setter(value)
    if (errors[field]) setErrors({ ...errors, [field]: "" })
  }

  // Крок 1 — перевірка email
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    setSuccess("")

    try {
      const res = await fetch("/api/v1/auth/reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrors({ email: data.message || "Invalid email address" })
        return
      }

      setSuccess("Code sent to your email!")
      setStep("code")
      setResendTimer(30)
    } catch {
      setErrors({ general: "Something went wrong. Try again later." })
    } finally {
      setLoading(false)
    }
  }

  // Крок 2 — перевірка коду
  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    setSuccess("")

    try {
      const res = await fetch("/api/v1/auth/reset/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrors({ code: data.message || "Invalid code" })
        return
      }

      setSuccess("Code verified successfully!")
      setStep("new-password")
    } catch {
      setErrors({ general: "Something went wrong. Try again later." })
    } finally {
      setLoading(false)
    }
  }

  // Повторна відправка коду
  const handleResendCode = async () => {
    setResendTimer(30)
    await fetch("/api/v1/auth/reset/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
  }

  // Крок 3 — зміна пароля
  const handleNewPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    setSuccess("")

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" })
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/v1/auth/reset/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, password }),
        credentials: "include", // щоб автоматично створилась сесія
      })

      const data = await res.json()

      if (!res.ok) {
        setErrors({ general: data.message || "Failed to reset password" })
        return
      }

      // після успішного скидання — логін
      login(data.user)
      setSuccess("Password changed successfully!")
      navigate("../")
    } catch {
      setErrors({ general: "Something went wrong. Try again later." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a202c]">
      <div className="form-card w-full max-w-md">
        <h1 className="text-3xl font-bold text-[#63b3ed] mb-6">Reset Password</h1>

        {/* STEP 1 — EMAIL */}
        {step === "email" && (
          <form className="flex flex-col gap-4" onSubmit={handleEmailSubmit} noValidate>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => handleChange("email", e.target.value, setEmail)}
              className={`input-field w-full ${errors.email ? "border-red-500 animate-shake" : ""}`}
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Checking..." : "Next"}
            </button>
          </form>
        )}

        {/* STEP 2 — CODE */}
        {step === "code" && (
          <form className="flex flex-col gap-4" onSubmit={handleCodeSubmit} noValidate>
            <input
              type="text"
              placeholder="Enter verification code"
              value={code}
              onChange={(e) => handleChange("code", e.target.value, setCode)}
              className={`input-field w-full ${errors.code ? "border-red-500 animate-shake" : ""}`}
              required
            />
            {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Verifying..." : "Verify Code"}
            </button>

            <button
              type="button"
              className={` text-[#63b3ed] mt-2 ${resendTimer > 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              onClick={handleResendCode}
              disabled={resendTimer > 0}
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
            </button>
          </form>
        )}

        {/* STEP 3 — NEW PASSWORD */}
        {step === "new-password" && (
          <form className="flex flex-col gap-4" onSubmit={handleNewPasswordSubmit} >
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => handleChange("password", e.target.value, setPassword)}
              className={`input-field w-full ${errors.password ? "border-red-500 animate-shake" : ""}`}
              required
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value, setConfirmPassword)}
              className={`input-field w-full ${errors.confirmPassword ? "border-red-500 animate-shake" : ""}`}
              required
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Change Password"}
            </button>
          </form>
        )}

        {/* Стани */}
        {errors.general && <p className="text-red-500 mt-4 text-center font-medium">{errors.general}</p>}
        {success && <p className="text-green-400 mt-4 text-center font-medium">{success}</p>}

        {/* Посилання */}
        <p className="text-center text-[#a0aec0] text-sm mt-6">
          Remembered your password?{" "}
          <a href="/auth/login" className="text-[#63b3ed] font-medium hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  )
}

export default ResetPassword

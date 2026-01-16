import { useEffect, useState } from "react";
import "../../styles/_form.scss";
import { useAuth } from "../../context/AuthProvider";
import { toast, ToastContainer } from "react-toastify";
import NotFoundPage from "../NotFoundPage";

function Profile() {
    const { user } = useAuth();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (user) {
            setFullName(user.fullName);
            setEmail(user.email);
        }
    }, [user]);

    if (!user) {
        return <NotFoundPage />
    }

    // === UPDATE PROFILE ===
    const handleProfileSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setSuccess("");

        try {
            const res = await fetch(`/api/v1/users/${user?.id}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullName, email }),
            });

            if (!res.ok) {
                const data = await res.json();
                const newErrors: Record<string, string> = {};

                switch (data.code) {
                    case "INVALID_FULLNAME":
                        newErrors.fullName = data.message;
                        break;
                    case "INVALID_EMAIL":
                    case "EMAIL_EXISTS":
                        newErrors.email = data.message;
                        break;
                    case "FORBIDDEN":
                    case "USER_NOT_FOUND":
                        newErrors.general = data.message;
                        break;
                    default:
                        newErrors.general = "Something went wrong";
                }

                throw newErrors;
            }

            const data = await res.json();
            setSuccess(data.message);
            toast.success(data.message, {
                theme: 'dark',
            });
        } catch (err: any) {
            setErrors(err);
        } finally {
            setLoading(false);
        }
    };


    // === CHANGE PASSWORD ===
    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setSuccess("");

        if (newPassword !== repeatPassword) {
            setErrors({ repeatPassword: "Passwords do not match" });
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`/api/v1/users/${user?.id}/password`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            if (!res.ok) {
                const data = await res.json();
                const newErrors: Record<string, string> = {};

                switch (data.code) {
                    case "MISSING_FIELDS":
                        newErrors.general = data.message;
                        break;
                    case "INVALID_CURRENT_PASSWORD":
                        newErrors.currentPassword = data.message;
                        break;
                    case "INVALID_PASSWORD":
                    case "SAME_PASSWORD":
                        newErrors.newPassword = data.message;
                        break;
                    default:
                        newErrors.general = "Password update failed";
                }

                throw newErrors;
            }

            const data = await res.json();
            setSuccess(data.message);
            toast.success(data.message, {
                theme: 'dark',
            });
            setCurrentPassword("");
            setNewPassword("");
            setRepeatPassword("");
        } catch (err: any) {
            setErrors(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: string, value: string, setter: (v: string) => void) => {
        setter(value);
        if (errors[field]) setErrors({ ...errors, [field]: "" });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#1a202c]">
            <div className="form-card w-full max-w-md">

                <h1 className="text-3xl font-bold text-[#63b3ed] mb-6">
                    Your Profile
                </h1>

                {/* === PROFILE FORM === */}
                <form className="flex flex-col gap-4" onSubmit={handleProfileSave} noValidate>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => handleChange("fullName", e.target.value, setFullName)}
                        className={`input-field ${errors.fullName ? "border-red-500 animate-shake" : ""}`}
                    />
                    {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}

                    <input
                        type="email"
                        placeholder="Email"
                        formNoValidate
                        value={email}
                        onChange={(e) => handleChange("email", e.target.value, setEmail)}
                        className={`input-field ${errors.email ? "border-red-500 animate-shake" : ""}`}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

                    <button type="submit" className="btn-primary" disabled={loading}>
                        Save Profile
                    </button>
                </form>

                {/* === DIVIDER === */}
                <div className="flex items-center justify-center my-6">
                    <div className="border-t border-[#4a5568] w-1/3"></div>
                    <span className="mx-2 text-[#a0aec0] text-sm">password</span>
                    <div className="border-t border-[#4a5568] w-1/3"></div>
                </div>

                {/* === PASSWORD FORM === */}
                <form className="flex flex-col gap-4" onSubmit={handlePasswordChange}>
                    <input
                        type="password"
                        placeholder="Current password"
                        value={currentPassword}
                        onChange={(e) => handleChange("currentPassword", e.target.value, setCurrentPassword)}
                        className={`input-field ${errors.currentPassword ? "border-red-500 animate-shake" : ""}`}
                    />
                    {errors.currentPassword && <p className="text-red-500 text-sm">{errors.currentPassword}</p>}

                    <input
                        type="password"
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => handleChange("newPassword", e.target.value, setNewPassword)}
                        className={`input-field ${errors.newPassword ? "border-red-500 animate-shake" : ""}`}
                    />
                    {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword}</p>}

                    <input
                        type="password"
                        placeholder="Repeat new password"
                        value={repeatPassword}
                        onChange={(e) => handleChange("repeatPassword", e.target.value, setRepeatPassword)}
                        className={`input-field ${errors.repeatPassword ? "border-red-500 animate-shake" : ""}`}
                    />
                    {errors.repeatPassword && <p className="text-red-500 text-sm">{errors.repeatPassword}</p>}

                    <button type="submit" className="btn-primary" disabled={loading}>
                        Change Password
                    </button>
                </form>

                {/* === MESSAGES === */}
                {errors.general && (
                    <p className="text-red-500 mt-4 text-center font-medium">
                        {errors.general}
                    </p>
                )}

                {success && (
                    <p className="text-green-400 mt-4 text-center font-medium">
                        {success}
                    </p>
                )}
            </div>
            <ToastContainer />
        </div>
    );
}

export default Profile;

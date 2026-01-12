import { useEffect, useState } from "react";
import { useAuth, type User } from "../../../context/AuthProvider";
import NotFound from "../../notFound";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const formatDate = (timestamp: number) => {
    if (!timestamp) return "—";
    return new Date(timestamp * 1000).toLocaleString();
};

export default function UsersPage() {
    const { role } = useAuth();
    const navigate = useNavigate()


    const [userList, setUserList] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (role !== "admin") return; // SAFE inside effect

        const fetchUsers = async () => {
            try {
                setIsLoading(true);

                const res = await fetch("/api/users");

                if (!res.ok) {
                    throw new Error("Error loading users");
                }

                const data: User[] = await res.json();
                setUserList(data);
            } catch {
                setError("Failed to load users");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, [role]);

    const handleEdit = (user: User) => {
        navigate(`/users/${user.id}`)
    };

    const handleRemove = async (userId: number) => {
        if (!confirm("Are you sure you want to remove this user?")) return;

        try {
            const res = await fetch(`/api/users/${userId}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error();

            setUserList(prev => prev.filter(u => u.id !== userId));

        } catch {
            toast.error("Failed to Remove user.", {
                theme: "dark"
            });
        }
    };


    if (role !== "admin") return <NotFound />;
    if (isLoading) return (
        <div>
            <p>Loading users...</p>
        </div>
    );
    if (error) return <p>{error}</p>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6 mx-[100px]">Users</h2>

            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 mx-[100px]">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-background-dark-2 text-gray-500 dark:text-gray-200 text-left text-xs font-semibold uppercase">
                        <tr>
                            <th className="px-4 py-3 ">
                                ID
                            </th>
                            <th className="px-4 py-3 ">
                                Full name
                            </th>
                            <th className="px-4 py-3">
                                Email
                            </th>
                            <th className="px-4 py-3">
                                Lives
                            </th>
                            <th className="px-4 py-3">
                                Reset at
                            </th>
                            <th className="px-4 py-3">
                                Role
                            </th>
                            <th className="px-4 py-3">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="bg-white dark:bg-background-dark-2 divide-y divide-gray-100 dark:divide-gray-700 ">
                        {userList.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-background-dark">
                                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-100">
                                    {user.id}
                                </td>

                                <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {user.fullName}
                                </td>

                                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-100">
                                    {user.email}
                                </td>

                                <td className="px-4 py-3 text-sm text-gray-700 text-center dark:text-gray-100">
                                    {user.lives}
                                </td>

                                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-100">
                                    {formatDate(user.lives_reset_at)}
                                </td>

                                <td className="px-4 py-3 text-sm">
                                    <span className={`
                                px-2 py-1 rounded-full text-xs font-semibold
                                ${user.role === "admin"
                                            ? "bg-red-100 text-red-700"
                                            : user.role == 'tester' ? "bg-green-200 text-green-800" : "bg-blue-100 text-blue-700"}
                            `}>

                                        {user.role == 'tester' ? 'autor' : user.role}
                                    </span>
                                </td>

                                <td className="px-4 py-3 text-right space-x-2">
                                    <button
                                        onClick={() => handleEdit(user)}
                                        className="px-3 py-1 text-sm rounded-md
                                           bg-yellow-500 text-white
                                           hover:bg-yellow-600 transition"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleRemove(user.id)}
                                        className="px-3 py-1 text-sm rounded-md
                                           bg-red-600 text-white
                                           hover:bg-red-700 transition"
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ToastContainer />

        </div>

    );
}

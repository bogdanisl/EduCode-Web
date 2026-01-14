import { useParams, useNavigate } from "react-router-dom";
import NotFound from "../../NotFounPage";
import { useAuth } from "../../../context/AuthProvider";
import { ToastContainer } from "react-toastify";
import { useUser } from "../hooks/useUser";

export default function EditUserPage() {
  const { role } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { user, isLoading, error, handleChange, handleSubmit } = useUser(id);

  if (role !== "admin") return <NotFound />;

  if (isLoading) return <p className="p-6">Loading...</p>;
  if (error || !user) return <p className="p-6">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 mx-[100px]">
        Edit user #{user.id}
      </h2>

      <form
        onSubmit={(e) => { e.preventDefault(); handleSubmit(navigate); }}
        className="mx-[100px] bg-white dark:bg-background-dark-2 border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-6"
      >
        {/* Full name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Full name
          </label>
          <input
            type="text"
            name="fullName"
            value={user.fullName}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-background-dark text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-background-dark text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2"
          />
        </div>

        {/* Lives */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Lives
          </label>
          <input
            type="number"
            name="lives"
            value={user.lives}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-background-dark text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2"
          />
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Role
          </label>
          <select
            name="role"
            value={user.role}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-background-dark text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="tester">Autor</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => navigate("/users")}
            className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-green-700 text-white hover:bg-green-600 transition"
          >
            Save changes
          </button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
}

import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import UserTable from "../../components/adminUsers/UserTable";
import api from "../../api/axios";
import UserSearch from "../../components/adminUsers/UserSearch";
import UserModal from "../../components/adminUsers/UserModal";
import toast from "react-hot-toast";
import { AlertCircle, Loader2, Users, ShieldCheck, Search } from "lucide-react";

const AdminUsers = () => {
  // Full list of users fetched from the server
  const [users, setUsers] = useState([]);

  // Initial page-load state (spinner)
  const [loading, setLoading] = useState(true);

  // Holds an error message if fetchUsers() fails, so we can show a banner instead of failing silently
  const [error, setError] = useState("");

  // Search box value — filters the table client-side
  const [search, setSearch] = useState("");

  // The user currently open in the modal (view/edit mode only — there is no "create" flow yet)
  const [selectedUser, setSelectedUser] = useState(null);

  const [showModal, setShowModal] = useState(false);

  // Tracks which user row is currently being deleted (by _id), so we can
  // disable just that row's delete button instead of locking the whole table
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetches the full user list from the backend
  const fetchUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/admin/users");
      setUsers(response.data.users);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Failed to load users. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Client-side search filter — matches against name or email.
  // Optional chaining (?.) guards against any user record missing a name/email field.
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
  );

  // Deletes a single user after a confirmation prompt
  const handleDeleteUser = async (user) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${user.name}"?\n\nThis action cannot be undone.`
    );

    if (!confirmDelete) return;

    setDeletingId(user._id); // mark this specific row as "deleting"

    try {
      const response = await api.delete(`/admin/users/${user._id}`);
      toast.success(response.data.message);
      fetchUsers(); // refresh the list so the deleted user disappears
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  // Opens the modal pre-filled with an existing user's data
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const adminCount = users.filter((user) => user.role === "admin").length;

  // ---- Loading state ----
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-28 text-gray-500 dark:text-gray-400">
          <Loader2 className="animate-spin mb-3 text-green-600" size={32} />
          <p className="text-sm sm:text-base font-medium">Loading users...</p>
        </div>
      </DashboardLayout>
    );
  }

  // ---- Error state (fetch failed) ----
  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-28 text-center px-4">
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-5 py-3 rounded-2xl text-sm mb-4 shadow-sm">
            <AlertCircle size={18} className="shrink-0" />
            {error}
          </div>
          <button
            onClick={fetchUsers}
            className="px-6 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 active:scale-95 transition-all shadow-md shadow-green-600/20"
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // ---- Main content ----
  return (
    <DashboardLayout>
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 -m-4 md:-m-6 p-4 md:p-6">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-green-700 via-emerald-600 to-green-500 dark:from-gray-900 dark:via-green-900 dark:to-green-700 rounded-3xl p-5 sm:p-8 text-white mb-6 sm:mb-8 shadow-xl shadow-green-900/10">
          <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 w-56 h-56 bg-white/10 rounded-full blur-2xl" />

          <div className="relative flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-white/15 backdrop-blur-sm p-3 rounded-2xl">
                <Users size={26} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                  User Management
                </h1>
                <p className="mt-1 text-green-100 text-sm sm:text-base">
                  Manage platform users, roles and permissions.
                </p>
              </div>
            </div>

            {/* Quick stats — based on the FULL user list (users), not filteredUsers,
                so the numbers don't change while someone is just searching */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-2xl px-5 py-3 min-w-[150px]">
                <div className="bg-white/15 p-2 rounded-xl">
                  <Users size={18} />
                </div>
                <div>
                  <p className="text-green-100 text-xs">Total Users</p>
                  <h2 className="text-xl sm:text-2xl font-bold leading-tight">
                    {users.length}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3 min-w-[150px]">
                <div className="bg-white/15 p-2 rounded-xl">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="text-green-100 text-xs">Admin Users</p>
                  <h2 className="text-xl sm:text-2xl font-bold leading-tight">
                    {adminCount}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 sm:mb-8">
          <div className="max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-green-100 dark:border-gray-700 px-1">
            <UserSearch search={search} setSearch={setSearch} />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-green-100 dark:border-gray-700 overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-full mb-4">
                <Search size={28} className="text-green-600 dark:text-green-400" />
              </div>
              <p className="text-gray-700 dark:text-gray-200 font-medium">No users found</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                {search
                  ? "Try a different search term."
                  : "There are no users to display yet."}
              </p>
            </div>
          ) : (
            <UserTable
              users={filteredUsers}
              onView={handleViewUser}
              onDelete={handleDeleteUser}
              deletingId={deletingId} // pass down so UserTable can disable/spin just that row
            />
          )}
        </div>

        {showModal && (
          <UserModal
            user={selectedUser}
            onClose={() => setShowModal(false)}
            onSuccess={fetchUsers} // re-fetch the list after an edit succeeds
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminUsers;

import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import UserTable from "../../components/adminUsers/UserTable";

import api from "../../api/axios";
import UserSearch from "../../components/adminUsers/UserSearch";
import UserModal from "../../components/adminUsers/UserModal";
import toast from "react-hot-toast";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/admin/users");

      setUsers(response.data.users);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8">Loading Users...</div>
      </DashboardLayout>
    );
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDeleteUser = async (user) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${user.name}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmDelete) return;

    try {
      const response = await api.delete(`/admin/users/${user._id}`);

      toast.success(response.data.message);

      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-3xl p-8 text-white mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold">👥 User Management</h1>

              <p className="mt-2 text-green-100">
                Manage platform users, roles and permissions.
              </p>
            </div>

            <button className="mt-4 md:mt-0 bg-white text-green-700 px-6 py-3 rounded-xl font-semibold hover:bg-green-50 transition">
              + Add User
            </button>
          </div>

          <div className="flex gap-12 mt-8">
            <div>
              <p className="text-green-200 text-sm">Total Users</p>

              <h2 className="text-3xl font-bold">{users.length}</h2>
            </div>

            <div>
              <p className="text-green-200 text-sm">Admin Users</p>

              <h2 className="text-3xl font-bold">
                {users.filter((user) => user.role === "admin").length}
              </h2>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="max-w-md">
            <UserSearch search={search} setSearch={setSearch} />
          </div>
        </div>

        {/* Table */}
        <UserTable
          users={filteredUsers}
          onView={(user) => {
            setSelectedUser(user);
            setShowModal(true);
          }}
          onDelete={handleDeleteUser}
        />

        {showModal && (
          <UserModal user={selectedUser} onClose={() => setShowModal(false)} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminUsers;

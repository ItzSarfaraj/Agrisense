const UserTable = ({ users, onView, onDelete }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Users List
        </h2>

        <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-1">
          Showing {users.length} users
        </p>
      </div>

      {/* Empty State */}
      {users.length === 0 ? (
        <div className="p-10 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No users found.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-gray-100">
                  User
                </th>

                <th className="text-left p-4 font-semibold text-gray-900 dark:text-gray-100">
                  Email
                </th>

                <th className="text-left p-4 font-semibold text-gray-900 dark:text-gray-100">
                  Role
                </th>

                <th className="text-left p-4 font-semibold text-gray-900 dark:text-gray-100">
                  Joined
                </th>

                <th className="text-left p-4 font-semibold text-gray-900 dark:text-gray-100">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-green-50 dark:hover:bg-gray-700/50 transition duration-200"
                >
                  {/* User */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-green-400 text-white flex items-center justify-center font-semibold shadow-md">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-100">
                          {user.name}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="p-4 text-gray-600 dark:text-gray-300">
                    {user.email}
                  </td>

                  {/* Role */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  {/* Joined Date */}
                  <td className="p-4 text-gray-600 dark:text-gray-300">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  {/* Actions */}
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onView(user)}
                        className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition text-sm font-medium"
                      >
                        View
                      </button>

                      {user.role === "admin" ? (
                        <span className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-sm">
                          Protected
                        </span>
                      ) : (
                        <button
                          onClick={() => onDelete(user)}
                          className="px-3 py-1.5 rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition text-sm font-medium"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserTable;
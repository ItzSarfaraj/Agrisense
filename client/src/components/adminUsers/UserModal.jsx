const UserModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl"
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">User Details</h2>

            <p className="text-gray-500 mt-1">View user information</p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl transition"
          >
            ✕
          </button>
        </div>

        {/* Profile */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-green-600 text-white flex items-center justify-center text-4xl font-bold shadow-lg">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <h3 className="mt-4 text-2xl font-bold text-gray-900">{user.name}</h3>

          <span
            className={`mt-2 px-4 py-1 rounded-full text-sm font-semibold ${
              user.role === "admin"
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {user.role}
          </span>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-1">Name</p>

            <p className="font-semibold text-gray-800">{user.name}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-1">Role</p>

            <p className="font-semibold capitalize text-gray-800">
              {user.role}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 col-span-2">
            <p className="text-sm text-gray-500 mb-1">Email Address</p>

            <p className="font-semibold text-gray-800 break-all">
              {user.email}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 col-span-2">
            <p className="text-sm text-gray-500 mb-1">Joined On</p>

            <p className="font-semibold text-gray-800">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;

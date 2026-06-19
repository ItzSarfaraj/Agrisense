const AdminHero = () => {
  return (
    <div className="bg-gradient-to-r from-green-900 via-green-700 to-emerald-500 rounded-3xl shadow-lg p-8 text-white mb-8">
      <h1 className="text-4xl font-bold">👋 Welcome Back Admin</h1>

      <p className="mt-3 text-lg text-green-100">
        Monitor platform activity, manage users, crops and recommendations
        across AgriSense.
      </p>

      <div className="flex flex-wrap gap-4 mt-6">
        <button className="bg-white text-green-700 font-semibold px-6 py-3 rounded-xl hover:bg-green-50 transition">
          Manage Users
        </button>

        <button className="border border-white text-white px-6 py-3 rounded-xl hover:bg-white/10 transition">
          Crop Management
        </button>
      </div>
    </div>
  );
};

export default AdminHero;

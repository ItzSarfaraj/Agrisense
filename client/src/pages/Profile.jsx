import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { Camera } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/auth/profile");

      setUser(response.data.user);
      setName(response.data.user.name);
      setProfileImage(response.data.user.profileImage);
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      const formData = new FormData();

      formData.append("image", file);

      const response = await api.post("/auth/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setProfileImage(response.data.profileImage);
      setUser((prev) => ({
        ...prev,
        profileImage: response.data.profileImage,
      }));

      toast.success("Profile image uploaded");
    } catch (error) {
      console.error(error);

      toast.error("Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const response = await api.put("/auth/profile", { name });

      setUser(response.data.user);

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center text-gray-900 dark:text-gray-100">
          {" "}
          Loading Profile...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            Profile
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your account information and security
          </p>
        </div>

        {/* Profile Banner */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-3xl p-8 shadow-lg text-white">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <img
                src={
                  profileImage
                    ? profileImage
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.name,
                      )}&background=16a34a&color=fff&size=256`
                }
                alt={user.name}
                className="w-32 h-32 rounded-full border-4 border-white object-cover"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-1 right-1 bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 p-2 rounded-full shadow-md hover:scale-105 transition"
              >
                <Camera size={18} />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
              />
            </div>

            <div className="flex-1">
              <h2 className="text-3xl font-bold">{user.name}</h2>

              <p className="text-green-100 mt-1">{user.email}</p>

              <div className="flex flex-wrap gap-3 mt-4">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm capitalize">
                  {user.role}
                </span>

                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  Joined {new Date(user.createdAt).toLocaleDateString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl border border-green-100 dark:border-gray-700 shadow-md p-8">
          {" "}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Personal Information</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 dark:text-white outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>

              <input
                type="email"
                value={user.email}
                disabled
                className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-xl p-3 cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-500 dark:from-green-600 dark:to-green-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {saving ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;

import { Link, useNavigate } from "react-router-dom";
import {
  UserIcon,
  MailIcon,
  LockIcon,
  Leaf,
} from "lucide-react";
import heroImage from "../assets/heroImage.png";
import { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../components/auth/AuthContext";

const Register = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { register } = useContext(UserContext);

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await register(
      name,
      email,
      password
    );

    navigate("/dashboard");
  } catch (error) {
    console.error(error);
  }
};


  return (
    <div className="min-h-screen flex bg-white">

      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">

        <img
          src={heroImage}
          alt="AgriSense"
          className="absolute inset-0 w-full h-full object-cover object-left"
        />
 
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center px-8">

        <div className="w-full max-w-md">

          <div className="text-center mb-8">

            <Link
              to="/"
              className="inline-flex items-center gap-2 mb-6"
            >
              <Leaf className="size-8 text-green-600" />
              <span className="text-3xl font-bold text-green-700">
                AgriSense
              </span>
            </Link>

            <h1 className="text-3xl font-bold text-green-700">
              Create Account 🌱
            </h1>

            <p className="text-gray-500 mt-2">
              Join AgriSense and start smart farming
            </p>

          </div>

          <form onSubmit = {handleSubmit} className="space-y-5">

            <div>
              <label className="block mb-2 font-medium">
                Full Name
              </label>

              <div className="relative">

                <UserIcon
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5"
                />

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full pl-11 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />

              </div>

            </div>

            <div>
              <label className="block mb-2 font-medium">
                Email Address
              </label>

              <div className="relative">

                <MailIcon
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-11 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />

              </div>

            </div>

            <div>
              <label className="block mb-2 font-medium">
                Password
              </label>

              <div className="relative">

                <LockIcon
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5"
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create password"
                  className="w-full pl-11 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />

              </div>

            </div>

            <button
              className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
            >
              Register
            </button>

          </form>

          <p className="text-center mt-6 text-gray-600">

            Already have an account?

            <Link
              to="/login"
              className="ml-2 text-green-600 font-semibold hover:underline"
            >
              Login
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
};

export default Register;
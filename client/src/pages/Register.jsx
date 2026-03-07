import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import api from "../api/axios";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { fetchUser } = useAuth(); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      const data = new FormData();
      data.append("fullname", formData.fullname.trim());
      data.append("username", formData.username.trim());
      data.append("email", formData.email.trim());
      data.append("password", formData.password);

      if (profileImage) {
        data.append("profileImage", profileImage);
      }

      await api.post("/user/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchUser();
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  // ✅ changed to useGoogleLogin hook
  const googleSignup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError("");
      try {
        await api.post("/user/google", {
          idToken: tokenResponse.credential,
        });
        await fetchUser();
        navigate("/dashboard");
      } catch (error) {
        setError(error.response?.data?.message || "Google signup failed");
      }
    },
    onError: () => setError("Google Signup Failed"),
    flow: "implicit",
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 p-10 rounded-2xl border border-slate-800 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">
          Create Account
        </h2>

        {error && (
          <p className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-sm">
            {error}
          </p>
        )}

        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="fullname"
            placeholder="Full Name"
            required
            onChange={handleChange}
            className="w-full mb-4 p-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            required
            onChange={handleChange}
            className="w-full mb-4 p-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
            className="w-full mb-4 p-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password (min 6 characters)"
            required
            onChange={handleChange}
            className="w-full mb-4 p-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
          />

          <div className="mb-6">
            <label className="block text-sm text-slate-400 mb-3">
              Profile Photo
            </label>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <img
                    src={URL.createObjectURL(profileImage)}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-slate-500 text-xs">No Photo</span>
                )}
              </div>

              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm hover:border-blue-500 transition">
                  Upload Image
                </div>
              </label>
            </div>

            {profileImage && (
              <p className="text-xs text-slate-400 mt-2">
                Selected: {profileImage.name}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Register
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-slate-700" />
          <span className="px-3 text-slate-400 text-sm">OR</span>
          <div className="flex-1 h-px bg-slate-700" />
        </div>

        {/* ✅ custom Google button */}
        <button
          onClick={() => googleSignup()}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg hover:border-blue-500 transition text-white font-medium"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            className="w-5 h-5"
          />
          Sign up with Google
        </button>

        <p className="text-slate-400 text-sm mt-6 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
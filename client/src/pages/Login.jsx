import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import api from "../api/axios";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { fetchUser } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      let payload = { password };

      if (identifier.includes("@")) {
        payload.email = identifier;
      } else {
        payload.username = identifier;
      }

      await api.post("/user/login", payload);
      await fetchUser();
      navigate("/dashboard");

    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ✅ changed to useGoogleLogin hook
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setErrorMsg("");
      setLoading(true);
      try {
        await api.post("/user/google", {
          idToken: tokenResponse.credential,
        });
        await fetchUser();
        navigate("/dashboard");
      } catch (error) {
        setErrorMsg(error.response?.data?.message || "Google login failed");
      } finally {
        setLoading(false);
      }
    },
    onError: () => setErrorMsg("Google Login Failed"),
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
          Welcome Back
        </h2>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500 text-red-400 text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email or Username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full mb-4 p-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-6 p-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-60 flex justify-center items-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-slate-700" />
          <span className="px-3 text-slate-400 text-sm">OR</span>
          <div className="flex-1 h-px bg-slate-700" />
        </div>

        {/* ✅ custom Google button */}
        <button
          onClick={() => googleLogin()}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg hover:border-blue-500 transition text-white font-medium disabled:opacity-60"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            className="w-5 h-5"
          />
          Sign in with Google
        </button>

        <p className="text-slate-400 text-sm mt-6 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { api } from "../utils/api";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Redirect back to the page user wanted
  const from = location.state?.from || "/dashboard";

  const login = async () => {
    if (!email || !password) {
      return toast.error("Please enter email and password");
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("userId", res.data.userId);

      toast.success("Welcome back 👋");

      // Go back to intended route
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(
        err.response?.data?.msg || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-grid">

          {/* ================= FORM ================= */}
          <div className="auth-form min-h-[420px] flex flex-col justify-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              Welcome back 👋
            </h1>

            <p className="text-gray-500 text-sm mt-2 mb-8">
              Sign in to continue to Creative Showcase.
            </p>

            <input
              type="email"
              className="w-full border border-gray-200 rounded-md px-4 py-2 mb-4
                         focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              className="w-full border border-gray-200 rounded-md px-4 py-2 mb-6
                         focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={login}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-md
                         hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <p className="text-sm text-gray-500 text-center mt-6">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-indigo-600 font-medium">
                Create one
              </Link>
            </p>
          </div>

          {/* ================= IMAGE ================= */}
          <div className="auth-image hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1545235617-9465d2a55698"
              alt="creative login"
              className="h-full min-h-[420px] w-full object-cover rounded-r-xl"
            />
          </div>

        </div>
      </div>
    </div>
  );
}

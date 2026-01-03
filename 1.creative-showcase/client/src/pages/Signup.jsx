import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import toast from "react-hot-toast";

export default function Signup() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const signup = async () => {
    const { username, email, password } = form;

    // Basic validation
    if (!username || !email || !password) {
      return toast.error("All fields are required");
    }

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      setLoading(true);

      await api.post("/auth/signup", form);

      toast.success("Account created successfully 🎉");
      navigate("/login");
    } catch (err) {
      toast.error(
        err.response?.data?.msg || "Signup failed, try again"
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
          <div className="auth-form ">
            <h1 className="text-2xl font-semibold text-gray-900">
              Create your account ✨
            </h1>

            <p className="text-gray-500 text-sm mt-2 mb-8">
              Join Creative Showcase and start publishing your work.
            </p>

            <input
              type="text"
              className="w-full border border-gray-200 rounded-md px-4 py-2 mb-4
                         focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Username"
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
            />

            <input
              type="email"
              className="w-full border border-gray-200 rounded-md px-4 py-2 mb-4
                         focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              type="password"
              className="w-full border border-gray-200 rounded-md px-4 py-2 mb-6
                         focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Password (min 6 characters)"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <button
              onClick={signup}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-md
                         hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>

            <p className="text-sm text-gray-500 text-center mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-600 font-medium">
                Sign in
              </Link>
            </p>
          </div>

          {/* ================= IMAGE ================= */}
          <div className="auth-image hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97"
              alt="creative signup"
              className="h-full w-full object-cover rounded-r-xl"
            />
          </div>

        </div>
      </div>
    </div>
  );
}

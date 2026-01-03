import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  return (
    <nav className="border-b border-cyan-400 px-4 py-3">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-cyan-400 text-xl font-bold">
          Creative Showcase ✨
        </Link>

        <button
          className="md:hidden text-cyan-400 text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>

        <div className="hidden md:flex gap-3">
          {!token ? (
            <>
              <Link to="/login" className="neon-btn">Login</Link>
              <Link to="/signup" className="neon-btn">Signup</Link>
            </>
          ) : (
            <>
              <Link to={`/profile/${username}`} className="neon-btn">Profile</Link>
              <Link to="/dashboard" className="neon-btn">Dashboard</Link>
              <button onClick={logout} className="neon-btn">Logout</button>
            </>
          )}
        </div>
      </div>

      {open && (
        <div className="flex flex-col gap-2 mt-4 md:hidden">
          {!token ? (
            <>
              <Link to="/login" className="neon-btn">Login</Link>
              <Link to="/signup" className="neon-btn">Signup</Link>
            </>
          ) : (
            <>
              <Link to={`/profile/${username}`} className="neon-btn">Profile</Link>
              <Link to="/dashboard" className="neon-btn">Dashboard</Link>
              <button onClick={logout} className="neon-btn">Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

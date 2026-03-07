import { NavLink, useNavigate } from "react-router-dom";
import { Layers, FileText, LayoutDashboard, User, LogOut, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import api from "../../api/axios";

export default function Sidebar({ open, setOpen }) {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const linkBase =
    "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors";
  const linkIdle = "text-slate-400 hover:bg-slate-800 hover:text-white";
  const linkActive = "bg-slate-800 text-white";

  const handleLogout = async () => {
    try {
      await api.post("/user/logout");
    } catch {}

    setUser(null);
    navigate("/", { replace: true });
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-slate-950 border-r border-slate-800 flex flex-col z-50 transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0`}
      >
        {/* MOBILE CLOSE BUTTON */}
        <div className="lg:hidden flex justify-end p-3">
          <button onClick={() => setOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* LOGO */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold">
            AI
          </div>
          <span className="font-semibold text-white text-sm">
            AI Learning Assistant
          </span>
        </div>

        {/* NAV */}
        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkIdle}`
            }
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <NavLink
            to="/documents"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkIdle}`
            }
          >
            <FileText size={18} />
            Documents
          </NavLink>

          <NavLink
            to="/flashcards"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkIdle}`
            }
          >
            <Layers size={18} />
            Flashcards
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkIdle}`
            }
          >
            <User size={18} />
            Profile
          </NavLink>
        </nav>

        {/* LOGOUT */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
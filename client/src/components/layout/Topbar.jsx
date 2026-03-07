import { Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Topbar({ setOpen }) {
  const { user } = useAuth();

  const hour = new Date().getHours();
  let greet = "Welcome";

  if (hour < 12) greet = "Good morning";
  else if (hour < 18) greet = "Good afternoon";
  else greet = "Good evening";

  const name = user?.fullname || user?.username || "User";

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4 lg:px-6 z-40">

      {/* LEFT */}
      <div className="flex items-center gap-3">

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen(true)}
          className="lg:hidden text-white"
        >
          <Menu size={22} />
        </button>

        <div className="flex flex-col leading-tight">
          <span className="text-white text-sm font-medium">
            {greet}, {name}
          </span>
          <span className="text-white text-xs opacity-80 hidden sm:block">
            Ready to continue your learning journey
          </span>
        </div>
      </div>

      {/* RIGHT USER */}
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-white">
            {user?.username}
          </p>
          <p className="text-xs text-white opacity-70">
            {user?.email}
          </p>
        </div>

        {user?.profileImage?.url ? (
          <img
            src={user.profileImage.url}
            alt="profile"
            className="w-9 h-9 rounded-full object-cover border border-slate-700"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm font-semibold text-white">
            {user?.username?.[0]?.toUpperCase() || "U"}
          </div>
        )}
      </div>
    </header>
  );
}
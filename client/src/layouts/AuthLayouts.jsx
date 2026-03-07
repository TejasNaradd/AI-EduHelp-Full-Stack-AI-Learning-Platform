import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

export default function AuthLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="h-screen bg-slate-950 text-white flex">

      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* Right area */}
      <div className="flex-1 flex flex-col lg:ml-64">

        {/* Topbar */}
        <div className="fixed top-0 left-0 lg:left-64 right-0 h-16 z-10">
          <Topbar setOpen={setOpen} />
        </div>

        {/* Scrollable content */}
        <main className="mt-16 p-4 sm:p-6 lg:p-8 overflow-y-auto h-[calc(100vh-4rem)]">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
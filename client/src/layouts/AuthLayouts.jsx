import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

export default function AuthLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">

      <Sidebar open={open} setOpen={setOpen} />

      <div className="flex-1 flex flex-col lg:ml-64">

        <div className="fixed top-0 left-0 lg:left-64 right-0 h-16 z-10">
          <Topbar setOpen={setOpen} />
        </div>

        <main className="mt-16 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}
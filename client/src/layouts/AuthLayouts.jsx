import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

export default function AuthLayout() {
  return (
    <div className="h-screen bg-slate-950 text-white flex">
      
      {/* Sidebar fixed */}
      <div className="fixed left-0 top-0 h-screen w-64">
        <Sidebar />
      </div>

      {/* Right area */}
      <div className="flex-1 flex flex-col ml-64">
        
        {/* Topbar fixed */}
        <div className="fixed top-0 left-64 right-0 h-16 z-10">
          <Topbar />
        </div>

        {/* Scrollable content */}
        <main className="mt-16 p-8 overflow-y-auto h-[calc(100vh-4rem)]">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
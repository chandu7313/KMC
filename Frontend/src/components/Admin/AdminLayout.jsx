import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { ToastContainer } from "react-toastify";

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar />
      <ToastContainer/>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header could go here if needed */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10">
            <h2 className="text-lg font-semibold text-slate-700">Admin Panel</h2>
            <div className="flex items-center gap-4">
                {/* User Profile / Notifications */}
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                    A
                </div>
            </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

import { useState } from 'react';
import Sidebar from '../common/Sidebar';
import DashboardTopBar from '../common/DashboardTopBar';
import DashboardFooter from '../common/DashboardFooter';
import { Outlet } from 'react-router-dom';

const AuthenticatedLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto bg-gray-50 flex flex-col">
          <DashboardTopBar onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
          <div className="flex-1">
            <Outlet />
          </div>
          <DashboardFooter />
        </main>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '@/components/navigation/AdminSidebar';
import AdminTopbar from '@/components/navigation/AdminTopbar';

/**
 * Admin Portal Layout
 * Collapsible sidebar + fixed topbar + scrollable content area.
 */
const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-neutral-50 overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((p) => !p)} />

      {/* Main Area */}
      <div
        className="flex-1 flex flex-col overflow-hidden transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? 'var(--sidebar-width)' : 'var(--sidebar-collapsed-width)' }}
      >
        {/* Topbar */}
        <AdminTopbar onMenuToggle={() => setSidebarOpen((p) => !p)} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 scrollbar-thin">
          <div className="max-w-screen-xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

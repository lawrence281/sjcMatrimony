import { Outlet } from 'react-router-dom';
import ClientNavbar from '@/components/navigation/ClientNavbar';
import Footer from '@/components/navigation/Footer';

/**
 * Client Portal Layout
 * Top navigation + scrollable content + footer.
 */
const ClientLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <ClientNavbar />
      <main className="flex-1 pt-16 animate-fade-in">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ClientLayout;

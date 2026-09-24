import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import { AdminAuthProvider } from '../context/AdminAuthContext';

const AdminLayout = () => {
  return (
    <AdminAuthProvider>
      <div className="admin-layout-container">
        <AdminSidebar />
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <AdminHeader />
          <main className="main-content">
            <Outlet />
          </main>
        </div>
      </div>
    </AdminAuthProvider>
  );
};

export default AdminLayout;

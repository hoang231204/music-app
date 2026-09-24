import { FiSearch, FiBell, FiUser } from 'react-icons/fi';
import './AdminHeader.css';

const AdminHeader = () => {
  return (
    <header className="admin-header glass-panel">
      <div className="admin-search">
        <FiSearch className="search-icon" />
        <input type="text" placeholder="Tìm kiếm trong admin..." />
      </div>
      <div className="admin-header-actions">
        <button className="action-btn"><FiBell /></button>
        <div className="admin-user-profile">
          <div className="avatar"><FiUser /></div>
          <span>Admin</span>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

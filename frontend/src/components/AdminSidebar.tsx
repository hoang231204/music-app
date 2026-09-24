import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiMusic, FiList, FiMic, FiUsers, FiUserCheck, FiShield, FiLogOut, FiKey } from 'react-icons/fi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import './AdminSidebar.css';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { account, hasPermission } = useAdminAuth();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <FiHome />, permission: null },
    { name: 'Bài hát', path: '/admin/songs', icon: <FiMusic />, permission: 'song_view' },
    { name: 'Chủ đề', path: '/admin/topics', icon: <FiList />, permission: 'topic_view' },
    { name: 'Ca sĩ', path: '/admin/singers', icon: <FiMic />, permission: 'singer_view' },
    { name: 'Người dùng', path: '/admin/users', icon: <FiUsers />, permission: 'user_view' },
    { name: 'Tài khoản', path: '/admin/accounts', icon: <FiUserCheck />, permission: 'account_view' },
    { name: 'Nhóm quyền', path: '/admin/roles', icon: <FiShield />, permission: 'role_view' },
    { name: 'Phân quyền', path: '/admin/permissions', icon: <FiKey />, permission: 'role_edit' },
  ];

  const visibleNavItems = navItems.filter(item => item.permission === null || hasPermission(item.permission));

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/admin/auth/logout', {}, { withCredentials: true });
    } catch (err) {
      console.error(err);
    }
    navigate('/admin/auth/login');
  };

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <h1 className="text-gradient logo-text">Admin Panel</h1>
      </div>
      
      <nav className="nav-menu">
        <span className="nav-section-title">QUẢN LÝ</span>
        <ul>
          {visibleNavItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="sidebar-bottom">
        {account && (
          <div style={{ marginBottom: '12px', padding: '10px 16px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.05)', fontSize: '13px' }}>
            <div style={{ fontWeight: 600, color: 'white' }}>{account.fullname || account.username}</div>
            <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>{account.role_id?.title || 'Admin'}</div>
          </div>
        )}
        <button onClick={handleLogout} className="btn-primary login-btn" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <FiLogOut /> Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiMusic, FiGrid, FiHeart, FiUser, FiSearch, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import './ClientHeader.css';

const ClientHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navItems = [
    { name: 'Khám phá', path: '/', icon: <FiHome /> },
    { name: 'Bài hát', path: '/songs', icon: <FiMusic /> },
    { name: 'Chủ đề', path: '/topics', icon: <FiGrid /> },
    { name: 'Tìm kiếm', path: '/search', icon: <FiSearch /> },
    { name: 'Yêu thích', path: '/favorites', icon: <FiHeart /> },
  ];

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="client-header glass-panel">
      <div className="header-logo">
        <Link to="/">
          <h1 className="text-gradient logo-text">🎵 Melodify</h1>
        </Link>
      </div>
      
      <nav className="header-nav">
        <ul>
          {navItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={`header-nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="header-actions">
        {user ? (
          <div className="user-menu" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <div className="user-avatar">
              {user.avatar ? (
                <img src={user.avatar} alt={user.fullname} loading="lazy" />
              ) : (
                <span>{(user.fullname || user.username || 'U')[0].toUpperCase()}</span>
              )}
            </div>
            <span className="user-name">{user.fullname || user.username}</span>
            <FiChevronDown className={`chevron ${dropdownOpen ? 'open' : ''}`} />
            {dropdownOpen && (
              <div className="user-dropdown glass-panel">
                <div className="dropdown-user-info">
                  <strong>{user.fullname}</strong>
                  <small>{user.email}</small>
                </div>
                <div className="dropdown-divider" />
                <button className="dropdown-item" onClick={handleLogout}>
                  <FiLogOut /> Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/auth/login" className="btn-primary login-btn">
            <FiUser /> Đăng nhập
          </Link>
        )}
      </div>
    </header>
  );
};

export default ClientHeader;

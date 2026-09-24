import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiTrash2, FiToggleLeft, FiToggleRight, FiSearch, FiUsers, FiEdit, FiEye, FiX } from 'react-icons/fi';
import { useAdminAuth } from '../../context/AdminAuthContext';
import './Admin.css';

const Users = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [modal, setModal] = useState<'none' | 'detail'>('none');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const navigate = useNavigate();
  const { hasPermission } = useAdminAuth();

  const fetchUsers = async (search = '') => {
    setLoading(true);
    try {
      const url = search
        ? `http://localhost:3000/admin/users?keyword=${encodeURIComponent(search)}`
        : 'http://localhost:3000/admin/users';
      const res = await axios.get(url, { withCredentials: true });
      if (res.data.code === 200) {
        setData(res.data.data);
      }
    } catch (err: any) {
      if (err.response?.status === 401) navigate('/admin/auth/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(keyword);
  };

  const openDetail = async (user: any) => {
    try {
      const res = await axios.get(`http://localhost:3000/admin/users/detail/${user._id}`, { withCredentials: true });
      if (res.data.code === 200) {
        setSelectedUser(res.data.data);
        setModal('detail');
      }
    } catch {}
  };

  const handleToggleStatus = async (user: any) => {
    try {
      await axios.patch(`http://localhost:3000/admin/users/change-status/${user._id}`, {}, { withCredentials: true });
      fetchUsers(keyword);
    } catch {}
  };

  const handleDelete = async (user: any) => {
    if (!window.confirm(`Bạn có chắc muốn xóa người dùng "${user.fullname}"?`)) return;
    try {
      await axios.delete(`http://localhost:3000/admin/users/delete/${user._id}`, { withCredentials: true });
      fetchUsers(keyword);
    } catch {}
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2 className="admin-page-title">
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiUsers /> Quản lý Người dùng
          </span>
        </h2>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder="Tìm kiếm người dùng..."
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--glass-border)',
              background: 'rgba(255,255,255,0.05)',
              color: 'white',
              width: '220px',
              fontSize: '14px',
            }}
          />
          <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px' }}>
            <FiSearch /> Tìm
          </button>
        </form>
      </div>

      {/* Stats */}
      <div className="glass-panel admin-section" style={{ padding: '16px 24px' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Tổng cộng: <strong style={{ color: 'white' }}>{data?.countData ?? 0}</strong> người dùng
        </span>
      </div>

      <div className="glass-panel admin-section">
        {loading ? (
          <div className="loading-state">Đang tải...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Người dùng</th>
                <th>Email</th>
                <th>Ngày tạo</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {data?.users?.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    Không tìm thấy người dùng nào.
                  </td>
                </tr>
              )}
              {data?.users?.map((user: any) => (
                <tr key={user._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: '14px', flexShrink: 0, overflow: 'hidden'
                      }}>
                        {user.avatar
                          ? <img src={user.avatar} alt={user.fullname} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : (user.fullname || 'U')[0].toUpperCase()
                        }
                      </div>
                      <span>{user.fullname || '—'}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{user.email || '—'}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{formatDate(user.createdAt)}</td>
                  <td>
                    <span className={`status-badge ${user.status}`}>
                      {user.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon text-info" title="Chi tiết" onClick={() => openDetail(user)}>
                        <FiEye />
                      </button>
                      {hasPermission('user_edit') && (
                        <>
                          <button className="btn-icon text-primary" title="Chỉnh sửa" onClick={() => alert('Chức năng chỉnh sửa người dùng chưa hỗ trợ')}>
                            <FiEdit />
                          </button>
                          <button
                            className="btn-icon"
                            title={user.status === 'active' ? 'Khóa tài khoản' : 'Kích hoạt'}
                            onClick={() => handleToggleStatus(user)}
                            style={{ color: user.status === 'active' ? '#10b981' : '#f59e0b' }}
                          >
                            {user.status === 'active' ? <FiToggleRight /> : <FiToggleLeft />}
                          </button>
                        </>
                      )}
                      {hasPermission('user_delete') && (
                        <button
                          className="btn-icon text-danger"
                          title="Xóa người dùng"
                          onClick={() => handleDelete(user)}
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {modal === 'detail' && selectedUser && (
        <div className="modal-overlay" onClick={() => setModal('none')}>
          <div className="modal-box glass-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chi tiết người dùng</h3>
              <button className="btn-icon" onClick={() => setModal('none')}><FiX /></button>
            </div>
            <div className="modal-form">
              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', background: '#333' }}>
                  {selectedUser.avatar ? (
                    <img src={selectedUser.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', background: 'var(--primary)' }}>
                      {(selectedUser.fullname || 'U')[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '18px' }}>{selectedUser.fullname}</h4>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)' }}>{selectedUser.email}</p>
                </div>
              </div>
              <div className="form-group">
                <label>Trạng thái</label>
                <input value={selectedUser.status === 'active' ? 'Hoạt động' : 'Đã khóa'} disabled />
              </div>
              <div className="form-group">
                <label>Ngày tạo</label>
                <input value={formatDate(selectedUser.createdAt)} disabled />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setModal('none')}>Đóng</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiTrash2, FiSearch, FiUserCheck, FiEdit, FiEye, FiPlus, FiX } from 'react-icons/fi';
import { useAdminAuth } from '../../context/AdminAuthContext';
import './Admin.css';

const Accounts = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [modal, setModal] = useState<'none' | 'create' | 'edit' | 'detail'>('none');
  const [formData, setFormData] = useState({ username: '', fullname: '', email: '', password: '', role_id: '', avatar: '', status: 'active' });
  const [editId, setEditId] = useState<string | null>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { hasPermission } = useAdminAuth();

  const fetchAccounts = async (search = '') => {
    setLoading(true);
    try {
      const url = search
        ? `http://localhost:3000/admin/accounts?keyword=${encodeURIComponent(search)}`
        : 'http://localhost:3000/admin/accounts';
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

  const fetchFormData = async () => {
    try {
      const res = await axios.get('http://localhost:3000/admin/accounts/create', { withCredentials: true });
      if (res.data.code === 200) {
        setRoles(res.data.data.roles);
      }
    } catch {}
  };

  useEffect(() => {
    fetchAccounts();
    fetchFormData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAccounts(keyword);
  };

  const openCreate = () => {
    setFormData({ username: '', fullname: '', email: '', password: '', role_id: '', avatar: '', status: 'active' });
    setEditId(null);
    setModal('create');
  };

  const openEdit = async (account: any, isDetail = false) => {
    try {
      const res = await axios.get(`http://localhost:3000/admin/accounts/edit/${account._id}`, { withCredentials: true });
      if (res.data.code === 200) {
        const a = res.data.data.account;
        setRoles(res.data.data.roles || roles);
        setFormData({
          username: a.username || '',
          fullname: a.fullname || '',
          email: a.email || '',
          password: '',
          role_id: a.role_id?._id || a.role_id || '',
          avatar: a.avatar || '',
          status: a.status || 'active',
        });
        setEditId(account._id);
        setModal(isDetail ? 'detail' : 'edit');
      }
    } catch {}
  };

  const handleChange = (e: any) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
  
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (modal === 'create') {
        await axios.post('http://localhost:3000/admin/accounts/create', formData, { withCredentials: true });
      } else if (modal === 'edit' && editId) {
        await axios.patch(`http://localhost:3000/admin/accounts/edit/${editId}`, formData, { withCredentials: true });
      }
      setModal('none');
      fetchAccounts(keyword);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (account: any) => {
    if (!window.confirm(`Bạn có chắc muốn xóa tài khoản "${account.fullname}"?`)) return;
    try {
      await axios.delete(`http://localhost:3000/admin/accounts/delete/${account._id}`, { withCredentials: true });
      fetchAccounts(keyword);
    } catch {}
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2 className="admin-page-title">
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiUserCheck /> Quản lý Tài khoản
          </span>
        </h2>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder="Tìm kiếm tài khoản..."
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
        {hasPermission('account_create') && (
          <button className="btn-primary" style={{ display: 'flex', gap: '8px', alignItems: 'center', marginLeft: '16px' }} onClick={openCreate}>
            <FiPlus /> Thêm
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="glass-panel admin-section" style={{ padding: '16px 24px' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Tổng cộng: <strong style={{ color: 'white' }}>{data?.countData ?? 0}</strong> tài khoản
        </span>
      </div>

      <div className="glass-panel admin-section">
        {loading ? (
          <div className="loading-state">Đang tải...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tài khoản</th>
                <th>Email</th>
                <th>Nhóm quyền</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {data?.accounts?.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    Không tìm thấy tài khoản nào.
                  </td>
                </tr>
              )}
              {data?.accounts?.map((account: any) => (
                <tr key={account._id}>
                  <td>
                    <span>{account.fullname || '—'}</span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{account.email || '—'}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{account.role_id?.title || '—'}</td>
                  <td>
                    <span className={`status-badge ${account.status}`}>
                      {account.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon text-info" title="Chi tiết" onClick={() => openEdit(account, true)}>
                        <FiEye />
                      </button>
                      {hasPermission('account_edit') && (
                        <button className="btn-icon text-primary" title="Chỉnh sửa" onClick={() => openEdit(account, false)}>
                          <FiEdit />
                        </button>
                      )}
                      {hasPermission('account_delete') && (
                        <button
                          className="btn-icon text-danger"
                          title="Xóa tài khoản"
                          onClick={() => handleDelete(account)}
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
      {modal !== 'none' && (
        <div className="modal-overlay" onClick={() => setModal('none')}>
          <div className="modal-box glass-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modal === 'create' ? 'Thêm tài khoản' : modal === 'edit' ? 'Chỉnh sửa tài khoản' : 'Chi tiết tài khoản'}</h3>
              <button className="btn-icon" onClick={() => setModal('none')}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Họ tên <span className="required">*</span></label>
                  <input name="fullname" value={formData.fullname} onChange={handleChange} disabled={modal === 'detail'} required />
                </div>
                <div className="form-group">
                  <label>Username <span className="required">*</span></label>
                  <input name="username" value={formData.username} onChange={handleChange} disabled={modal === 'detail'} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email <span className="required">*</span></label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} disabled={modal === 'detail'} required />
                </div>
                <div className="form-group">
                  <label>Mật khẩu {modal === 'edit' && '(Bỏ trống nếu không đổi)'} {modal === 'create' && <span className="required">*</span>}</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} disabled={modal === 'detail'} required={modal === 'create'} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Nhóm quyền</label>
                  <select name="role_id" value={formData.role_id} onChange={handleChange} disabled={modal === 'detail'}>
                    <option value="">-- Chọn --</option>
                    {roles.map(r => <option key={r._id} value={r._id}>{r.title}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Trạng thái</label>
                  <select name="status" value={formData.status} onChange={handleChange} disabled={modal === 'detail'}>
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Khóa</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>URL Avatar</label>
                <input name="avatar" value={formData.avatar} onChange={handleChange} disabled={modal === 'detail'} placeholder="https://..." />
                {formData.avatar && <img src={formData.avatar} alt="preview" className="img-preview" onError={e => (e.currentTarget.style.display = 'none')} />}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setModal('none')}>Đóng</button>
                {modal !== 'detail' && (
                  <button type="submit" className="btn-primary" disabled={submitting}>
                    {submitting ? 'Đang lưu...' : 'Lưu'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;

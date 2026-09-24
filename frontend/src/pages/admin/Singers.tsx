import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiTrash2, FiSearch, FiMic, FiEdit, FiEye, FiPlus, FiX } from 'react-icons/fi';
import { useAdminAuth } from '../../context/AdminAuthContext';
import './Admin.css';

const Singers = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [modal, setModal] = useState<'none' | 'create' | 'edit' | 'detail'>('none');
  const [formData, setFormData] = useState({ fullname: '', avatar: '', status: 'active', description: '' });
  const [editId, setEditId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { hasPermission } = useAdminAuth();

  const fetchSingers = async (search = '') => {
    setLoading(true);
    try {
      const url = search
        ? `http://localhost:3000/admin/singers?keyword=${encodeURIComponent(search)}`
        : 'http://localhost:3000/admin/singers';
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
    fetchSingers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSingers(keyword);
  };

  const openCreate = () => {
    setFormData({ fullname: '', avatar: '', status: 'active', description: '' });
    setEditId(null);
    setModal('create');
  };

  const openEdit = async (singer: any, isDetail = false) => {
    try {
      const res = await axios.get(`http://localhost:3000/admin/singers/edit/${singer._id}`, { withCredentials: true });
      if (res.data.code === 200) {
        const s = res.data.data;
        setFormData({
          fullname: s.fullname || '',
          avatar: s.avatar || '',
          status: s.status || 'active',
          description: s.description || '',
        });
        setEditId(singer._id);
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
        await axios.post('http://localhost:3000/admin/singers/create', formData, { withCredentials: true });
      } else if (modal === 'edit' && editId) {
        await axios.patch(`http://localhost:3000/admin/singers/edit/${editId}`, formData, { withCredentials: true });
      }
      setModal('none');
      fetchSingers(keyword);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (singer: any) => {
    if (!window.confirm(`Bạn có chắc muốn xóa ca sĩ "${singer.fullname}"?`)) return;
    try {
      await axios.delete(`http://localhost:3000/admin/singers/delete/${singer._id}`, { withCredentials: true });
      fetchSingers(keyword);
    } catch {}
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2 className="admin-page-title">
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiMic /> Quản lý Ca sĩ
          </span>
        </h2>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder="Tìm kiếm ca sĩ..."
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
        {hasPermission('singer_create') && (
          <button className="btn-primary" style={{ display: 'flex', gap: '8px', alignItems: 'center', marginLeft: '16px' }} onClick={openCreate}>
            <FiPlus /> Thêm
          </button>
        )}
      </div>

      <div className="glass-panel admin-section" style={{ padding: '16px 24px' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Tổng cộng: <strong style={{ color: 'white' }}>{data?.countData ?? 0}</strong> ca sĩ
        </span>
      </div>

      <div className="glass-panel admin-section">
        {loading ? (
          <div className="loading-state">Đang tải...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Tên ca sĩ</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {data?.singers?.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    Không tìm thấy ca sĩ nào.
                  </td>
                </tr>
              )}
              {data?.singers?.map((singer: any) => (
                <tr key={singer._id}>
                  <td>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', background: '#333' }}>
                      {singer.avatar ? (
                        <img src={singer.avatar} alt={singer.fullname} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '16px' }}>🎤</span>
                      )}
                    </div>
                  </td>
                  <td><strong>{singer.fullname}</strong></td>
                  <td>
                    <span className={`status-badge ${singer.status}`}>
                      {singer.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon text-info" title="Chi tiết" onClick={() => openEdit(singer, true)}>
                        <FiEye />
                      </button>
                      {hasPermission('singer_edit') && (
                        <button className="btn-icon text-primary" title="Chỉnh sửa" onClick={() => openEdit(singer, false)}>
                          <FiEdit />
                        </button>
                      )}
                      {hasPermission('singer_delete') && (
                        <button
                          className="btn-icon text-danger"
                          title="Xóa ca sĩ"
                          onClick={() => handleDelete(singer)}
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
              <h3>{modal === 'create' ? 'Thêm ca sĩ' : modal === 'edit' ? 'Chỉnh sửa ca sĩ' : 'Chi tiết ca sĩ'}</h3>
              <button className="btn-icon" onClick={() => setModal('none')}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Tên ca sĩ <span className="required">*</span></label>
                <input name="fullname" value={formData.fullname} onChange={handleChange} disabled={modal === 'detail'} required />
              </div>
              <div className="form-group">
                <label>Mô tả</label>
                <textarea name="description" value={formData.description} onChange={handleChange} disabled={modal === 'detail'} rows={3} />
              </div>
              <div className="form-group">
                <label>URL Hình ảnh</label>
                <input name="avatar" value={formData.avatar} onChange={handleChange} disabled={modal === 'detail'} placeholder="https://..." />
                {formData.avatar && <img src={formData.avatar} alt="preview" className="img-preview" onError={e => (e.currentTarget.style.display = 'none')} />}
              </div>
              <div className="form-group">
                <label>Trạng thái</label>
                <select name="status" value={formData.status} onChange={handleChange} disabled={modal === 'detail'}>
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Khóa</option>
                </select>
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

export default Singers;

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiTrash2, FiSearch, FiList, FiEdit, FiEye, FiPlus, FiX } from 'react-icons/fi';
import { useAdminAuth } from '../../context/AdminAuthContext';
import './Admin.css';

const Topics = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [modal, setModal] = useState<'none' | 'create' | 'edit' | 'detail'>('none');
  const [formData, setFormData] = useState({ title: '', description: '', avatar: '', status: 'active' });
  const [editId, setEditId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { hasPermission } = useAdminAuth();

  const fetchTopics = async (search = '') => {
    setLoading(true);
    try {
      const url = search
        ? `http://localhost:3000/admin/topics?keyword=${encodeURIComponent(search)}`
        : 'http://localhost:3000/admin/topics';
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
    fetchTopics();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTopics(keyword);
  };

  const openCreate = () => {
    setFormData({ title: '', description: '', avatar: '', status: 'active' });
    setEditId(null);
    setModal('create');
  };

  const openEdit = async (topic: any, isDetail = false) => {
    try {
      const res = await axios.get(`http://localhost:3000/admin/topics/edit/${topic._id}`, { withCredentials: true });
      if (res.data.code === 200) {
        const t = res.data.data;
        setFormData({
          title: t.title || '',
          description: t.description || '',
          avatar: t.avatar || '',
          status: t.status || 'active',
        });
        setEditId(topic._id);
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
        await axios.post('http://localhost:3000/admin/topics/create', formData, { withCredentials: true });
      } else if (modal === 'edit' && editId) {
        await axios.patch(`http://localhost:3000/admin/topics/edit/${editId}`, formData, { withCredentials: true });
      }
      setModal('none');
      fetchTopics(keyword);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (topic: any) => {
    if (!window.confirm(`Bạn có chắc muốn xóa chủ đề "${topic.title}"?`)) return;
    try {
      await axios.delete(`http://localhost:3000/admin/topics/delete/${topic._id}`, { withCredentials: true });
      fetchTopics(keyword);
    } catch {}
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2 className="admin-page-title">
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiList /> Quản lý Chủ đề
          </span>
        </h2>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder="Tìm kiếm chủ đề..."
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
        {hasPermission('topic_create') && (
          <button className="btn-primary" style={{ display: 'flex', gap: '8px', alignItems: 'center', marginLeft: '16px' }} onClick={openCreate}>
            <FiPlus /> Thêm
          </button>
        )}
      </div>

      <div className="glass-panel admin-section" style={{ padding: '16px 24px' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Tổng cộng: <strong style={{ color: 'white' }}>{data?.countData ?? 0}</strong> chủ đề
        </span>
      </div>

      <div className="glass-panel admin-section">
        {loading ? (
          <div className="loading-state">Đang tải...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Hình ảnh</th>
                <th>Tiêu đề</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {data?.topics?.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    Không tìm thấy chủ đề nào.
                  </td>
                </tr>
              )}
              {data?.topics?.map((topic: any) => (
                <tr key={topic._id}>
                  <td>
                    <div style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', background: '#333' }}>
                      {topic.avatar ? (
                        <img src={topic.avatar} alt={topic.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '24px' }}>🖼️</span>
                      )}
                    </div>
                  </td>
                  <td><strong>{topic.title}</strong></td>
                  <td>
                    <span className={`status-badge ${topic.status}`}>
                      {topic.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon text-info" title="Chi tiết" onClick={() => openEdit(topic, true)}>
                        <FiEye />
                      </button>
                      {hasPermission('topic_edit') && (
                        <button className="btn-icon text-primary" title="Chỉnh sửa" onClick={() => openEdit(topic, false)}>
                          <FiEdit />
                        </button>
                      )}
                      {hasPermission('topic_delete') && (
                        <button
                          className="btn-icon text-danger"
                          title="Xóa chủ đề"
                          onClick={() => handleDelete(topic)}
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
              <h3>{modal === 'create' ? 'Thêm chủ đề' : modal === 'edit' ? 'Chỉnh sửa chủ đề' : 'Chi tiết chủ đề'}</h3>
              <button className="btn-icon" onClick={() => setModal('none')}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Tiêu đề <span className="required">*</span></label>
                <input name="title" value={formData.title} onChange={handleChange} disabled={modal === 'detail'} required />
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

export default Topics;

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiTrash2, FiShield, FiEdit, FiEye, FiPlus, FiX } from 'react-icons/fi';
import { useAdminAuth } from '../../context/AdminAuthContext';
import './Admin.css';

const Roles = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'none' | 'create' | 'edit' | 'detail'>('none');
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [editId, setEditId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { hasPermission } = useAdminAuth();

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/admin/roles', { withCredentials: true });
      if (res.data.code === 200) {
        setData(res.data.data); // data is an array
      }
    } catch (err: any) {
      if (err.response?.status === 401) navigate('/admin/auth/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const openCreate = () => {
    setFormData({ title: '', description: '' });
    setEditId(null);
    setModal('create');
  };

  const openEdit = async (role: any, isDetail = false) => {
    try {
      const res = await axios.get(`http://localhost:3000/admin/roles/edit/${role._id}`, { withCredentials: true });
      if (res.data.code === 200) {
        const r = res.data.data;
        setFormData({
          title: r.title || '',
          description: r.description || ''
        });
        setEditId(role._id);
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
        await axios.post('http://localhost:3000/admin/roles/create', formData, { withCredentials: true });
      } else if (modal === 'edit' && editId) {
        await axios.patch(`http://localhost:3000/admin/roles/edit/${editId}`, formData, { withCredentials: true });
      }
      setModal('none');
      fetchRoles();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (role: any) => {
    if (!window.confirm(`Bạn có chắc muốn xóa nhóm quyền "${role.title}"?`)) return;
    try {
      await axios.delete(`http://localhost:3000/admin/roles/delete/${role._id}`, { withCredentials: true });
      fetchRoles();
    } catch {}
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2 className="admin-page-title">
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiShield /> Quản lý Nhóm quyền
          </span>
        </h2>
        {hasPermission('role_create') && (
          <button className="btn-primary" style={{ display: 'flex', gap: '8px', alignItems: 'center' }} onClick={openCreate}>
            <FiPlus /> Thêm
          </button>
        )}
      </div>

      <div className="glass-panel admin-section">
        {loading ? (
          <div className="loading-state">Đang tải...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Mô tả</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {!data || data.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    Không tìm thấy nhóm quyền nào.
                  </td>
                </tr>
              ) : (
                data.map((role: any) => (
                  <tr key={role._id}>
                    <td>
                      <strong>{role.title}</strong>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{role.description || '—'}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon text-info" title="Chi tiết" onClick={() => openEdit(role, true)}>
                          <FiEye />
                        </button>
                        {hasPermission('role_edit') && (
                          <button className="btn-icon text-primary" title="Chỉnh sửa" onClick={() => openEdit(role, false)}>
                            <FiEdit />
                          </button>
                        )}
                        {hasPermission('role_delete') && (
                          <button
                            className="btn-icon text-danger"
                            title="Xóa nhóm quyền"
                            onClick={() => handleDelete(role)}
                          >
                            <FiTrash2 />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {modal !== 'none' && (
        <div className="modal-overlay" onClick={() => setModal('none')}>
          <div className="modal-box glass-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modal === 'create' ? 'Thêm nhóm quyền' : modal === 'edit' ? 'Chỉnh sửa nhóm quyền' : 'Chi tiết nhóm quyền'}</h3>
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

export default Roles;

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiEdit, FiTrash2, FiPlus, FiX, FiToggleLeft, FiToggleRight, FiEye } from 'react-icons/fi';
import { useAdminAuth } from '../../context/AdminAuthContext';
import './Admin.css';

interface FormData {
  title: string;
  singerId: string;
  topicId: string;
  avatar: string;
  audio: string;
  description: string;
  lyrics: string;
  status: string;
}

const defaultForm: FormData = {
  title: '',
  singerId: '',
  topicId: '',
  avatar: '',
  audio: '',
  description: '',
  lyrics: '',
  status: 'active',
};

const Songs = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'none' | 'create' | 'edit' | 'detail'>('none');
  const [formData, setFormData] = useState<FormData>(defaultForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [singers, setSingers] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { hasPermission } = useAdminAuth();

  const fetchSongs = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/admin/songs', { withCredentials: true });
      if (response.data.code === 200) {
        setData(response.data.data);
      }
    } catch (error: any) {
      if (error.response?.status === 401) { navigate('/admin/auth/login'); return; }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFormData = async () => {
    try {
      const res = await axios.get('http://localhost:3000/admin/songs/create', { withCredentials: true });
      if (res.data.code === 200) {
        setSingers(res.data.data.singers);
        setTopics(res.data.data.topics);
      }
    } catch {}
  };

  useEffect(() => {
    fetchSongs();
    fetchFormData();
  }, []);

  const openCreate = () => {
    setFormData(defaultForm);
    setEditId(null);
    setModal('create');
  };

  const openEdit = async (song: any, isDetail = false) => {
    try {
      const res = await axios.get(`http://localhost:3000/admin/songs/edit/${song._id}`, { withCredentials: true });
      if (res.data.code === 200) {
        const s = res.data.data.song;
        setSingers(res.data.data.singers);
        setTopics(res.data.data.topics);
        setFormData({
          title: s.title || '',
          singerId: s.singer_id?._id || s.singer_id || '',
          topicId: s.topic_id?._id || s.topic_id || '',
          avatar: s.avatar || '',
          audio: s.audio || '',
          description: s.description || '',
          lyrics: s.lyrics || '',
          status: s.status || 'active',
        });
        setEditId(song._id);
        setModal(isDetail ? 'detail' : 'edit');
      }
    } catch {}
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa bài hát này?')) {
      try {
        await axios.delete(`http://localhost:3000/admin/songs/delete/${id}`, { withCredentials: true });
        fetchSongs();
      } catch (error: any) {
        if (error.response?.status === 401) navigate('/admin/auth/login');
      }
    }
  };

  const handleToggleStatus = async (song: any) => {
    const newStatus = song.status === 'active' ? 'inactive' : 'active';
    try {
      await axios.patch(`http://localhost:3000/admin/songs/change-multi`, { ids: song._id, type: newStatus }, { withCredentials: true });
      fetchSongs();
    } catch {}
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (modal === 'create') {
        await axios.post('http://localhost:3000/admin/songs/create', formData, { withCredentials: true });
      } else if (modal === 'edit' && editId) {
        await axios.patch(`http://localhost:3000/admin/songs/edit/${editId}`, formData, { withCredentials: true });
      }
      setModal('none');
      fetchSongs();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading-state">Đang tải danh sách bài hát...</div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2 className="admin-page-title">Quản lý Bài hát</h2>
        {hasPermission('song_create') && (
          <button className="btn-primary" style={{ display: 'flex', gap: '8px', alignItems: 'center' }} onClick={openCreate}>
            <FiPlus /> Thêm bài hát
          </button>
        )}
      </div>

      <div className="glass-panel admin-section">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Tiêu đề</th>
              <th>Ca sĩ</th>
              <th>Lượt nghe</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {data?.songs?.map((song: any) => (
              <tr key={song._id}>
                <td>
                  <img src={song.avatar} alt={song.title} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                </td>
                <td>{song.title}</td>
                <td>{song.singer_id?.fullname || 'Không rõ'}</td>
                <td>{song.listen?.toLocaleString()}</td>
                <td>
                  <span className={`status-badge ${song.status}`}>
                    {song.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon text-info" title="Chi tiết" onClick={() => openEdit(song, true)}><FiEye /></button>
                    {hasPermission('song_edit') && <button className="btn-icon text-primary" title="Sửa" onClick={() => openEdit(song, false)}><FiEdit /></button>}
                    {hasPermission('song_edit') && (
                      <button
                        className="btn-icon"
                        title={song.status === 'active' ? 'Khóa' : 'Kích hoạt'}
                        onClick={() => handleToggleStatus(song)}
                        style={{ color: song.status === 'active' ? '#10b981' : '#f59e0b' }}
                      >
                        {song.status === 'active' ? <FiToggleRight /> : <FiToggleLeft />}
                      </button>
                    )}
                    {hasPermission('song_delete') && <button className="btn-icon text-danger" title="Xóa" onClick={() => handleDelete(song._id)}><FiTrash2 /></button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal !== 'none' && (
        <div className="modal-overlay" onClick={() => setModal('none')}>
          <div className="modal-box glass-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modal === 'create' ? 'Thêm bài hát mới' : modal === 'edit' ? 'Chỉnh sửa bài hát' : 'Chi tiết bài hát'}</h3>
              <button className="btn-icon" onClick={() => setModal('none')}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Tiêu đề <span className="required">*</span></label>
                  <input name="title" value={formData.title} onChange={handleChange} disabled={modal === 'detail'} required placeholder="Nhập tên bài hát" />
                </div>
                <div className="form-group">
                  <label>Trạng thái</label>
                  <select name="status" value={formData.status} onChange={handleChange} disabled={modal === 'detail'}>
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Khóa</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Ca sĩ</label>
                  <select name="singerId" value={formData.singerId} onChange={handleChange} disabled={modal === 'detail'}>
                    <option value="">-- Chọn ca sĩ --</option>
                    {singers.map((s: any) => <option key={s._id} value={s._id}>{s.fullname}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Chủ đề</label>
                  <select name="topicId" value={formData.topicId} onChange={handleChange} disabled={modal === 'detail'}>
                    <option value="">-- Chọn chủ đề --</option>
                    {topics.map((t: any) => <option key={t._id} value={t._id}>{t.title}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>URL ảnh bìa</label>
                <input name="avatar" value={formData.avatar} onChange={handleChange} disabled={modal === 'detail'} placeholder="https://..." />
                {formData.avatar && <img src={formData.avatar} alt="preview" className="img-preview" onError={e => (e.currentTarget.style.display = 'none')} />}
              </div>
              <div className="form-group">
                <label>URL file nhạc (audio)</label>
                <input name="audio" value={formData.audio} onChange={handleChange} disabled={modal === 'detail'} placeholder="https://..." />
              </div>
              <div className="form-group">
                <label>Mô tả</label>
                <textarea name="description" value={formData.description} onChange={handleChange} disabled={modal === 'detail'} rows={2} placeholder="Mô tả ngắn..." />
              </div>
              <div className="form-group">
                <label>Lời bài hát</label>
                <textarea name="lyrics" value={formData.lyrics} onChange={handleChange} disabled={modal === 'detail'} rows={4} placeholder="Lời bài hát..." />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setModal('none')}>Đóng</button>
                {modal !== 'detail' && (
                  <button type="submit" className="btn-primary" disabled={submitting}>
                    {submitting ? 'Đang lưu...' : (modal === 'create' ? 'Thêm bài hát' : 'Lưu thay đổi')}
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

export default Songs;

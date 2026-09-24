import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Admin.css';

const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axios.get('http://localhost:3000/admin/dashboard', { withCredentials: true });
        if (response.data.code === 200) {
          setData(response.data.data);
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
          navigate('/admin/auth/login');
          return;
        }
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [navigate]);

  if (loading) return <div className="loading-state">Đang tải dữ liệu Dashboard...</div>;
  if (!data) return <div className="loading-state">Không có dữ liệu. Vui lòng đăng nhập.</div>;

  return (
    <div className="admin-page">
      <h2 className="admin-page-title">Tổng quan hệ thống</h2>
      <div className="glass-panel admin-section">
        <div className="grid-stats">
          <div className="stat-card">
            <h3>Tổng Bài Hát</h3>
            <p>{data.totalSongs ?? 0}</p>
          </div>
          <div className="stat-card">
            <h3>Tổng Ca Sĩ</h3>
            <p>{data.totalSingers ?? 0}</p>
          </div>
          <div className="stat-card">
            <h3>Tổng Chủ Đề</h3>
            <p>{data.totalTopics ?? 0}</p>
          </div>
          <div className="stat-card">
            <h3>Tổng Người Dùng</h3>
            <p>{data.totalUsers ?? 0}</p>
          </div>
        </div>

        <h3>Bài hát mới thêm</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tên bài hát</th>
              <th>Ca sĩ</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {data.recentSongs?.map((song: any, i: number) => (
              <tr key={i}>
                <td>{song.title}</td>
                <td>{song.singer}</td>
                <td><span className={`status-badge ${song.status}`}>{song.status === 'active' ? 'Hoạt động' : 'Đã khóa'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 style={{ marginTop: '24px' }}>Người dùng mới</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Email</th>
              <th>Ngày tham gia</th>
            </tr>
          </thead>
          <tbody>
            {data.recentUsers?.map((user: any, i: number) => (
              <tr key={i}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.joinDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;

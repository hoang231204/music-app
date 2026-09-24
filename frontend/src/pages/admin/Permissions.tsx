import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiShield, FiSave } from 'react-icons/fi';
import './Admin.css';

const features = [
  { id: 'song', name: 'Quản lý Bài hát' },
  { id: 'topic', name: 'Quản lý Chủ đề' },
  { id: 'singer', name: 'Quản lý Ca sĩ' },
  { id: 'user', name: 'Quản lý Người dùng' },
  { id: 'account', name: 'Quản lý Tài khoản' },
  { id: 'role', name: 'Quản lý Nhóm quyền' },
];

const actions = [
  { id: 'view', name: 'Xem' },
  { id: 'create', name: 'Thêm mới' },
  { id: 'edit', name: 'Sửa' },
  { id: 'delete', name: 'Xóa' },
];

const Permissions = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/admin/roles/permissions', { withCredentials: true });
      if (res.data.code === 200) {
        setRoles(res.data.data); // data is an array of roles
      }
    } catch (err: any) {
      if (err.response?.status === 401) navigate('/admin/auth/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const handleTogglePermission = (roleIndex: number, permString: string, checked: boolean) => {
    const newRoles = [...roles];
    const role = { ...newRoles[roleIndex] };
    const perms = role.permissions ? [...role.permissions] : [];
    if (checked) {
      if (!perms.includes(permString)) perms.push(permString);
    } else {
      const idx = perms.indexOf(permString);
      if (idx > -1) perms.splice(idx, 1);
    }
    role.permissions = perms;
    newRoles[roleIndex] = role;
    setRoles(newRoles);
  };

  const handleSave = async () => {
    try {
      const payload = {
        permissions: JSON.stringify(roles.map(r => ({ id: r._id, permissions: r.permissions || [] })))
      };
      await axios.patch('http://localhost:3000/admin/roles/permissions', payload, { withCredentials: true });
      alert("Cập nhật phân quyền thành công!");
    } catch (err) {
      alert("Có lỗi xảy ra khi lưu phân quyền.");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2 className="admin-page-title">
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiShield /> Phân quyền
          </span>
        </h2>
        <button onClick={handleSave} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px' }}>
          <FiSave /> Cập nhật
        </button>
      </div>

      <div className="glass-panel admin-section">
        {loading ? (
          <div className="loading-state">Đang tải...</div>
        ) : (
          <div style={{ padding: '20px' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Tính năng phân quyền chi tiết (Ma trận phân quyền) sẽ được xây dựng tại đây.</p>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tính năng</th>
                  {roles.map(role => (
                    <th key={role._id} style={{ textAlign: 'center' }}>{role.title}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map(feature => (
                  <React.Fragment key={feature.id}>
                    <tr>
                      <td colSpan={roles.length + 1} style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--primary)' }}>
                        <strong>{feature.name}</strong>
                      </td>
                    </tr>
                    {actions.map(action => {
                      const permString = `${feature.id}_${action.id}`;
                      return (
                        <tr key={permString}>
                          <td style={{ paddingLeft: '40px' }}>{action.name}</td>
                          {roles.map((role, roleIndex) => (
                            <td key={role._id} style={{ textAlign: 'center' }}>
                              <input
                                type="checkbox"
                                checked={role.permissions?.includes(permString) || false}
                                onChange={(e) => handleTogglePermission(roleIndex, permString, e.target.checked)}
                              />
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Permissions;

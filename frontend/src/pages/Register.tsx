import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    fullname: '',
    email: '',
    password: '',
    confirm_password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      setError('Mật khẩu không khớp!');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3000/auth/register', formData);
      if (response.data.code === 200) {
        navigate('/auth/login');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  return (
    <div className="home-container" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', paddingTop: '40px' }}>
      <div className="glass-panel" style={{ padding: '40px', width: '100%', maxWidth: '400px', borderRadius: 'var(--radius-lg)' }}>
        <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Đăng ký tài khoản</h2>
        {error && <div style={{ color: 'var(--secondary)', marginBottom: '16px' }}>{error}</div>}
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input type="text" name="username" aria-label="Tên đăng nhập" placeholder="Tên đăng nhập" onChange={handleChange} required
            style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
          <input type="text" name="fullname" aria-label="Họ tên" placeholder="Họ tên" onChange={handleChange} required
            style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
          <input type="email" name="email" aria-label="Email" placeholder="Email" onChange={handleChange} required
            style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
          <input type="password" name="password" aria-label="Mật khẩu" placeholder="Mật khẩu" onChange={handleChange} required
            style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
          <input type="password" name="confirm_password" aria-label="Xác nhận mật khẩu" placeholder="Xác nhận mật khẩu" onChange={handleChange} required
            style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
          <button type="submit" className="btn-primary" style={{ marginTop: '16px' }}>Đăng ký</button>
        </form>
        <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
          Đã có tài khoản? <Link to="/auth/login" style={{ color: 'var(--primary)' }}>Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

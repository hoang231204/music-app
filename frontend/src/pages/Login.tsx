import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/login', { username, password }, { withCredentials: true });
      if (response.data.code === 200) {
        const meRes = await axios.get('http://localhost:3000/auth/me', { withCredentials: true });
        if (meRes.data.code === 200) {
          login(meRes.data.data);
        }
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className="home-container" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', paddingTop: '100px' }}>
      <div className="glass-panel" style={{ padding: '40px', width: '100%', maxWidth: '400px', borderRadius: 'var(--radius-lg)' }}>
        <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Đăng nhập</h2>
        {error && <div style={{ color: 'var(--secondary)', marginBottom: '16px' }}>{error}</div>}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label htmlFor="login-username" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Tên đăng nhập</label>
            <input 
              id="login-username"
              type="text" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
              required 
            />
          </div>
          <div>
            <label htmlFor="login-password" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Mật khẩu</label>
            <input 
              id="login-password"
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
              required 
            />
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '16px' }}>Đăng nhập</button>
        </form>
        <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
          Chưa có tài khoản? <Link to="/auth/register" style={{ color: 'var(--primary)' }}>Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

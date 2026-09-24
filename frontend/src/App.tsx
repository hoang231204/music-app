import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ClientLayout from './layouts/ClientLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home';
import Songs from './pages/Songs';
import Topics from './pages/Topics';
import Search from './pages/Search';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import Register from './pages/Register';
import { PlayerProvider } from './context/PlayerContext';
import { AuthProvider } from './context/AuthContext';
import './index.css';

import AdminDashboard from './pages/admin/Dashboard';
import AdminSongs from './pages/admin/Songs';
import AdminLogin from './pages/admin/AdminLogin';
// Force TS check
import AdminUsers from './pages/admin/Users';
import AdminAccounts from './pages/admin/Accounts';
import AdminRoles from './pages/admin/Roles';
import AdminPermissions from './pages/admin/Permissions';
import AdminTopics from './pages/admin/Topics';
import AdminSingers from './pages/admin/Singers';

function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <Router>
          <Routes>
            {/* Client Routes */}
            <Route path="/" element={<ClientLayout />}>
              <Route index element={<Home />} />
              <Route path="songs" element={<Songs />} />
              <Route path="topics" element={<Topics />} />
              <Route path="search" element={<Search />} />
              <Route path="favorites" element={<Favorites />} />
              <Route path="auth/login" element={<Login />} />
              <Route path="auth/register" element={<Register />} />
            </Route>
            
            {/* Admin Auth (không cần layout) */}
            <Route path="/admin/auth/login" element={<AdminLogin />} />
            
            {/* Admin Routes (cần đăng nhập) */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="songs" element={<AdminSongs />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="accounts" element={<AdminAccounts />} />
              <Route path="roles" element={<AdminRoles />} />
              <Route path="permissions" element={<AdminPermissions />} />
              <Route path="topics" element={<AdminTopics />} />
              <Route path="singers" element={<AdminSingers />} />
            </Route>
          </Routes>
        </Router>
      </PlayerProvider>
    </AuthProvider>
  );
}

export default App;

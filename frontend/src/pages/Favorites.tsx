import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import { FiHeart } from 'react-icons/fi';
import './Home.css';

const Favorites = () => {
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { playSong } = usePlayer();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const fetchFavorites = async () => {
      try {
        const response = await axios.get('http://localhost:3000/favorites', { withCredentials: true });
        if (response.data.code === 200) {
          setSongs(response.data.data.songs);
          setFavorites(new Set(response.data.data.songs.map((s: any) => s._id)));
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
          // Handle unauthorized
        }
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [user]);

  const toggleFavorite = async (e: React.MouseEvent, songId: string) => {
    e.stopPropagation();
    try {
      const res = await axios.post(`http://localhost:3000/favorites/toggle/${songId}`, {}, { withCredentials: true });
      if (res.data.code === 200) {
        if (!res.data.isFavorite) {
          // Xóa khỏi danh sách hiển thị nếu bỏ yêu thích
          setSongs(prev => prev.filter(s => s._id !== songId));
          setFavorites(prev => {
            const next = new Set(prev);
            next.delete(songId);
            return next;
          });
        }
      }
    } catch {}
  };

  if (loading) return <div className="loading-state">Đang tải dữ liệu...</div>;

  return (
    <div className="home-container">
      <header className="page-header">
        <h1 className="page-title">Bài hát yêu thích</h1>
      </header>
      <section className="section-container">
        {!user ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Vui lòng đăng nhập để xem danh sách bài hát yêu thích của bạn.</p>
            <Link to="/auth/login" className="btn-primary">Đăng nhập ngay</Link>
          </div>
        ) : songs.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '60px 0' }}>Bạn chưa có bài hát yêu thích nào.</p>
        ) : (
          <div className="song-list">
            {songs.map((song, index) => (
              <div key={song._id} className="song-list-item glass-panel" onClick={() => playSong(song, songs)}>
                <span className="song-index">{index + 1}</span>
                <img src={song.avatar} alt={song.title} className="list-img" loading="lazy" />
                <div className="list-info">
                  <h4 className="song-title">{song.title}</h4>
                  <p className="song-artist">{song.singer_id?.fullname}</p>
                </div>
                <div className="list-stats">
                  <button
                    className={`fav-btn-list ${favorites.has(song._id) ? 'active' : ''}`}
                    onClick={(e) => toggleFavorite(e, song._id)}
                    aria-label="Bỏ yêu thích"
                  >
                    <FiHeart />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Favorites;

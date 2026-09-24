import { useState, useEffect } from 'react';
import axios from 'axios';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import { FiSearch, FiHeart } from 'react-icons/fi';
import './Home.css';

const Search = () => {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { playSong } = usePlayer();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    axios.get('http://localhost:3000/favorites', { withCredentials: true })
      .then(res => {
        if (res.data.code === 200) {
          const ids = new Set<string>(res.data.data.songs.map((s: any) => s._id));
          setFavorites(ids);
        }
      }).catch(() => {});
  }, [user]);

  const toggleFavorite = async (e: React.MouseEvent, songId: string) => {
    e.stopPropagation();
    if (!user) { window.location.href = '/auth/login'; return; }
    try {
      const res = await axios.post(`http://localhost:3000/favorites/toggle/${songId}`, {}, { withCredentials: true });
      if (res.data.code === 200) {
        setFavorites(prev => {
          const next = new Set(prev);
          res.data.isFavorite ? next.add(songId) : next.delete(songId);
          return next;
        });
      }
    } catch {}
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (!keyword.trim()) {
        setResults(null);
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/search?keyword=${keyword}`);
        if (response.data.code === 200) {
          setResults(response.data.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [keyword]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="home-container">
      <header className="page-header">
        <h1 className="page-title">Tìm kiếm</h1>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <input 
            type="text" 
            value={keyword}
            aria-label="Tìm kiếm bài hát, nghệ sĩ, chủ đề"
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm bài hát, nghệ sĩ, chủ đề..."
            style={{ flex: 1, padding: '12px 20px', borderRadius: '30px', border: 'none', background: 'var(--bg-panel)', color: 'white', outline: 'none' }}
          />
          <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiSearch /> Tìm kiếm
          </button>
        </form>
      </header>

      {loading && <div className="loading-state">Đang tìm kiếm...</div>}
      
      {results && !loading && (
        <section className="section-container" style={{ marginTop: '20px' }}>
          <h3 className="section-title">Kết quả tìm kiếm cho: "{results.keyword}"</h3>

          {results.songs?.length > 0 && (
            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ marginBottom: '15px', color: 'var(--text-secondary)' }}>Bài hát</h4>
              <div className="song-grid">
                {results.songs.map((song: any) => (
                  <div key={song._id} className="song-card glass-panel" onClick={() => playSong(song, results.songs)}>
                      <div className="song-img-wrapper">
                        <img src={song.avatar} alt={song.title} loading="lazy" />
                        <div className="song-overlay"><button className="play-circle-btn" aria-label="Phát bài hát">▶</button></div>
                        <button
                          className={`fav-btn ${favorites.has(song._id) ? 'active' : ''}`}
                          onClick={(e) => toggleFavorite(e, song._id)}
                          aria-label={favorites.has(song._id) ? 'Bỏ yêu thích' : 'Thêm yêu thích'}
                        >
                          <FiHeart />
                        </button>
                      </div>
                    <div className="song-info">
                      <h4 className="song-title">{song.title}</h4>
                      <p className="song-artist">{song.singer_id?.fullname}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.singers?.length > 0 && (
            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ marginBottom: '15px', color: 'var(--text-secondary)' }}>Ca sĩ</h4>
              <div className="song-grid">
                {results.singers.map((singer: any) => (
                  <div key={singer._id} className="song-card glass-panel" style={{ cursor: 'pointer' }}>
                    <div className="song-img-wrapper">
                      <img src={singer.avatar} alt={singer.fullname} style={{ borderRadius: '50%' }} loading="lazy" />
                    </div>
                    <div className="song-info" style={{ textAlign: 'center' }}>
                      <h4 className="song-title">{singer.fullname}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.topics?.length > 0 && (
            <div>
              <h4 style={{ marginBottom: '15px', color: 'var(--text-secondary)' }}>Chủ đề</h4>
              <div className="song-grid">
                {results.topics.map((topic: any) => (
                  <div key={topic._id} className="song-card glass-panel" style={{ cursor: 'pointer' }}>
                    <div className="song-img-wrapper">
                      <img src={topic.avatar} alt={topic.title} loading="lazy" />
                    </div>
                    <div className="song-info">
                      <h4 className="song-title">{topic.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.songs?.length === 0 && results.singers?.length === 0 && results.topics?.length === 0 && (
            <div className="loading-state">Không tìm thấy kết quả nào.</div>
          )}
        </section>
      )}
    </div>
  );
};

export default Search;

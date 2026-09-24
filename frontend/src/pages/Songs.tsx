import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import { FiHeart } from 'react-icons/fi';
import './Home.css';

const Songs = () => {
  const [songs, setSongs] = useState<any[]>([]);
  const [topicInfo, setTopicInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { playSong } = usePlayer();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const topicSlug = searchParams.get('topic');

  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true);
      try {
        const url = topicSlug
          ? `http://localhost:3000/songs?topic=${topicSlug}`
          : 'http://localhost:3000/songs';
        const response = await axios.get(url);
        if (response.data.code === 200) {
          setSongs(response.data.data.songs);
          setTopicInfo(response.data.data.topic || null);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, [topicSlug]);

  useEffect(() => {
    if (!user) return;
    axios.get('http://localhost:3000/favorites', { withCredentials: true })
      .then(res => {
        if (res.data.code === 200) {
          setFavorites(new Set(res.data.data.songs.map((s: any) => s._id)));
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

  if (loading) return <div className="loading-state">Đang tải dữ liệu...</div>;

  return (
    <div className="home-container">
      <header className="page-header">
        <h1 className="page-title">
          {topicInfo ? `🎵 ${topicInfo.title}` : 'Tất cả bài hát'}
        </h1>
        {topicInfo && <p className="page-subtitle">{songs.length} bài hát</p>}
      </header>
      <section className="section-container">
        {songs.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '60px 0' }}>
            Không tìm thấy bài hát nào.
          </p>
        ) : (
          <div className="song-grid">
            {songs.map((song) => (
              <div key={song._id} className="song-card glass-panel" onClick={() => playSong(song, songs)}>
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
        )}
      </section>
    </div>
  );
};

export default Songs;

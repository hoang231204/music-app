import { useEffect, useState } from 'react';
import axios from 'axios';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import { FiHeart } from 'react-icons/fi';
import './Home.css';

interface Song {
  _id: string;
  title: string;
  avatar: string;
  audio: string;
  singer_id?: { fullname: string };
  listen: number;
  isFavorite?: boolean;
}

interface Topic {
  _id: string;
  title: string;
  avatar: string;
  slug: string;
}

interface Singer {
  _id: string;
  fullname: string;
  avatar: string;
  slug: string;
}

const Home = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { playSong } = usePlayer();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/', { withCredentials: true });
        if (response.data.code === 200) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!user) return;
    axios.get('http://localhost:3000/favorites', { withCredentials: true })
      .then(res => {
        if (res.data.code === 200) {
          const ids = new Set<string>(res.data.data.songs.map((s: Song) => s._id));
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

  if (loading) return <div className="loading-state">Đang tải dữ liệu...</div>;

  const handlePlaySong = (song: Song, playlist: Song[]) => {
    playSong(song, playlist);
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Chào buổi sáng! ☀️';
    if (h < 18) return 'Chào buổi chiều! 🌤️';
    return 'Chào buổi tối! 🌙';
  };

  return (
    <div className="home-container">
      <header className="page-header">
        <h1 className="page-title">{greeting()}</h1>
        <p className="page-subtitle">Cùng khám phá những giai điệu mới</p>
      </header>

      {/* Hero Section */}
      <section className="hero-section glass-panel">
        <div className="hero-content">
          <h2 className="text-gradient">Nghe nhạc không giới hạn</h2>
          <p>Trải nghiệm âm nhạc tuyệt vời với chất lượng cao nhất</p>
          <button className="btn-primary mt-4" onClick={() => window.location.href = '/songs'}>Khám phá ngay</button>
        </div>
      </section>

      {/* Trending Songs */}
      <section className="section-container">
        <h3 className="section-title">🔥 Thịnh hành</h3>
        <div className="song-grid">
          {data?.trendingSongs?.map((song: Song) => (
            <div key={song._id} className="song-card glass-panel" onClick={() => handlePlaySong(song, data.trendingSongs)}>
              <div className="song-img-wrapper">
                <img src={song.avatar} alt={song.title} loading="lazy" />
                <div className="song-overlay">
                  <button className="play-circle-btn" aria-label="Phát bài hát">▶</button>
                </div>
                <button
                  className={`fav-btn ${favorites.has(song._id) ? 'active' : ''}`}
                  onClick={(e) => toggleFavorite(e, song._id)}
                  title={favorites.has(song._id) ? 'Bỏ yêu thích' : 'Thêm yêu thích'}
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
      </section>

      {/* New Releases */}
      <section className="section-container">
        <h3 className="section-title">✨ Mới phát hành</h3>
        <div className="song-list">
          {data?.newReleases?.slice(0, 6).map((song: Song, index: number) => (
            <div key={song._id} className="song-list-item glass-panel" onClick={() => handlePlaySong(song, data.newReleases)}>
              <span className="song-index">{index + 1}</span>
              <img src={song.avatar} alt={song.title} className="list-img" loading="lazy" />
              <div className="list-info">
                <h4 className="song-title">{song.title}</h4>
                <p className="song-artist">{song.singer_id?.fullname}</p>
              </div>
              <div className="list-stats">
                <span>{song.listen?.toLocaleString()} lượt nghe</span>
              </div>
              <button
                className={`fav-btn-list ${favorites.has(song._id) ? 'active' : ''}`}
                onClick={(e) => toggleFavorite(e, song._id)}
                aria-label={favorites.has(song._id) ? 'Bỏ yêu thích' : 'Thêm yêu thích'}
              >
                <FiHeart />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Singers */}
      {data?.featuredSingers?.length > 0 && (
        <section className="section-container">
          <h3 className="section-title">🎤 Ca sĩ nổi bật</h3>
          <div className="singer-grid">
            {data.featuredSingers.map((singer: Singer) => (
              <div key={singer._id} className="singer-card glass-panel">
                <div className="singer-avatar">
                  <img src={singer.avatar} alt={singer.fullname} loading="lazy" />
                </div>
                <p className="singer-name">{singer.fullname}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Topics */}
      {data?.featuredTopics?.length > 0 && (
        <section className="section-container">
          <h3 className="section-title">🎵 Chủ đề nổi bật</h3>
          <div className="topic-grid">
            {data.featuredTopics.map((topic: Topic) => (
              <div
                key={topic._id}
                className="topic-card glass-panel"
                onClick={() => window.location.href = `/songs?topic=${topic.slug}`}
              >
                <img src={topic.avatar} alt={topic.title} loading="lazy" />
                <div className="topic-overlay">
                  <h4>{topic.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

export default Home;

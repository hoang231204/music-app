import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const Topics = () => {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get('http://localhost:3000/topics');
        if (response.data.code === 200) {
          setTopics(response.data.data.topics);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  if (loading) return <div className="loading-state">Đang tải dữ liệu...</div>;

  return (
    <div className="home-container">
      <header className="page-header">
        <h1 className="page-title">Chủ đề âm nhạc</h1>
        <p className="page-subtitle">Chọn chủ đề bạn yêu thích</p>
      </header>
      <section className="section-container">
        <div className="topic-grid">
          {topics.map((topic) => (
            <div
              key={topic._id}
              className="topic-card glass-panel"
              onClick={() => navigate(`/songs?topic=${topic.slug}`)}
              title={topic.title}
            >
              <img src={topic.avatar} alt={topic.title} loading="lazy" />
              <div className="topic-overlay">
                <h4>{topic.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Topics;

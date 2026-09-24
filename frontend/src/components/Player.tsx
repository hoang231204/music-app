import { FiPlay, FiPause, FiSkipBack, FiSkipForward, FiVolume2 } from 'react-icons/fi';
import { usePlayer } from '../context/PlayerContext';
import './Player.css';

const Player = () => {
  const { currentSong, isPlaying, progress, duration, volume, togglePlay, nextSong, prevSong, seek, setVolume } = usePlayer();

  if (!currentSong) return null;

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;
  
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;
    seek(percent);
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setVolume(percent);
  };

  return (
    <div className="music-player glass-panel">
      <div className="player-left">
        <div className="track-cover">
          <img src={currentSong.avatar} alt={currentSong.title} style={{width: '100%', height: '100%', objectFit: 'cover'}} loading="lazy" />
        </div>
        <div className="track-info">
          <h4 className="track-title">{currentSong.title}</h4>
          <span className="track-artist">{currentSong.singer_id?.fullname || 'Unknown Artist'}</span>
        </div>
      </div>
      
      <div className="player-center">
        <div className="player-controls">
          <button className="control-btn" onClick={prevSong} aria-label="Previous Song"><FiSkipBack /></button>
          <button className="control-btn play-btn" onClick={togglePlay} aria-label="Play/Pause">
            {isPlaying ? <FiPause /> : <FiPlay />}
          </button>
          <button className="control-btn" onClick={nextSong} aria-label="Next Song"><FiSkipForward /></button>
        </div>
        <div className="progress-container">
          <span className="time-text">{formatTime(progress)}</span>
          <div className="progress-bar-bg" onClick={handleProgressClick}>
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <span className="time-text">{formatTime(duration)}</span>
        </div>
      </div>
      
      <div className="player-right">
        <FiVolume2 className="volume-icon" />
        <div className="volume-bar-bg" onClick={handleVolumeClick}>
          <div className="volume-bar-fill" style={{ width: `${volume * 100}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default Player;

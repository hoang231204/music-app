document.addEventListener('DOMContentLoaded', () => {
  const playerState = {
    audio: document.getElementById('audio-element') || new Audio(),
    playlist: [],
    currentIndex: 0,
    isPlaying: false,
    volume: 0.7,
    isMuted: false,
    isShuffle: false,
    isRepeat: false,
  };

  // DOM Elements
  const audioPlayerEl = document.getElementById('audio-player');
  const elTitle = document.getElementById('player-title');
  const elArtist = document.getElementById('player-artist');
  const elCover = document.getElementById('player-cover');
  const elProgress = document.getElementById('player-progress');
  const elProgressBar = document.getElementById('player-progress-bar');
  const elCurrentTime = document.getElementById('player-current-time');
  const elDuration = document.getElementById('player-duration');
  const btnPlay = document.getElementById('player-play-btn');
  const btnPrev = document.getElementById('player-prev-btn');
  const btnNext = document.getElementById('player-next-btn');
  const elVolume = document.getElementById('player-volume');
  const elVolumeBar = document.getElementById('player-volume-bar');
  const btnVolume = document.getElementById('player-volume-btn');

  // Khởi tạo Volume
  playerState.audio.volume = playerState.volume;
  if (elVolume) elVolume.value = playerState.volume.toString();
  if (elVolumeBar) elVolumeBar.style.width = `${playerState.volume * 100}%`;

  // Helper format thời gian mm:ss
  function formatTime(seconds) {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // Cập nhật UI nút Play / Pause
  function updatePlayPauseUI() {
    if (!btnPlay) return;
    if (playerState.isPlaying) {
      btnPlay.innerHTML = `<svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
    } else {
      btnPlay.innerHTML = `<svg class="w-5 h-5 ml-0.5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
    }
  }

  // Hàm phát bài hát theo chỉ số trong Playlist
  function playTrackAtIndex(index) {
    if (!playerState.playlist || playerState.playlist.length === 0) return;
    if (index < 0 || index >= playerState.playlist.length) return;

    playerState.currentIndex = index;
    const song = playerState.playlist[index];

    const songTitle = song.title || 'Chưa rõ tên';
    const songArtist = song.singer || (song.singer_id && song.singer_id.fullname) || 'Chưa rõ ca sĩ';
    const songCover = song.avatar || '/images/default-song.png';
    const songAudio = song.audio || song.src || song.audioUrl || '';

    if (!songAudio) {
      console.error('Bài hát không có đường dẫn âm thanh:', song);
      return;
    }

    if (audioPlayerEl) {
      audioPlayerEl.classList.remove('translate-y-full');
    }

    playerState.audio.src = songAudio;
    playerState.isPlaying = true;

    if (elTitle) elTitle.textContent = songTitle;
    if (elArtist) elArtist.textContent = songArtist;
    if (elCover) elCover.src = songCover;

    playerState.audio
      .play()
      .then(() => updatePlayPauseUI())
      .catch((err) => console.error('Lỗi phát nhạc:', err));
  }

  /**
   * Global Window Function để phát nhạc từ bất kỳ đâu
   * @param {Object|Array} input - Bài hát (Object) HOẶC Danh sách bài hát (Array)
   * @param {Number|String} secondArg - Chỉ số phát (nếu input là Array) hoặc tên Ca sĩ (nếu input là String)
   */
  window.playSong = function (input, secondArg, cover, src) {
    // Trường hợp 1: Truyền vào 1 Danh sách bài hát (Array) + vị trí index muốn phát
    if (Array.isArray(input)) {
      playerState.playlist = input;
      const startIndex = typeof secondArg === 'number' ? secondArg : 0;
      playTrackAtIndex(startIndex);
      return;
    }

    // Trường hợp 2: Truyền vào 1 Đối tượng bài hát (Object)
    if (typeof input === 'object' && input !== null) {
      // Kiểm tra bài hát này đã có trong playlist chưa
      const existingIndex = playerState.playlist.findIndex(
        (item) => (item._id && item._id === input._id) || item.title === input.title
      );

      if (existingIndex !== -1) {
        // Đã có trong danh sách -> phát bài đó
        playTrackAtIndex(existingIndex);
      } else {
        // Chưa có -> Thêm vào danh sách hiện tại và phát
        playerState.playlist.push(input);
        playTrackAtIndex(playerState.playlist.length - 1);
      }
      return;
    }

    // Trường hợp 3: Truyền các tham số lẻ dạng chuỗi (String)
    if (typeof input === 'string') {
      const singleSong = {
        title: input,
        singer: secondArg,
        avatar: cover,
        audio: src,
      };
      playerState.playlist = [singleSong];
      playTrackAtIndex(0);
    }
  };

  // Nút Chuyển bài kế tiếp (Next)
  function nextSong() {
    if (playerState.playlist.length === 0) return;

    let nextIndex;
    if (playerState.isShuffle) {
      nextIndex = Math.floor(Math.random() * playerState.playlist.length);
    } else {
      nextIndex = (playerState.currentIndex + 1) % playerState.playlist.length;
    }

    playTrackAtIndex(nextIndex);
  }

  // Nút Quay lại bài trước (Previous)
  function prevSong() {
    if (playerState.playlist.length === 0) return;

    // Nếu bài hát đã phát quá 3 giây -> Bấm prev sẽ quay lại từ đầu bài hát hiện tại
    if (playerState.audio.currentTime > 3) {
      playerState.audio.currentTime = 0;
      return;
    }

    let prevIndex = (playerState.currentIndex - 1 + playerState.playlist.length) % playerState.playlist.length;
    playTrackAtIndex(prevIndex);
  }

  // Toggle Play / Pause
  function togglePlay() {
    if (!playerState.audio.src) return;
    if (playerState.isPlaying) {
      playerState.audio.pause();
      playerState.isPlaying = false;
    } else {
      playerState.audio.play();
      playerState.isPlaying = true;
    }
    updatePlayPauseUI();
  }

  // Gán sự kiện cho nút Prev & Next
  if (btnPlay) btnPlay.addEventListener('click', togglePlay);
  if (btnNext) btnNext.addEventListener('click', nextSong);
  if (btnPrev) btnPrev.addEventListener('click', prevSong);

  // Cập nhật thanh thời gian khi đang phát (Timeupdate)
  playerState.audio.addEventListener('timeupdate', () => {
    const { currentTime, duration } = playerState.audio;
    if (elCurrentTime) elCurrentTime.textContent = formatTime(currentTime);

    if (!isNaN(duration) && duration > 0) {
      const percent = (currentTime / duration) * 100;
      if (elProgress && !elProgress.matches(':active')) {
        elProgress.value = percent.toString();
      }
      if (elProgressBar) elProgressBar.style.width = `${percent}%`;
    }
  });

  playerState.audio.addEventListener('loadedmetadata', () => {
    if (elDuration) elDuration.textContent = formatTime(playerState.audio.duration);
  });

  // Tự động chuyển bài khi hết nhạc (Ended)
  playerState.audio.addEventListener('ended', () => {
    if (playerState.isRepeat) {
      playerState.audio.currentTime = 0;
      playerState.audio.play();
    } else {
      nextSong();
    }
  });

  // Tua nhạc (Seek)
  if (elProgress) {
    elProgress.addEventListener('input', (e) => {
      const percent = parseFloat(e.target.value);
      if (elProgressBar) elProgressBar.style.width = `${percent}%`;
    });

    elProgress.addEventListener('change', (e) => {
      const percent = parseFloat(e.target.value);
      if (!isNaN(playerState.audio.duration)) {
        playerState.audio.currentTime = (percent / 100) * playerState.audio.duration;
      }
    });
  }

  // Điều chỉnh Âm lượng (Volume)
  function updateVolumeUI(muted) {
    if (!btnVolume) return;
    if (muted) {
      btnVolume.innerHTML = `<svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>`;
    } else {
      btnVolume.innerHTML = `<svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>`;
    }
  }

  function setVolume(v) {
    playerState.volume = v;
    playerState.audio.volume = v;

    if (elVolume) elVolume.value = v.toString();
    if (elVolumeBar) elVolumeBar.style.width = `${v * 100}%`;

    if (v === 0) {
      playerState.isMuted = true;
      updateVolumeUI(true);
    } else {
      playerState.isMuted = false;
      updateVolumeUI(false);
    }
  }

  function toggleMute() {
    if (playerState.isMuted) {
      setVolume(playerState.volume === 0 ? 0.7 : playerState.volume);
    } else {
      playerState.audio.volume = 0;
      if (elVolumeBar) elVolumeBar.style.width = '0%';
      playerState.isMuted = true;
      updateVolumeUI(true);
    }
  }

  if (elVolume) {
    elVolume.addEventListener('input', (e) => {
      setVolume(parseFloat(e.target.value));
    });
  }

  if (btnVolume) {
    btnVolume.addEventListener('click', toggleMute);
  }

  // Điều khiển bằng phím tắt
  document.addEventListener('keydown', (e) => {
    const target = e.target;
    if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
    if (e.code === 'Space') {
      e.preventDefault();
      togglePlay();
    } else if (e.code === 'ArrowLeft') {
      playerState.audio.currentTime = Math.max(0, playerState.audio.currentTime - 5);
    } else if (e.code === 'ArrowRight') {
      if (!isNaN(playerState.audio.duration)) {
        playerState.audio.currentTime = Math.min(
          playerState.audio.duration,
          playerState.audio.currentTime + 5
        );
      }
    }
  });
});
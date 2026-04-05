import { useState, useRef, useEffect, useMemo } from 'react';
import {
  FaPlay,
  FaPause,
  FaVolumeMute,
  FaVolumeUp,
  FaExpand,
  FaCompress,
  FaSpinner,
  FaExclamationTriangle,
  FaBackward,
  FaForward,
  FaClosedCaptioning,
  FaBook,
  FaBookmark,
} from 'react-icons/fa';

const SYNC_INTERVAL_MS = 10000;
const COMPLETION_THRESHOLD = 90;

const formatTime = (time) => {
  if (!time || Number.isNaN(time)) return '0:00';
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const safeParse = (raw, fallback) => {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const VideoPlayer = ({
  videoUrl,
  onProgress,
  onComplete,
  isCompleted,
  contentId,
  userId,
  theme = 'dark',
  qualityOptions = [
    { label: 'Auto', value: 'auto' },
    { label: '720p', value: '720p' },
    { label: '480p', value: '480p' },
    { label: '360p', value: '360p' },
  ],
  chapters = [],
  subtitles = [],
  autoPauseOnTabSwitch = true,
  disableContextMenu = true,
  disableDownload = true,
  watermarkText,
  onEvent,
  onSyncProgress,
}) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const progressInputRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const syncTimerRef = useRef(null);
  const completionFiredRef = useRef(false);
  const sessionStartRef = useRef(Date.now());
  const lastTickRef = useRef(Date.now());
  const watchedBucketsRef = useRef(new Set());

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [buffering, setBuffering] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isSeeking, setIsSeeking] = useState(false);
  const [videoError, setVideoError] = useState(null);
  const [isMetadataLoaded, setIsMetadataLoaded] = useState(false);
  const [speedMenuOpen, setSpeedMenuOpen] = useState(false);
  const [qualityMenuOpen, setQualityMenuOpen] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState(qualityOptions[0]?.value || 'auto');
  const [retryCount, setRetryCount] = useState(0);
  const [hoverPreview, setHoverPreview] = useState({ show: false, time: 0, x: 0 });
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);
  const [captionsEnabled, setCaptionsEnabled] = useState(Boolean(subtitles.find((s) => s.default)));
  const [noteDraft, setNoteDraft] = useState('');
  const [notes, setNotes] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

  const viewerMode = theme === 'light' ? 'light' : 'dark';

  const storageKey = useMemo(() => {
    const keyPart = contentId || videoUrl || 'unknown-video';
    const userPart = userId || 'anonymous';
    return `lms:video:${userPart}:${keyPart}`;
  }, [contentId, userId, videoUrl]);

  const emitEvent = (type, payload = {}) => {
    if (!onEvent) return;
    onEvent({
      type,
      contentType: 'video',
      contentId: contentId || videoUrl,
      userId: userId || null,
      timestamp: new Date().toISOString(),
      ...payload,
    });
  };

  const persistState = (partial = {}) => {
    const current = safeParse(localStorage.getItem(storageKey), {});
    const next = {
      ...current,
      lastPosition: currentTime,
      duration,
      progress: duration > 0 ? (currentTime / duration) * 100 : 0,
      playbackSpeed,
      volume,
      isMuted,
      selectedQuality,
      timeSpentSeconds,
      notes,
      bookmarks,
      updatedAt: new Date().toISOString(),
      ...partial,
    };
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const buildProgressPayload = () => {
    const percentage = duration > 0 ? (currentTime / duration) * 100 : 0;
    return {
      currentTime,
      duration,
      percentage,
      completionThreshold: COMPLETION_THRESHOLD,
      completionStatus: percentage >= COMPLETION_THRESHOLD,
      lastPosition: currentTime,
      timeSpentSeconds,
      watchedBuckets: Array.from(watchedBucketsRef.current).sort((a, b) => a - b),
      dropOffPoint: currentTime,
      playbackSpeed,
      quality: selectedQuality,
      timestamp: new Date().toISOString(),
    };
  };

  const syncProgress = () => {
    const payload = buildProgressPayload();
    persistState();

    if (onProgress) {
      onProgress(payload);
    }

    if (onSyncProgress) {
      onSyncProgress(payload);
    }
  };

  useEffect(() => {
    if (!videoUrl) {
      setVideoError('No video URL provided');
      return;
    }

    const saved = safeParse(localStorage.getItem(storageKey), null);
    if (saved) {
      setVolume(saved.volume ?? 1);
      setIsMuted(saved.isMuted ?? false);
      setPlaybackSpeed(saved.playbackSpeed ?? 1);
      setSelectedQuality(saved.selectedQuality ?? qualityOptions[0]?.value ?? 'auto');
      setTimeSpentSeconds(saved.timeSpentSeconds ?? 0);
      setNotes(saved.notes || []);
      setBookmarks(saved.bookmarks || []);
    }
  }, [videoUrl, storageKey, qualityOptions]);

  useEffect(() => {
    const hideControls = () => {
      if (isPlaying) {
        setShowControls(false);
      }
    };

    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(hideControls, 3000);
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying, showControls]);

  useEffect(() => {
    const onFullScreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', onFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFullScreenChange);
    };
  }, []);

  useEffect(() => {
    if (!autoPauseOnTabSwitch) return undefined;

    const onVisibilityChange = () => {
      if (document.hidden && isPlaying && videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
        emitEvent('onPause', { reason: 'tab_hidden', at: videoRef.current.currentTime });
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [autoPauseOnTabSwitch, isPlaying]);

  useEffect(() => {
    if (!isPlaying) {
      if (syncTimerRef.current) {
        clearInterval(syncTimerRef.current);
        syncTimerRef.current = null;
      }
      return;
    }

    lastTickRef.current = Date.now();
    syncTimerRef.current = setInterval(() => {
      const now = Date.now();
      const deltaSeconds = Math.max(0, Math.round((now - lastTickRef.current) / 1000));
      lastTickRef.current = now;
      if (deltaSeconds > 0) {
        setTimeSpentSeconds((prev) => prev + deltaSeconds);
      }
      syncProgress();
    }, SYNC_INTERVAL_MS);

    return () => {
      if (syncTimerRef.current) {
        clearInterval(syncTimerRef.current);
        syncTimerRef.current = null;
      }
    };
  }, [isPlaying, currentTime, duration, timeSpentSeconds, selectedQuality, playbackSpeed]);

  useEffect(() => {
    return () => {
      persistState({
        sessionDurationSeconds: Math.round((Date.now() - sessionStartRef.current) / 1000),
      });
    };
  }, [currentTime, duration, timeSpentSeconds, notes, bookmarks, playbackSpeed, volume, isMuted, selectedQuality]);

  const handlePlayPause = async () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      emitEvent('onPause', { at: videoRef.current.currentTime });
      syncProgress();
      return;
    }

    try {
      await videoRef.current.play();
      setIsPlaying(true);
      emitEvent('onStart', { at: videoRef.current.currentTime });
    } catch (error) {
      setVideoError('Playback was blocked by the browser. Click play again.');
      emitEvent('onError', { message: error?.message || 'playback-blocked' });
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current || isSeeking) return;

    const position = videoRef.current.currentTime;
    const length = videoRef.current.duration;
    const percentage = length > 0 ? (position / length) * 100 : 0;

    setCurrentTime(position);

    const bucket = Math.floor(position);
    if (bucket >= 0) {
      watchedBucketsRef.current.add(bucket);
    }

    if (onProgress) {
      onProgress({
        currentTime: position,
        duration: length,
        percentage,
      });
    }

    if (percentage >= COMPLETION_THRESHOLD && !isCompleted && onComplete && !completionFiredRef.current) {
      completionFiredRef.current = true;
      onComplete();
      emitEvent('onComplete', { trigger: 'threshold_90', at: position, percentage });
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(duration);
    if (onComplete && !isCompleted) {
      onComplete();
    }
    emitEvent('onComplete', { trigger: 'video_end', at: duration, percentage: 100 });
    syncProgress();
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;

    setDuration(videoRef.current.duration);
    setIsMetadataLoaded(true);
    setVideoError(null);

    videoRef.current.playbackRate = playbackSpeed;
    videoRef.current.volume = volume;
    videoRef.current.muted = isMuted;

    const saved = safeParse(localStorage.getItem(storageKey), null);
    const resumeTime = saved?.lastPosition ?? 0;

    if (resumeTime > 0 && resumeTime < videoRef.current.duration - 5) {
      videoRef.current.currentTime = resumeTime;
      setCurrentTime(resumeTime);
      emitEvent('onResume', { at: resumeTime });
    }
  };

  const handleVideoError = () => {
    const error = videoRef.current?.error;
    let errorMessage = 'Video failed to load';

    if (error) {
      switch (error.code) {
        case error.MEDIA_ERR_ABORTED:
          errorMessage = 'Video loading aborted';
          break;
        case error.MEDIA_ERR_NETWORK:
          errorMessage = 'Network error while loading video';
          break;
        case error.MEDIA_ERR_DECODE:
          errorMessage = 'Error decoding video';
          break;
        case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage = 'Video format not supported';
          break;
        default:
          errorMessage = 'Unknown video error';
      }
    }

    if (retryCount < 2 && videoRef.current) {
      const nextRetry = retryCount + 1;
      setRetryCount(nextRetry);
      setVideoError(`Connection issue. Retrying (${nextRetry}/2)...`);
      setTimeout(() => {
        videoRef.current.load();
      }, 1500 * nextRetry);
      return;
    }

    setVideoError(errorMessage);
    setIsPlaying(false);
    emitEvent('onError', { message: errorMessage, retryCount });
  };

  const handleVolumeMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
    }
  };

  const handleVolumeChange = (event) => {
    const newVolume = Number.parseFloat(event.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
    }
    setIsMuted(newVolume === 0);
  };

  const handlePlaybackSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setSpeedMenuOpen(false);
    emitEvent('onSpeedChange', { speed });
  };

  const handleProgressBarChange = (event) => {
    const newPercentage = Number.parseFloat(event.target.value);
    const newTime = (newPercentage / 100) * duration;

    setIsSeeking(true);
    setCurrentTime(newTime);

    if (videoRef.current && isMetadataLoaded) {
      videoRef.current.currentTime = newTime;
      emitEvent('onSeek', { to: newTime, percentage: newPercentage });
    }
  };

  const handleProgressBarMouseUp = () => {
    setIsSeeking(false);
    syncProgress();
  };

  const skipBackward = () => {
    if (!videoRef.current || !isMetadataLoaded) return;
    const newTime = Math.max(0, currentTime - 10);
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    emitEvent('onSeek', { direction: 'backward', to: newTime });
  };

  const skipForward = () => {
    if (!videoRef.current || !isMetadataLoaded) return;
    const newTime = Math.min(duration, currentTime + 10);
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    emitEvent('onSeek', { direction: 'forward', to: newTime });
  };

  const toggleFullscreen = async () => {
    try {
      if (!isFullscreen) {
        if (containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        }
      } else if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (error) {
      emitEvent('onError', { message: `fullscreen: ${error?.message || 'unknown'}` });
    }
  };

  const handleBuffering = () => {
    setBuffering(true);
  };

  const handleCanPlay = () => {
    setBuffering(false);
  };

  const toggleCaptions = () => {
    if (!videoRef.current) return;

    const tracks = Array.from(videoRef.current.textTracks || []);
    const nextEnabled = !captionsEnabled;

    tracks.forEach((track) => {
      track.mode = nextEnabled ? 'showing' : 'hidden';
    });

    setCaptionsEnabled(nextEnabled);
    emitEvent('onCaptionsToggle', { enabled: nextEnabled });
  };

  const handleQualityChange = (option) => {
    setSelectedQuality(option.value);
    setQualityMenuOpen(false);

    if (option.url && videoRef.current) {
      const wasPlaying = isPlaying;
      const bookmarkTime = videoRef.current.currentTime;
      videoRef.current.src = option.url;
      videoRef.current.load();
      videoRef.current.currentTime = bookmarkTime;
      if (wasPlaying) {
        videoRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      }
    }

    emitEvent('onQualityChange', { quality: option.value });
  };

  const addNote = () => {
    const text = noteDraft.trim();
    if (!text) return;

    const newNote = {
      id: `${Date.now()}`,
      at: currentTime,
      text,
      createdAt: new Date().toISOString(),
    };

    const updated = [newNote, ...notes].slice(0, 20);
    setNotes(updated);
    setNoteDraft('');
    persistState({ notes: updated });
    emitEvent('onNoteAdd', { at: currentTime, textLength: text.length });
  };

  const addBookmark = () => {
    const newBookmark = {
      id: `${Date.now()}`,
      at: currentTime,
      label: `Bookmark ${bookmarks.length + 1}`,
    };

    const updated = [newBookmark, ...bookmarks].slice(0, 30);
    setBookmarks(updated);
    persistState({ bookmarks: updated });
    emitEvent('onBookmarkAdd', { at: currentTime });
  };

  const jumpTo = (seconds) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = seconds;
    setCurrentTime(seconds);
    emitEvent('onSeek', { to: seconds, source: 'shortcut_or_click' });
  };

  const handleProgressHover = (event) => {
    if (!progressInputRef.current || duration <= 0) return;

    const rect = progressInputRef.current.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));

    setHoverPreview({
      show: true,
      time: ratio * duration,
      x: ratio * 100,
    });
  };

  const handleKeyDown = (event) => {
    if (!videoRef.current) return;

    const tag = event.target?.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;

    switch (event.key.toLowerCase()) {
      case ' ':
      case 'k':
        event.preventDefault();
        handlePlayPause();
        break;
      case 'arrowleft':
      case 'j':
        event.preventDefault();
        skipBackward();
        break;
      case 'arrowright':
      case 'l':
        event.preventDefault();
        skipForward();
        break;
      case 'm':
        event.preventDefault();
        handleVolumeMute();
        break;
      case 'f':
        event.preventDefault();
        toggleFullscreen();
        break;
      case 'c':
        event.preventDefault();
        toggleCaptions();
        break;
      case '>':
      case '.': {
        event.preventDefault();
        const speed = Math.min(2, Number((playbackSpeed + 0.25).toFixed(2)));
        handlePlaybackSpeedChange(speed);
        break;
      }
      case '<':
      case ',': {
        event.preventDefault();
        const speed = Math.max(0.5, Number((playbackSpeed - 0.25).toFixed(2)));
        handlePlaybackSpeedChange(speed);
        break;
      }
      default:
        break;
    }
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const shellClass =
    viewerMode === 'light'
      ? 'relative w-full aspect-video rounded-xl overflow-hidden shadow-lg group bg-slate-100 text-slate-900'
      : 'relative bg-black w-full aspect-video rounded-xl overflow-hidden shadow-lg group text-white';

  const controlsClass =
    viewerMode === 'light'
      ? 'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/75 to-transparent p-4 transition-opacity duration-300'
      : 'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-4 transition-opacity duration-300';

  return (
    <div
      ref={containerRef}
      className={shellClass}
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onKeyDown={handleKeyDown}
      onContextMenu={(event) => {
        if (disableContextMenu) {
          event.preventDefault();
        }
      }}
      tabIndex={0}
      role="region"
      aria-label="Video learning player"
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={handleLoadedMetadata}
        onWaiting={handleBuffering}
        onCanPlay={handleCanPlay}
        onError={handleVideoError}
        preload="metadata"
        controlsList={disableDownload ? 'nodownload noplaybackrate' : undefined}
        crossOrigin="anonymous"
      >
        {subtitles.map((track) => (
          <track
            key={`${track.src}-${track.srclang || track.label}`}
            kind={track.kind || 'subtitles'}
            src={track.src}
            srcLang={track.srclang}
            label={track.label}
            default={Boolean(track.default)}
          />
        ))}
      </video>

      {watermarkText && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="rotate-[-20deg] text-white/15 text-xl sm:text-2xl font-bold tracking-wider">
            {watermarkText}
          </span>
        </div>
      )}

      {videoError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="bg-red-900/90 border border-red-500 rounded-lg p-6 max-w-sm mx-4 text-center">
            <FaExclamationTriangle className="text-4xl text-red-400 mx-auto mb-4" />
            <p className="text-white font-semibold mb-2">Video Error</p>
            <p className="text-red-200 text-sm">{videoError}</p>
            <p className="text-gray-300 text-xs mt-4">Please try refreshing the page or contact support</p>
          </div>
        </div>
      )}

      {buffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <FaSpinner className="text-4xl text-white animate-spin" />
        </div>
      )}

      {!isPlaying && !buffering && (
        <button
          onClick={handlePlayPause}
          className="absolute inset-0 flex items-center justify-center group-hover:bg-black/20 transition-all"
          aria-label="Play video"
        >
          <FaPlay className="text-6xl text-white/80 hover:text-white transition-all" />
        </button>
      )}

      <div className={`${controlsClass} ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="relative flex items-center gap-2 mb-3">
          <input
            ref={progressInputRef}
            type="range"
            min="0"
            max="100"
            value={isMetadataLoaded ? progressPercentage : 0}
            onChange={handleProgressBarChange}
            onMouseUp={handleProgressBarMouseUp}
            onTouchEnd={handleProgressBarMouseUp}
            onMouseMove={handleProgressHover}
            onMouseLeave={() => setHoverPreview((prev) => ({ ...prev, show: false }))}
            className="flex-1 h-1 bg-white/30 rounded-full cursor-pointer accent-blue-500 hover:h-2 transition-all"
          />

          {chapters.length > 0 && duration > 0 && (
            <div className="absolute left-0 right-20 top-1/2 -translate-y-1/2 pointer-events-none">
              {chapters.map((chapter) => {
                const left = Math.min(100, Math.max(0, (chapter.time / duration) * 100));
                return (
                  <span
                    key={`${chapter.time}-${chapter.label}`}
                    className="absolute -top-1 h-3 w-[2px] bg-amber-300/80"
                    style={{ left: `${left}%` }}
                    title={chapter.label}
                  />
                );
              })}
            </div>
          )}

          {hoverPreview.show && (
            <div
              className="absolute -top-8 px-2 py-1 text-xs rounded bg-slate-900 text-white pointer-events-none"
              style={{ left: `${hoverPreview.x}%`, transform: 'translateX(-50%)' }}
            >
              {formatTime(hoverPreview.time)}
            </div>
          )}

          <span className="text-sm font-semibold whitespace-nowrap">
            {isMetadataLoaded ? `${formatTime(currentTime)} / ${formatTime(duration)}` : 'Loading...'}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={handlePlayPause}
              className="p-2 hover:bg-white/20 rounded-lg transition-all"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <FaPause size={18} /> : <FaPlay size={18} />}
            </button>

            <button
              onClick={skipBackward}
              className="p-2 hover:bg-white/20 rounded-lg transition-all flex items-center justify-center"
              title="Skip backward 10s"
              disabled={!isMetadataLoaded}
            >
              <FaBackward size={16} />
            </button>

            <button
              onClick={skipForward}
              className="p-2 hover:bg-white/20 rounded-lg transition-all flex items-center justify-center"
              title="Skip forward 10s"
              disabled={!isMetadataLoaded}
            >
              <FaForward size={16} />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleVolumeMute}
                className="p-2 hover:bg-white/20 rounded-lg transition-all flex items-center justify-center"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? <FaVolumeMute size={18} /> : <FaVolumeUp size={18} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 sm:w-20 h-1 bg-white/30 rounded-full cursor-pointer accent-blue-500"
              />
            </div>

            <span className="text-sm font-semibold ml-2 hidden md:inline">{formatTime(currentTime)}</span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={addBookmark}
              className="p-2 hover:bg-white/20 rounded-lg transition-all"
              title="Bookmark this timestamp"
            >
              <FaBookmark size={16} />
            </button>

            <button
              onClick={toggleCaptions}
              className={`p-2 rounded-lg transition-all ${captionsEnabled ? 'bg-blue-600/80' : 'hover:bg-white/20'}`}
              title="Toggle captions"
            >
              <FaClosedCaptioning size={17} />
            </button>

            <div className="relative">
              <button
                className="p-2 hover:bg-white/20 rounded-lg transition-all text-sm font-semibold"
                onClick={() => setSpeedMenuOpen((prev) => !prev)}
              >
                {playbackSpeed}x
              </button>
              {speedMenuOpen && (
                <div className="absolute bottom-full right-0 mb-2 bg-gray-900 border border-white/20 rounded-lg overflow-hidden z-20">
                  {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => handlePlaybackSpeedChange(speed)}
                      className={`block w-full px-4 py-2 text-left text-white hover:bg-white/20 ${
                        playbackSpeed === speed ? 'bg-blue-600' : ''
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative hidden sm:block">
              <button
                className="p-2 hover:bg-white/20 rounded-lg transition-all text-sm font-semibold"
                onClick={() => setQualityMenuOpen((prev) => !prev)}
              >
                {selectedQuality}
              </button>
              {qualityMenuOpen && (
                <div className="absolute bottom-full right-0 mb-2 bg-gray-900 border border-white/20 rounded-lg overflow-hidden z-20">
                  {qualityOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleQualityChange(option)}
                      className={`block w-full px-4 py-2 text-left text-white hover:bg-white/20 ${
                        selectedQuality === option.value ? 'bg-blue-600' : ''
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-white/20 rounded-lg transition-all"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <FaCompress size={18} /> : <FaExpand size={18} />}
            </button>
          </div>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <FaBook size={14} />
            <input
              type="text"
              value={noteDraft}
              onChange={(event) => setNoteDraft(event.target.value)}
              placeholder={`Add note at ${formatTime(currentTime)}`}
              className="w-full rounded-md px-2 py-1 text-sm bg-white/90 text-slate-900 placeholder:text-slate-500"
            />
            <button
              onClick={addNote}
              className="px-3 py-1 rounded-md text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {bookmarks.slice(0, 4).map((bookmark) => (
              <button
                key={bookmark.id}
                onClick={() => jumpTo(bookmark.at)}
                className="px-2 py-1 rounded bg-white/20 hover:bg-white/30"
              >
                {formatTime(bookmark.at)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isCompleted && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
          Completed
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;

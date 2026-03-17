import { useState, useRef, useEffect } from 'react';
import {
  FaPlay,
  FaPause,
  FaVolumeMute,
  FaVolumeUp,
  FaExpand,
  FaCompress,
  FaCog,
  FaSpinner,
  FaExclamationTriangle,
  FaBackward,
  FaForward
} from 'react-icons/fa';

const VideoPlayer = ({ videoUrl, onProgress, onComplete, isCompleted }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
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
  const controlsTimeoutRef = useRef(null);
  const [qualityOptions] = useState([
    { label: 'Auto', value: 'auto' },
    { label: '720p', value: '720p' },
    { label: '480p', value: '480p' },
    { label: '360p', value: '360p' },
  ]);
  const [selectedQuality, setSelectedQuality] = useState('auto');

  useEffect(() => {
    console.log('VideoPlayer received URL:', videoUrl);
    if (!videoUrl) {
      setVideoError('No video URL provided');
    }
  }, [videoUrl]);

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

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && !isSeeking) {
      setCurrentTime(videoRef.current.currentTime);
      const percentage = (videoRef.current.currentTime / videoRef.current.duration) * 100;

      if (onProgress) {
        onProgress({
          currentTime: videoRef.current.currentTime,
          duration: videoRef.current.duration,
          percentage: percentage
        });
      }

      // Auto-complete at 90% watch
      if (percentage >= 90 && !isCompleted && onComplete) {
        onComplete();
      }
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (onComplete && !isCompleted) {
      onComplete();
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsMetadataLoaded(true);
      setVideoError(null);
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
    
    setVideoError(errorMessage);
    setIsPlaying(false);
  };

  const handleVolumeMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  const handlePlaybackSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleProgressBarChange = (e) => {
    const newPercentage = parseFloat(e.target.value);
    const newTime = (newPercentage / 100) * duration;
    
    setIsSeeking(true);
    setCurrentTime(newTime);
    
    if (videoRef.current && isMetadataLoaded) {
      videoRef.current.currentTime = newTime;
    }
  };

  const handleProgressBarMouseUp = () => {
    setIsSeeking(false);
  };

  const skipBackward = () => {
    if (videoRef.current && isMetadataLoaded) {
      const newTime = Math.max(0, currentTime - 15);
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const skipForward = () => {
    if (videoRef.current && isMetadataLoaded) {
      const newTime = Math.min(duration, currentTime + 15);
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const toggleFullscreen = async () => {
    try {
      if (!isFullscreen) {
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        } else if (containerRef.current.webkitRequestFullscreen) {
          await containerRef.current.webkitRequestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  const handleBuffering = () => {
    setBuffering(true);
  };

  const handleCanPlay = () => {
    setBuffering(false);
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className="relative bg-black w-full aspect-video rounded-xl overflow-hidden shadow-lg group"
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
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
        crossOrigin="anonymous"
      />

      {/* Video Error Display */}
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

      {/* Buffering Indicator */}
      {buffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <FaSpinner className="text-4xl text-white animate-spin" />
        </div>
      )}

      {/* Play Button Overlay */}
      {!isPlaying && !buffering && (
        <button
          onClick={handlePlayPause}
          className="absolute inset-0 flex items-center justify-center group-hover:bg-black/30 transition-all"
        >
          <FaPlay className="text-6xl text-white/80 hover:text-white transition-all" />
        </button>
      )}

      {/* Controls Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Progress Bar */}
        <div className="flex items-center gap-2 mb-3">
          <input
            type="range"
            min="0"
            max="100"
            value={isMetadataLoaded ? progressPercentage : 0}
            onChange={handleProgressBarChange}
            onMouseUp={handleProgressBarMouseUp}
            onTouchEnd={handleProgressBarMouseUp}
            className="flex-1 h-1 bg-white/30 rounded-full cursor-pointer accent-blue-500 hover:h-2 transition-all"
          />
          <span className="text-white text-sm font-semibold whitespace-nowrap">
            {isMetadataLoaded ? `${formatTime(currentTime)} / ${formatTime(duration)}` : 'Loading...'}
          </span>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Play/Pause */}
            <button
              onClick={handlePlayPause}
              className="p-2 hover:bg-white/20 rounded-lg transition-all text-white"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
            </button>

            {/* Skip Backward 15s */}
            <button
              onClick={skipBackward}
              className="p-2 hover:bg-white/20 rounded-lg transition-all text-white flex items-center justify-center"
              title="Skip backward 15s"
              disabled={!isMetadataLoaded}
            >
              <FaBackward size={18} />
              <span className="text-xs ml-1">15</span>
            </button>

            {/* Skip Forward 15s */}
            <button
              onClick={skipForward}
              className="p-2 hover:bg-white/20 rounded-lg transition-all text-white flex items-center justify-center"
              title="Skip forward 15s"
              disabled={!isMetadataLoaded}
            >
              <FaForward size={18} />
              <span className="text-xs ml-1">15</span>
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleVolumeMute}
                className="p-2 hover:bg-white/20 rounded-lg transition-all text-white flex items-center justify-center"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-white/30 rounded-full cursor-pointer accent-blue-500"
              />
            </div>

            {/* Current Time Display */}
            <span className="text-white text-sm font-semibold ml-4 hidden sm:inline">
              {formatTime(currentTime)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Playback Speed */}
            <div className="relative group">
              <button 
                className="p-2 hover:bg-white/20 rounded-lg transition-all text-white flex items-center gap-1"
                onClick={() => setSpeedMenuOpen(!speedMenuOpen)}
              >
                <FaCog size={20} />
                <span className="text-sm font-semibold">{playbackSpeed}x</span>
              </button>
              {speedMenuOpen && (
                <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-gray-900 border border-white/20 rounded-lg overflow-hidden">
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
              )
            }
              
            </div>

            {/* Quality Selector */}
            <div className="relative group hidden md:block">
              <button className="p-2 hover:bg-white/20 rounded-lg transition-all text-white flex items-center gap-1">
                <span 
                  className="text-sm font-semibold"
                  onClick={() => setQualityMenuOpen(!qualityMenuOpen)}
                >
                  {selectedQuality}
                </span>
              </button>
              {qualityMenuOpen && (
                <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-gray-900 border border-white/20 rounded-lg overflow-hidden">
                  {qualityOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedQuality(option.value)}
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

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-white/20 rounded-lg transition-all text-white"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <FaCompress size={20} /> : <FaExpand size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Completion Badge */}
      {isCompleted && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
          ✓ Completed
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;

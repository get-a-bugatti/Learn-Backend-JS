import { useRef, useState, useEffect } from "react";
import parse from "html-react-parser"

export default function VideoPlayer({
  videoUrl,
  title,
  description
}) {
  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // ▶️ Play / Pause
  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  // 🔊 Volume change
  const handleVolume = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    videoRef.current.volume = vol;
  };

  // ⏩ Progress update
  const handleTimeUpdate = () => {
    const current = videoRef.current.currentTime;
    const dur = videoRef.current.duration;

    setProgress((current / dur) * 100);
  };

  // ⏱ Set duration
  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
  };

  // ⏩ Seek
  const handleSeek = (e) => {
    const value = e.target.value;
    const newTime = (value / 100) * duration;

    videoRef.current.currentTime = newTime;
    setProgress(value);
  };

  // ⏱ Format time
  const formatTime = (time) => {
    if (!time) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div className="max-w-2xl mx-auto">
      
      {/* 🎬 Video */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full rounded-lg bg-black"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />

      {/* 🎮 Controls */}
      <div className="mt-2 space-y-2">

        {/* Progress */}
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          className="w-full"
        />

        <div className="flex items-center justify-between">

          {/* Play / Pause */}
          <button
            onClick={togglePlay}
            className="px-3 py-1 bg-gray-800 text-white rounded"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>

          {/* Volume */}
          <div className="flex items-center gap-2">
            <span>🔊</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolume}
            />
          </div>

          {/* Time */}
          <span className="text-sm">
            {formatTime(videoRef.current?.currentTime)} / {formatTime(duration)}
          </span>

        </div>
      </div>

      {/* 📝 Title & Description */}
      <div className="mt-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-gray-600 text-sm mt-1">{parse(description)}</p>
      </div>

    </div>
  );
}
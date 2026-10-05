import { useEffect, useRef, useState } from 'react';

export function BackgroundMusic() {
  const audio = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const player = audio.current;
    if (!player) return;
    player.volume = .45;
    const start = () => {
      if (player.paused) void player.play().catch(() => {
        // Mobile browsers may require a user gesture before audible playback.
      });
    };
    start();
    document.addEventListener('pointerdown', start);
    document.addEventListener('keydown', start);
    return () => {
      document.removeEventListener('pointerdown', start);
      document.removeEventListener('keydown', start);
      player.pause();
    };
  }, []);

  function toggle() {
    const player = audio.current;
    if (!player) return;
    if (!playing || muted) {
      player.muted = false;
      setMuted(false);
      void player.play().catch(() => setPlaying(false));
    } else {
      player.muted = true;
      setMuted(true);
    }
  }

  const label = unavailable ? 'Music unavailable' : muted ? 'Unmute music' : playing ? 'Mute music' : 'Play music';
  const audible = playing && !muted;
  return <>
    <audio ref={audio} src="./audio/background-music.mpeg" loop autoPlay preload="auto"
      onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setUnavailable(true)} />
    <button className="music-toggle" type="button" onClick={toggle} disabled={unavailable}
      aria-label={label} title={label}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M11 5 6 9H3v6h3l5 4V5Z" />
        {audible ? <><path d="M15 8a6 6 0 0 1 0 8" /><path d="M18 5a10 10 0 0 1 0 14" /></> : <path d="m16 9 5 6m0-6-5 6" />}
      </svg>
      <span>{unavailable ? 'Unavailable' : muted ? 'Unmute' : playing ? 'Mute' : 'Play'}</span>
    </button>
  </>;
}

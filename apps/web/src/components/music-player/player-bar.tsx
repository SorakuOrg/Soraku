"use client";

import { useMusicPlayer } from "@/context/music-player";
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  ChevronUp, ChevronDown, X, Music2, ListMusic,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(sec: number) {
  if (!sec || isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar() {
  const { currentTime, duration, seek } = useMusicPlayer();
  const pct = duration ? (currentTime / duration) * 100 : 0;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    seek(((e.clientX - rect.left) / rect.width) * duration);
  };

  return (
    <div className="group flex items-center gap-2 w-full">
      <span className="text-[10px] text-muted-foreground/50 w-7 text-right tabular-nums">
        {formatTime(currentTime)}
      </span>
      <div
        onClick={handleClick}
        className="relative h-1 flex-1 cursor-pointer rounded-full bg-border/60 overflow-hidden group-hover:h-1.5 transition-all"
      >
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-primary transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[10px] text-muted-foreground/50 w-7 tabular-nums">
        {formatTime(duration)}
      </span>
    </div>
  );
}

// ─── Volume Slider ────────────────────────────────────────────────────────────

function VolumeControl() {
  const { volume, isMuted, setVolume, toggleMute } = useMusicPlayer();
  const [show, setShow] = useState(false);

  return (
    <div className="relative flex items-center">
      <button
        onClick={toggleMute}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground transition-colors"
      >
        {isMuted || volume === 0
          ? <VolumeX className="h-3.5 w-3.5" />
          : <Volume2 className="h-3.5 w-3.5" />
        }
      </button>

      {/* Hover volume slider */}
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className={cn(
          "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 transition-all duration-200",
          show ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-1 pointer-events-none"
        )}
      >
        <div className="flex flex-col items-center gap-1 rounded-xl border border-border/80 bg-background/95 backdrop-blur-xl p-2.5 shadow-xl">
          <span className="text-[10px] text-muted-foreground/60">{Math.round(volume * 100)}</span>
          <input
            type="range" min={0} max={1} step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="h-16 w-1.5 cursor-pointer appearance-none rounded-full bg-border/60 [writing-mode:vertical-lr] [direction:rtl]"
            style={{ background: `linear-gradient(to top, var(--color-primary) ${(isMuted ? 0 : volume) * 100}%, var(--color-border) ${(isMuted ? 0 : volume) * 100}%)` }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Playlist Panel ───────────────────────────────────────────────────────────

function PlaylistPanel({ onClose }: { onClose: () => void }) {
  const { playlist, currentIndex, playTrack, isPlaying } = useMusicPlayer();

  return (
    <div className="absolute bottom-full right-0 mb-2 w-72 overflow-hidden rounded-2xl border border-border/80 bg-background/95 backdrop-blur-xl shadow-2xl">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <ListMusic className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold">Playlist</span>
          <span className="text-xs text-muted-foreground/50">({playlist.length})</span>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <ul className="max-h-60 overflow-y-auto py-1.5">
        {playlist.map((track, i) => (
          <li key={track.id}>
            <button
              onClick={() => { playTrack(i); onClose(); }}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-primary/8",
                currentIndex === i && "bg-primary/10"
              )}
            >
              {/* Cover emoji */}
              <div className={cn(
                "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-base",
                currentIndex === i ? "bg-primary/20" : "bg-border/40"
              )}>
                {track.cover}
              </div>
              <div className="min-w-0 flex-1">
                <p className={cn("text-xs font-medium truncate", currentIndex === i && "text-primary")}>
                  {track.title}
                </p>
                <p className="text-[10px] text-muted-foreground/60 truncate">{track.artist}</p>
              </div>
              {/* Playing indicator */}
              {currentIndex === i && isPlaying && (
                <span className="flex gap-0.5 flex-shrink-0">
                  {[0, 100, 200].map((d) => (
                    <span key={d} className="inline-block h-3 w-0.5 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: `${d}ms` }} />
                  ))}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Main Player Bar ──────────────────────────────────────────────────────────

export function PlayerBar() {
  const {
    playlist, currentIndex, isPlaying, isVisible, isMinimized,
    togglePlay, next, prev, hidePlayer, toggleMinimize,
  } = useMusicPlayer();

  const [showPlaylist, setShowPlaylist] = useState(false);

  if (!isVisible) return null;

  const track = playlist[currentIndex];
  if (!track) return null;

  /* ─── Minimized pill ──────────────────────────────────────────────────── */
  if (isMinimized) {
    return (
      <div className="fixed bottom-5 right-5 z-50">
        <button
          onClick={toggleMinimize}
          className="group flex items-center gap-2.5 rounded-full border border-primary/30 bg-background/90 px-4 py-2.5 shadow-lg shadow-primary/10 backdrop-blur-xl transition-all hover:border-primary/50 hover:shadow-primary/20"
        >
          <div className={cn(
            "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm",
            isPlaying ? "bg-primary/20 text-primary" : "bg-border/50 text-muted-foreground"
          )}>
            {isPlaying ? <span className="flex gap-px">{[0,80,160].map(d=><span key={d} className="inline-block h-2.5 w-px rounded-full bg-primary animate-bounce" style={{animationDelay:`${d}ms`}}/>)}</span> : <Music2 className="h-3 w-3"/>}
          </div>
          <div className="max-w-[120px]">
            <p className="text-xs font-medium truncate">{track.title}</p>
          </div>
          <ChevronUp className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>
      </div>
    );
  }

  /* ─── Full player bar ─────────────────────────────────────────────────── */
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Backdrop blur bar */}
      <div className="border-t border-primary/10 bg-background/85 backdrop-blur-2xl px-4 py-3 sm:px-6">
        <div className="mx-auto max-w-7xl">

          {/* Progress — top of bar */}
          <div className="mb-2.5">
            <ProgressBar />
          </div>

          {/* Controls row */}
          <div className="flex items-center gap-3">

            {/* Track info */}
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className={cn(
                "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-lg",
                "border border-border/60 bg-card/50",
                isPlaying && "ring-1 ring-primary/30"
              )}>
                {track.cover}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate leading-tight">{track.title}</p>
                <p className="text-[11px] text-muted-foreground/60 truncate">
                  {track.artist}
                  {track.anime && <span className="text-primary/60"> · {track.anime}</span>}
                </p>
              </div>
            </div>

            {/* Playback controls — center */}
            <div className="flex items-center gap-1">
              <button onClick={prev}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground transition-colors hover:bg-primary/8">
                <SkipBack className="h-4 w-4" />
              </button>

              <button onClick={togglePlay}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/30 hover:bg-primary/90 transition-all hover:scale-105 active:scale-95">
                {isPlaying
                  ? <Pause  className="h-4 w-4" fill="currentColor" />
                  : <Play   className="h-4 w-4" fill="currentColor" />
                }
              </button>

              <button onClick={next}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground transition-colors hover:bg-primary/8">
                <SkipForward className="h-4 w-4" />
              </button>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-1">
              <VolumeControl />

              {/* Playlist toggle */}
              <div className="relative">
                <button
                  onClick={() => setShowPlaylist((s) => !s)}
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-lg transition-colors",
                    showPlaylist
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-primary/8"
                  )}
                >
                  <ListMusic className="h-3.5 w-3.5" />
                </button>
                {showPlaylist && (
                  <PlaylistPanel onClose={() => setShowPlaylist(false)} />
                )}
              </div>

              {/* Minimize */}
              <button onClick={toggleMinimize}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground transition-colors hover:bg-primary/8">
                <ChevronDown className="h-3.5 w-3.5" />
              </button>

              {/* Hide */}
              <button onClick={hidePlayer}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-destructive transition-colors hover:bg-destructive/8">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* "No audio src" notice — hanya tampil jika src kosong */}
          {!track.src && (
            <p className="mt-1.5 text-center text-[10px] text-muted-foreground/30">
              Audio akan tersedia setelah integrasi backend · UI preview
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

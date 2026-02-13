"use client";

import { useAudio } from './AudioContext';
import { Play, Pause, SkipBack, SkipForward, Repeat, Repeat1 } from 'lucide-react';

export function AudioPlayer() {
    const { isPlaying, currentTrack, togglePlay, playNext, playPrevious, speed, setSpeed, loopMode, setLoopMode } = useAudio();

    if (!currentTrack) return null;

    const speedOptions = [0.75, 1, 1.25, 1.5, 2];

    const cycleLoopMode = () => {
        if (loopMode === 'none') setLoopMode('1');
        else if (loopMode === '1') setLoopMode('inf');
        else setLoopMode('none');
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
            <div className="container mx-auto px-4 py-3">
                <div className="flex flex-col gap-2">
                    {/* Track Info */}
                    <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{currentTrack.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{currentTrack.reciter}</p>
                        </div>

                        {/* Speed Control */}
                        <div className="flex items-center gap-2 mx-4">
                            <span className="text-xs text-muted-foreground">Speed:</span>
                            <select
                                value={speed}
                                onChange={(e) => setSpeed(Number(e.target.value))}
                                className="text-xs bg-secondary border border-border rounded px-2 py-1"
                            >
                                {speedOptions.map(s => (
                                    <option key={s} value={s}>{s}x</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={cycleLoopMode}
                            className={`p-2 rounded-full transition-colors ${loopMode !== 'none' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                                }`}
                            aria-label="Loop"
                        >
                            {loopMode === '1' ? <Repeat1 className="h-4 w-4" /> : <Repeat className="h-4 w-4" />}
                        </button>

                        <button
                            onClick={playPrevious}
                            className="p-2 rounded-full hover:bg-secondary transition-colors"
                            aria-label="Previous"
                        >
                            <SkipBack className="h-5 w-5" />
                        </button>

                        <button
                            onClick={togglePlay}
                            className="p-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                            aria-label={isPlaying ? "Pause" : "Play"}
                        >
                            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                        </button>

                        <button
                            onClick={playNext}
                            className="p-2 rounded-full hover:bg-secondary transition-colors"
                            aria-label="Next"
                        >
                            <SkipForward className="h-5 w-5" />
                        </button>

                        {loopMode === 'inf' && (
                            <span className="text-xs text-muted-foreground">∞</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

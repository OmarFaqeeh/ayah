"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

interface AudioTrack {
    url: string;
    surahNumber: number;
    ayahNumber: number;
    title: string;
    reciter: string;
}

interface AudioContextType {
    isPlaying: boolean;
    currentTrack: AudioTrack | null;
    playlist: AudioTrack[];
    speed: number;
    loopMode: 'none' | '1' | 'inf';
    playTrack: (track: AudioTrack) => void;
    setPlaylist: (tracks: AudioTrack[]) => void;
    togglePlay: () => void;
    playNext: () => void;
    playPrevious: () => void;
    setSpeed: (speed: number) => void;
    setLoopMode: (mode: 'none' | '1' | 'inf') => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
    const [playlist, setPlaylist] = useState<AudioTrack[]>([]);
    const [speed, setSpeed] = useState(1);
    const [loopMode, setLoopMode] = useState<'none' | '1' | 'inf'>('none');
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize audio element
    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
        }

        // Attach event handler
        const handleEnded = () => {
            console.log('Track ended, playing next...');
            handleTrackEnd();
        };

        audioRef.current.addEventListener('ended', handleEnded);

        return () => {
            audioRef.current?.removeEventListener('ended', handleEnded);
        };
    }, [loopMode, playlist, currentTrack]); // Re-attach when dependencies change

    // Update speed when it changes
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.playbackRate = speed;
        }
    }, [speed]);

    const handleTrackEnd = () => {
        console.log('handleTrackEnd called, loopMode:', loopMode);
        if (loopMode === '1') {
            // Loop current track
            audioRef.current?.play();
        } else {
            // Auto-play next track or loop playlist
            playNext();
        }
    };

    useEffect(() => {
        if (currentTrack && audioRef.current) {
            if (audioRef.current.src !== currentTrack.url) {
                audioRef.current.src = currentTrack.url;
                audioRef.current.play()
                    .then(() => setIsPlaying(true))
                    .catch(e => console.error("Audio play error:", e));
            } else {
                if (isPlaying) audioRef.current.play();
                else audioRef.current.pause();
            }
        }
    }, [currentTrack, isPlaying]);

    const playTrack = (track: AudioTrack) => {
        setCurrentTrack(track);
        setIsPlaying(true);
    };

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    const playNext = () => {
        if (!currentTrack || playlist.length === 0) return;
        const currentIndex = playlist.findIndex(t => t.url === currentTrack.url);

        if (currentIndex < playlist.length - 1) {
            // Play next track automatically
            playTrack(playlist[currentIndex + 1]);
        } else if (loopMode === 'inf') {
            // Loop back to first track
            playTrack(playlist[0]);
        } else {
            // End of playlist - stop playing
            setIsPlaying(false);
        }
    };

    const playPrevious = () => {
        if (!currentTrack || playlist.length === 0) return;
        const currentIndex = playlist.findIndex(t => t.url === currentTrack.url);
        if (currentIndex > 0) {
            playTrack(playlist[currentIndex - 1]);
        }
    };

    return (
        <AudioContext.Provider value={{
            isPlaying,
            currentTrack,
            playlist,
            speed,
            loopMode,
            playTrack,
            setPlaylist,
            togglePlay,
            playNext,
            playPrevious,
            setSpeed,
            setLoopMode
        }}>
            {children}
        </AudioContext.Provider>
    );
}

export function useAudio() {
    const context = useContext(AudioContext);
    if (context === undefined) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
}

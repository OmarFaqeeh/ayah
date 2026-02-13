"use client";

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { PlayCircle, PauseCircle, ChevronLeft, ChevronRight } from 'lucide-react';

import { useAudio } from '@/components/Audio/AudioContext';

interface Ayah {
    number: number;
    text: string;
    numberInSurah: number;
    juz: number;
    manzil: number;
    page: number;
    ruku: number;
    hizbQuarter: number;
    sajda: boolean;
    audio?: string;
}

interface SurahData {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    revelationType: string;
    numberOfAyahs: number;
    ayahs: Ayah[];
    englishAyahs?: Ayah[];
}

interface SurahViewProps {
    surah: SurahData;
    englishSurah?: SurahData;
    audioSurah?: SurahData;
}

export function SurahView({ surah, englishSurah, audioSurah }: SurahViewProps) {
    const t = useTranslations('Quran');
    const { playTrack, setPlaylist, currentTrack, isPlaying, togglePlay } = useAudio();
    const [currentPage, setCurrentPage] = useState(0);

    const mergedAyahs = surah.ayahs.map((ayah, index) => ({
        ...ayah,
        englishText: englishSurah?.ayahs[index]?.text,
        audioUrl: audioSurah?.ayahs[index]?.audio
    }));

    const handlePlaySurah = () => {
        const newPlaylist = mergedAyahs
            .filter(a => a.audioUrl)
            .map(a => ({
                url: a.audioUrl!,
                surahNumber: surah.number,
                ayahNumber: a.numberInSurah,
                title: `${surah.englishName} - Ayah ${a.numberInSurah}`,
                reciter: "Mishary Rashid Alafasy"
            }));

        setPlaylist(newPlaylist);

        if (currentTrack && newPlaylist.some(t => t.url === currentTrack.url)) {
            togglePlay();
        } else {
            playTrack(newPlaylist[0]);
        }
    };

    // Auto-scroll to page containing currently playing verse
    useEffect(() => {
        if (currentTrack && currentTrack.surahNumber === surah.number && currentTrack.ayahNumber) {
            const ayahIndex = mergedAyahs.findIndex(a => a.numberInSurah === currentTrack.ayahNumber);
            if (ayahIndex !== -1) {
                const ayahsPerPage = surah.numberOfAyahs > 30 ? 15 : surah.numberOfAyahs;
                const pageIndex = Math.floor(ayahIndex / ayahsPerPage);
                setCurrentPage(pageIndex);
            }
        }
    }, [currentTrack, surah.number, surah.numberOfAyahs, mergedAyahs]);

    // Split ayahs into pages (15 ayahs per page for larger surahs, all for small ones)
    const ayahsPerPage = surah.numberOfAyahs > 30 ? 15 : surah.numberOfAyahs;
    const pages: Ayah[][] = [];
    for (let i = 0; i < mergedAyahs.length; i += ayahsPerPage) {
        pages.push(mergedAyahs.slice(i, i + ayahsPerPage));
    }

    const totalPages = pages.length;
    const canGoPrevious = currentPage > 0;
    const canGoNext = currentPage < totalPages - 1;

    const goToPreviousPage = () => {
        if (canGoPrevious) setCurrentPage(currentPage - 1);
    };

    const goToNextPage = () => {
        if (canGoNext) setCurrentPage(currentPage + 1);
    };

    const currentPageAyahs = pages[currentPage] || [];

    return (
        <div className="w-full flex justify-center py-8 px-4">
            <div className="w-full max-w-4xl">
                {/* Header */}
                <div className="text-center space-y-4 mb-8">
                    <h1 className="text-5xl font-amiri font-bold text-primary">{surah.name}</h1>
                    <h2 className="text-2xl font-semibold text-foreground">{surah.englishName}</h2>
                    <p className="text-muted-foreground text-lg">{surah.englishNameTranslation}</p>
                    <div className="flex justify-center gap-4 text-sm text-muted-foreground">
                        <span>{surah.revelationType}</span>
                        <span>•</span>
                        <span>{surah.numberOfAyahs} {t('ayahs')}</span>
                    </div>
                    <button
                        onClick={handlePlaySurah}
                        className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        {isPlaying && currentTrack?.surahNumber === surah.number ? (
                            <>
                                <PauseCircle className="h-5 w-5" />
                                <span>{t('pauseRecitation')}</span>
                            </>
                        ) : (
                            <>
                                <PlayCircle className="h-5 w-5" />
                                <span>{t('playFullSurah')}</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Page Display */}
                <div className="relative w-full flex flex-col items-center">
                    {/* Single Full Page */}
                    <div className="w-full max-w-4xl px-4">
                        <div className="rounded-2xl border-2 border-primary/20 bg-card p-8 md:p-14 shadow-xl min-h-[600px] flex flex-col relative overflow-hidden group">
                            {/* Subtle background pattern/gradient */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/[0.02] to-transparent pointer-events-none"></div>

                            {/* Corner Ornaments - Subtler */}
                            <div className="absolute top-0 left-0 p-6 text-primary/10 text-4xl font-serif">✦</div>
                            <div className="absolute top-0 right-0 p-6 text-primary/10 text-4xl font-serif">✦</div>
                            <div className="absolute bottom-0 left-0 p-6 text-primary/10 text-4xl font-serif">✦</div>
                            <div className="absolute bottom-0 right-0 p-6 text-primary/10 text-4xl font-serif">✦</div>

                            {/* Bismillah on first page only */}
                            {currentPage === 0 && surah.number !== 9 && surah.number !== 1 && (
                                <div className="text-center py-8 font-amiri text-4xl md:text-5xl text-primary border-b border-primary/10 mb-10 z-10 relative">
                                    بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                                </div>
                            )}

                            {/* Quranic Text */}
                            <div className="flex-1 text-center font-amiri text-3xl md:text-[2.75rem] leading-[2.8] md:leading-[3.2] z-10 relative px-4 text-foreground/90">
                                {currentPageAyahs.map((ayah) => {
                                    const isCurrentlyPlaying = currentTrack?.surahNumber === surah.number &&
                                        currentTrack?.ayahNumber === ayah.numberInSurah &&
                                        isPlaying;

                                    return (
                                        <span
                                            key={ayah.number}
                                            className={`transition-all duration-300 inline px-1 ${isCurrentlyPlaying
                                                ? 'text-primary drop-shadow-[0_0_8px_rgba(20,184,166,0.3)] font-bold'
                                                : ''
                                                }`}
                                        >
                                            {ayah.text}{' '}
                                            <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-base mx-2 mb-1 transition-all duration-300 ${isCurrentlyPlaying
                                                ? 'bg-primary text-primary-foreground scale-110 shadow-lg'
                                                : 'bg-primary text-white'
                                                }`}>
                                                {ayah.numberInSurah}
                                            </span>{' '}
                                        </span>
                                    );
                                })}
                            </div>

                            {/* Page Info - Inside the box at the bottom */}
                            <div className="mt-10 pt-6 border-t border-primary/10 w-full text-center z-10">
                                <div className="text-sm text-muted-foreground/80 font-medium tracking-wide">
                                    {surah.englishName} - Quran.page {currentPage + 1} Quran.of {totalPages}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation & Instructions - Below the box */}
                    <div className="mt-10 w-full max-w-4xl px-4 flex flex-col items-center">
                        <div className="flex justify-center items-center gap-4">
                            <button
                                onClick={goToPreviousPage}
                                disabled={!canGoPrevious}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${canGoPrevious
                                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105'
                                    : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                                    }`}
                            >
                                <ChevronLeft className="h-5 w-5" />
                                <span>{t('previous')}</span>
                            </button>

                            <div className="text-sm font-medium text-muted-foreground bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
                                {currentPage + 1} / {totalPages}
                            </div>

                            <button
                                onClick={goToNextPage}
                                disabled={!canGoNext}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${canGoNext
                                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105'
                                    : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                                    }`}
                            >
                                <span>{t('next')}</span>
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="text-center text-[11px] text-muted-foreground/60 uppercase tracking-[0.2em] mt-6">
                            {t('useArrowKeys')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

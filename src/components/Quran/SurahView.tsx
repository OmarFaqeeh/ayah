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
        <div className="max-w-7xl mx-auto px-4 py-8">
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
            <div className="relative">
                {/* Single Full Page */}
                <div className="mx-auto max-w-4xl">
                    <div className="rounded-lg border-2 border-primary/30 bg-gradient-to-br from-secondary/20 to-accent/10 p-12 shadow-xl min-h-[700px] flex flex-col">
                        {/* Bismillah on first page only */}
                        {currentPage === 0 && surah.number !== 9 && surah.number !== 1 && (
                            <div className="text-center py-6 font-amiri text-4xl text-primary border-b-2 border-primary/20 mb-8">
                                بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                            </div>
                        )}

                        {/* Centered Arabic Text */}
                        <div className="flex-1 text-center font-amiri text-3xl md:text-4xl leading-loose">
                            {currentPageAyahs.map((ayah) => {
                                const isCurrentlyPlaying = currentTrack?.surahNumber === surah.number &&
                                    currentTrack?.ayahNumber === ayah.numberInSurah &&
                                    isPlaying;

                                return (
                                    <span
                                        key={ayah.number}
                                        className={`transition-all duration-300 ${isCurrentlyPlaying
                                                ? 'text-primary drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                                                : ''
                                            }`}
                                    >
                                        {ayah.text}{' '}
                                        <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-base mx-2 transition-all duration-300 ${isCurrentlyPlaying
                                                ? 'bg-primary text-primary-foreground shadow-lg scale-110'
                                                : 'bg-primary/20 text-primary'
                                            }`}>
                                            {ayah.numberInSurah}
                                        </span>{' '}
                                    </span>
                                );
                            })}
                        </div>

                        {/* Page Number */}
                        <div className="text-center text-sm text-muted-foreground mt-6 pt-4 border-t border-border">
                            {surah.englishName} - {t('page')} {currentPage + 1} {t('of')} {totalPages}
                        </div>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-center items-center gap-4 mt-8">
                    <button
                        onClick={goToPreviousPage}
                        disabled={!canGoPrevious}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${canGoPrevious
                                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                : 'bg-muted text-muted-foreground cursor-not-allowed'
                            }`}
                    >
                        <ChevronLeft className="h-5 w-5" />
                        <span>{t('previous')}</span>
                    </button>

                    <div className="text-sm text-muted-foreground">
                        {currentPage + 1} / {totalPages}
                    </div>

                    <button
                        onClick={goToNextPage}
                        disabled={!canGoNext}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${canGoNext
                                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                : 'bg-muted text-muted-foreground cursor-not-allowed'
                            }`}
                    >
                        <span>{t('next')}</span>
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>

                {/* Keyboard Navigation Hint */}
                <div className="text-center text-xs text-muted-foreground mt-4">
                    {t('useArrowKeys')}
                </div>
            </div>
        </div>
    );
}

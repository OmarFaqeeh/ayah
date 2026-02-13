"use client";

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { Loader2, Search } from 'lucide-react';

interface Surah {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    revelationType: string;
}

export function SurahList() {
    const t = useTranslations('Quran');
    const locale = useLocale();
    const [surahs, setSurahs] = useState<Surah[]>([]);
    const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetch('https://api.alquran.cloud/v1/surah')
            .then(res => res.json())
            .then(data => {
                if (data.code === 200) {
                    setSurahs(data.data);
                    setFilteredSurahs(data.data);
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const lowerSearch = search.toLowerCase();
        setFilteredSurahs(surahs.filter(surah =>
            surah.englishName.toLowerCase().includes(lowerSearch) ||
            surah.englishNameTranslation.toLowerCase().includes(lowerSearch) ||
            surah.name.includes(search) ||
            surah.number.toString().includes(search)
        ));
    }, [search, surahs]);

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder={t('search')}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-background border-2 border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-center"
                />
            </div>

            {/* Surah Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSurahs.map((surah) => (
                    <Link
                        key={surah.number}
                        href={`/quran/${surah.number}`}
                        className="block group relative"
                    >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                        <div className="relative rounded-lg border-2 border-primary/20 p-5 hover:border-primary/40 transition-all bg-card geometric-pattern">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/30 text-primary font-bold text-sm">
                                        {surah.number}
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-semibold group-hover:text-primary transition-colors font-amiri text-lg">
                                            {locale === 'ar' ? surah.name : surah.englishName}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {locale === 'ar' ? surah.englishName : surah.englishNameTranslation}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-medium uppercase tracking-wider text-primary/70">
                                        {surah.revelationType === 'Meccan' ? t('meccan') : t('medinan')}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {surah.numberOfAyahs} {t('ayahs')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

"use client";

import { useTranslations } from 'next-intl';
import { PrayerTimesWidget } from '@/components/PrayerTimes/PrayerTimesWidget';
import { RamadanWidget } from '@/components/Ramadan/RamadanWidget';
import { useEffect, useState } from 'react';

export default function HomePage() {
    const t = useTranslations('HomePage');
    const tLogin = useTranslations('Login');
    const [user, setUser] = useState<{ name: string } | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <main className="container mx-auto flex flex-col items-center justify-center py-12 gap-8">
            {/* Decorative Header */}
            <div className="text-center space-y-6 relative">
                <div className="decorative-divider mb-6">
                    <span className="text-primary text-2xl">✦</span>
                </div>

                <h1 className="text-5xl font-bold tracking-tight lg:text-6xl font-amiri text-primary relative inline-block">
                    <span className="relative z-10">{t('title')}</span>
                    <div className="absolute -inset-4 bg-gradient-to-r from-transparent via-primary/5 to-transparent blur-xl"></div>
                </h1>

                <div className="flex items-center justify-center gap-4">
                    <span className="text-primary/40">━━━</span>
                    <span className="text-primary text-xl">✦</span>
                    <span className="text-primary/40">━━━</span>
                </div>

                <p className="text-xl text-muted-foreground font-amiri">
                    {user ? `${tLogin('welcome')}, ${user.name}` : t('welcome')}
                </p>

                <div className="decorative-divider mt-6">
                    <span className="text-primary text-2xl">✦</span>
                </div>
            </div>

            {/* Content Grid with Decorative Borders */}
            <div className="w-full max-w-6xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-2">
                <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-lg blur opacity-50"></div>
                    <div className="relative">
                        <PrayerTimesWidget />
                    </div>
                </div>

                {/* Ramadan Widget */}
                <div className="relative">
                    <RamadanWidget />
                </div>
            </div>

            {/* Bottom Decorative Element */}
            <div className="mt-8 flex items-center justify-center gap-4 text-primary/30">
                <span>✦</span>
                <span className="text-xs">━━━━━</span>
                <span className="text-lg">☪</span>
                <span className="text-xs">━━━━━</span>
                <span>✦</span>
            </div>
        </main>
    );
}

"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { isRamadan, daysUntilRamadan } from '@/utils/islamicCalendar';

export function RamadanWidget() {
    const t = useTranslations('Ramadan');
    const [inRamadan, setInRamadan] = useState(false);
    const [daysLeft, setDaysLeft] = useState(0);

    useEffect(() => {
        const checkRamadan = () => {
            setInRamadan(isRamadan());
            setDaysLeft(daysUntilRamadan());
        };

        checkRamadan();
        // Update daily
        const interval = setInterval(checkRamadan, 1000 * 60 * 60 * 24);
        return () => clearInterval(interval);
    }, []);

    if (inRamadan) {
        return (
            <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-primary/20 to-primary/30 rounded-lg blur opacity-75"></div>
                <div className="relative rounded-lg border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-card to-primary/5 p-6 shadow-xl geometric-pattern">
                    <div className="text-center space-y-4">
                        {/* Crescent Moon Icon */}
                        <div className="flex justify-center">
                            <div className="text-6xl">🌙</div>
                        </div>

                        {/* Ramadan Greeting */}
                        <h3 className="text-2xl font-bold font-amiri text-primary">
                            Ramadan Mubarak
                        </h3>
                        <p className="text-lg text-muted-foreground font-amiri">
                            رمضان مبارك
                        </p>

                        {/* Decorative Divider */}
                        <div className="flex items-center justify-center gap-3 py-2">
                            <span className="text-primary/40">✦</span>
                            <span className="text-primary/40">✦</span>
                            <span className="text-primary/40">✦</span>
                        </div>

                        <p className="text-sm text-muted-foreground italic">
                            May this blessed month bring peace and prosperity
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-lg blur opacity-50"></div>
            <div className="relative rounded-lg border-2 border-primary/30 bg-card p-6 shadow-xl geometric-pattern">
                <div className="text-center space-y-4">
                    {/* Crescent Moon Icon */}
                    <div className="flex justify-center">
                        <div className="text-5xl opacity-70">🌙</div>
                    </div>

                    {/* Countdown */}
                    <div>
                        <p className="text-sm text-muted-foreground font-amiri mb-2">
                            Ramadan Countdown
                        </p>
                        <div className="text-4xl font-bold text-primary font-amiri">
                            {daysLeft}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            {daysLeft === 1 ? 'day remaining' : 'days remaining'}
                        </p>
                    </div>

                    {/* Decorative Divider */}
                    <div className="flex items-center justify-center gap-3 py-2">
                        <span className="text-primary/40 text-xs">✦</span>
                        <span className="text-primary/40 text-xs">✦</span>
                        <span className="text-primary/40 text-xs">✦</span>
                    </div>

                    <p className="text-xs text-muted-foreground italic">
                        Prepare your heart for the blessed month
                    </p>
                </div>
            </div>
        </div>
    );
}

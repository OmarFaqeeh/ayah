"use client";

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Loader2, MapPin, Clock } from 'lucide-react';
import { getIslamicDayName, getTimeUntilNextPrayer } from '@/utils/islamicCalendar';

type PrayerTimings = {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
    [key: string]: string;
};

const CITIES = [
    { name: "Amman", country: "Jordan" },
    { name: "Jerash", country: "Jordan" },
    { name: "Zarqa", country: "Jordan" },
    { name: "Mecca", country: "Saudi Arabia" },
    { name: "Medina", country: "Saudi Arabia" },
    { name: "Riyadh", country: "Saudi Arabia" },
    { name: "Jeddah", country: "Saudi Arabia" },
    { name: "Cairo", country: "Egypt" },
    { name: "Dubai", country: "United Arab Emirates" },
    { name: "Istanbul", country: "Turkey" },
    { name: "London", country: "United Kingdom" },
    { name: "New York", country: "United States" },
    { name: "Los Angeles", country: "United States" },
    { name: "Toronto", country: "Canada" },
    { name: "Paris", country: "France" },
    { name: "Berlin", country: "Germany" },
    { name: "Kuala Lumpur", country: "Malaysia" },
    { name: "Jakarta", country: "Indonesia" },
];

export function PrayerTimesWidget() {
    const t = useTranslations('PrayerTimes');
    const locale = useLocale();
    const [timings, setTimings] = useState<PrayerTimings | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCity, setSelectedCity] = useState<string>("Mecca");
    const [selectedCountry, setSelectedCountry] = useState<string>("Saudi Arabia");
    const [currentTime, setCurrentTime] = useState(new Date());
    const [nextPrayerInfo, setNextPrayerInfo] = useState<any>(null);

    // Load saved location from localStorage
    useEffect(() => {
        const savedCity = localStorage.getItem('selectedCity');
        const savedCountry = localStorage.getItem('selectedCountry');

        if (savedCity && savedCountry) {
            setSelectedCity(savedCity);
            setSelectedCountry(savedCountry);
        }
    }, []);

    useEffect(() => {
        // Try getting location first
        if ("geolocation" in navigator && !localStorage.getItem('selectedCity')) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchTimingsByCoords(latitude, longitude);
                },
                (err) => {
                    console.error("Geolocation error:", err);
                    fetchTimingsByCity(selectedCity, selectedCountry);
                }
            );
        } else {
            fetchTimingsByCity(selectedCity, selectedCountry);
        }
    }, [selectedCity, selectedCountry]);

    // Update clock every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Calculate next prayer
    useEffect(() => {
        if (timings) {
            const info = getTimeUntilNextPrayer(timings);
            setNextPrayerInfo(info);
        }
    }, [timings, currentTime]);

    const fetchTimingsByCoords = async (lat: number, lng: number) => {
        try {
            setLoading(true);
            const date = new Date();
            const timestamp = Math.floor(date.getTime() / 1000);
            const res = await fetch(`https://api.aladhan.com/v1/timings/${timestamp}?latitude=${lat}&longitude=${lng}&method=2`);
            const data = await res.json();
            if (data.code === 200) {
                setTimings(data.data.timings);
            } else {
                throw new Error("API Error");
            }
        } catch (e) {
            setError(t('error'));
        } finally {
            setLoading(false);
        }
    };

    const fetchTimingsByCity = async (city: string, country: string) => {
        try {
            setLoading(true);
            const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=2`);
            const data = await res.json();
            if (data.code === 200) {
                setTimings(data.data.timings);
            } else {
                throw new Error("API Error");
            }
        } catch (e) {
            setError(t('error'));
        } finally {
            setLoading(false);
        }
    };

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const cityData = CITIES.find(c => c.name === e.target.value);
        if (cityData) {
            setSelectedCity(cityData.name);
            setSelectedCountry(cityData.country);
            // Save to localStorage
            localStorage.setItem('selectedCity', cityData.name);
            localStorage.setItem('selectedCountry', cityData.country);
            fetchTimingsByCity(cityData.name, cityData.country);
        }
    };

    const prayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const dayName = getIslamicDayName(currentTime.getDay(), locale);

    return (
        <div className="rounded-lg border-2 border-primary/30 bg-card text-card-foreground shadow-xl w-full geometric-pattern">
            {/* Decorative Header */}
            <div className="flex flex-col space-y-3 p-6 pb-4 border-b-2 border-primary/20 bg-gradient-to-r from-primary/5 via-transparent to-primary/5">
                <div className="flex items-center justify-center gap-3">
                    <span className="text-primary text-sm">✦</span>
                    <h3 className="font-semibold leading-none tracking-tight text-xl font-amiri text-primary">{t('title')}</h3>
                    <span className="text-primary text-sm">✦</span>
                </div>

                {/* Current Time and Date */}
                <div className="text-center space-y-2 py-3 border-y border-primary/10">
                    <div className="flex items-center justify-center gap-2 text-2xl font-bold text-primary font-mono">
                        <Clock className="h-5 w-5" />
                        {currentTime.toLocaleTimeString(locale === 'ar' ? 'ar-SA' : 'en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                        })}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        <div>{dayName}, {currentTime.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</div>
                    </div>
                </div>

                {/* Next Prayer Countdown */}
                {nextPrayerInfo && nextPrayerInfo.nextPrayer && (
                    <div className="text-center bg-primary/10 rounded-lg p-3 border border-primary/20">
                        <p className="text-xs text-muted-foreground mb-1">{t('next')}</p>
                        <p className="text-lg font-bold text-primary font-amiri">{t(nextPrayerInfo.nextPrayer.toLowerCase())}</p>
                        <p className="text-sm text-primary/80 font-mono mt-1">{nextPrayerInfo.timeRemaining}</p>
                    </div>
                )}

                {/* City Selector */}
                <div className="flex items-center justify-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <select
                        value={selectedCity}
                        onChange={handleCityChange}
                        className="text-sm bg-secondary/50 border-2 border-primary/20 rounded-md px-3 py-1.5 flex-1 max-w-xs font-amiri"
                    >
                        {CITIES.map(city => (
                            <option key={city.name} value={city.name}>
                                {city.name}, {city.country}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="p-6 pt-4">
                {loading ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="animate-spin h-8 w-8 text-primary" />
                    </div>
                ) : error ? (
                    <div className="text-destructive p-4 text-center">{error}</div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {prayers.map((prayer) => {
                            const isNext = nextPrayerInfo?.nextPrayer === prayer;
                            return (
                                <div key={prayer} className="relative group">
                                    <div className={`absolute -inset-0.5 rounded-md blur opacity-0 group-hover:opacity-100 transition duration-300 ${isNext ? 'bg-gradient-to-r from-primary/40 to-primary/20 opacity-75' : 'bg-gradient-to-r from-primary/20 to-primary/10'
                                        }`}></div>
                                    <div className={`relative flex flex-col items-center justify-center p-4 rounded-md border-2 transition-all ${isNext
                                        ? 'bg-gradient-to-br from-primary/20 to-primary/10 border-primary/50 shadow-lg'
                                        : 'bg-gradient-to-br from-secondary/50 to-secondary/30 border-primary/20 hover:border-primary/40'
                                        }`}>
                                        <span className={`text-sm font-medium font-amiri ${isNext ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                                            {t(prayer.toLowerCase())}
                                        </span>
                                        <span className={`text-xl font-bold mt-1 ${isNext ? 'text-primary' : 'text-primary/80'}`}>
                                            {timings?.[prayer]}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Bottom Decoration */}
                <div className="flex items-center justify-center gap-3 mt-6 pt-4 border-t border-primary/10">
                    <span className="text-primary/40 text-xs">✦</span>
                    <span className="text-primary/40 text-xs">✦</span>
                    <span className="text-primary/40 text-xs">✦</span>
                </div>
            </div>
        </div>
    );
}

// Islamic Calendar Utilities

/**
 * Convert Gregorian date to Hijri (Islamic) date
 * Using a simplified algorithm - for production, consider using a library like 'hijri-date'
 */
export function gregorianToHijri(date: Date): { year: number; month: number; day: number; monthName: string } {
    // Simplified conversion (approximate)
    // For accurate conversion, you'd use astronomical calculations or a library
    const gregorianYear = date.getFullYear();
    const gregorianMonth = date.getMonth() + 1;
    const gregorianDay = date.getDate();

    // Approximate Hijri year (Islamic calendar started in 622 CE)
    const hijriYear = Math.floor((gregorianYear - 622) * 1.030684) + 1;

    // Islamic months
    const islamicMonths = [
        'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
        'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Shaban',
        'Ramadan', 'Shawwal', 'Dhul-Qadah', 'Dhul-Hijjah'
    ];

    // Simplified month calculation
    const dayOfYear = Math.floor((Date.UTC(gregorianYear, gregorianMonth - 1, gregorianDay) - Date.UTC(gregorianYear, 0, 0)) / 86400000);
    const hijriMonth = Math.floor((dayOfYear / 30.5) % 12);
    const hijriDay = Math.floor(dayOfYear % 30) + 1;

    return {
        year: hijriYear,
        month: hijriMonth + 1,
        day: hijriDay,
        monthName: islamicMonths[hijriMonth]
    };
}

/**
 * Calculate Ramadan dates for current year
 */
export function getRamadanDates(year: number): { start: Date; end: Date } {
    // Ramadan 2026 approximately starts around February 17, 2026
    // This is a simplified calculation - in production, use accurate Islamic calendar API
    const ramadanStartApprox = new Date(year, 1, 17); // Feb 17
    const ramadanEndApprox = new Date(year, 2, 18); // Mar 18 (30 days later)

    return {
        start: ramadanStartApprox,
        end: ramadanEndApprox
    };
}

/**
 * Check if current date is in Ramadan
 */
export function isRamadan(date: Date = new Date()): boolean {
    const year = date.getFullYear();
    const { start, end } = getRamadanDates(year);
    return date >= start && date <= end;
}

/**
 * Calculate days until Ramadan
 */
export function daysUntilRamadan(date: Date = new Date()): number {
    const year = date.getFullYear();
    let { start } = getRamadanDates(year);

    // If Ramadan has passed this year, get next year's Ramadan
    if (date > start) {
        const nextYear = getRamadanDates(year + 1);
        start = nextYear.start;
    }

    const diffTime = start.getTime() - date.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
}

/**
 * Format Hijri date
 */
export function formatHijriDate(hijriDate: { year: number; month: number; day: number; monthName: string }): string {
    return `${hijriDate.day} ${hijriDate.monthName} ${hijriDate.year} AH`;
}

/**
 * Get Islamic day name
 */
export function getIslamicDayName(dayIndex: number, locale: string = 'en'): string {
    const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const daysAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

    return locale === 'ar' ? daysAr[dayIndex] : daysEn[dayIndex];
}

/**
 * Calculate time until next prayer
 */
export function getTimeUntilNextPrayer(prayerTimes: { [key: string]: string }): {
    nextPrayer: string;
    timeRemaining: string;
    hours: number;
    minutes: number;
    seconds: number;
} {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const prayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    for (const prayer of prayers) {
        const timeStr = prayerTimes[prayer];
        if (!timeStr) continue;

        const [hours, minutes] = timeStr.split(':').map(Number);
        const prayerTime = hours * 60 + minutes;

        if (prayerTime > currentTime) {
            const diffMinutes = prayerTime - currentTime;
            const h = Math.floor(diffMinutes / 60);
            const m = diffMinutes % 60;
            const s = 60 - now.getSeconds();

            return {
                nextPrayer: prayer,
                timeRemaining: `${h}h ${m}m ${s}s`,
                hours: h,
                minutes: m,
                seconds: s
            };
        }
    }

    // If no prayer found today, next is Fajr tomorrow
    const fajrTime = prayerTimes['Fajr'];
    if (fajrTime) {
        const [hours, minutes] = fajrTime.split(':').map(Number);
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(hours, minutes, 0, 0);

        const diff = tomorrow.getTime() - now.getTime();
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        return {
            nextPrayer: 'Fajr',
            timeRemaining: `${h}h ${m}m ${s}s`,
            hours: h,
            minutes: m,
            seconds: s
        };
    }

    return {
        nextPrayer: '',
        timeRemaining: '',
        hours: 0,
        minutes: 0,
        seconds: 0
    };
}

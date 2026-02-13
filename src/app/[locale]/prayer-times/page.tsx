import { useTranslations } from 'next-intl';
import { PrayerTimesWidget } from '@/components/PrayerTimes/PrayerTimesWidget';

export default function PrayerTimesPage() {
    const t = useTranslations('PrayerTimes');

    return (
        <div className="container mx-auto py-8 space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight font-amiri text-primary">{t('title')}</h1>
            </div>
            <div className="flex justify-center">
                <PrayerTimesWidget />
            </div>
        </div>
    );
}

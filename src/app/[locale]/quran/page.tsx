import { useTranslations } from 'next-intl';
import { SurahList } from '@/components/Quran/SurahList';

export default function QuranPage() {
    const t = useTranslations('Quran');

    return (
        <div className="container mx-auto py-8 space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight font-amiri text-primary">{t('title')}</h1>
            </div>
            <SurahList />
        </div>
    );
}

import { SurahView } from '@/components/Quran/SurahView';
import { notFound } from 'next/navigation';

interface SurahPageProps {
    params: Promise<{
        surahId: string;
        locale: string;
    }>;
}

// Fetch data from API
async function getSurah(id: string) {
    const res = await fetch(`http://api.alquran.cloud/v1/surah/${id}/editions/quran-uthmani,en.sahih,ar.alafasy`);
    if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error('Failed to fetch surah');
    }
    return res.json();
}

export default async function SurahPage({ params }: SurahPageProps) {
    const { surahId } = await params;
    const data = await getSurah(surahId);

    if (!data || data.code !== 200) {
        notFound();
    }

    const arabicSurah = data.data[0];
    const englishSurah = data.data[1];
    const audioSurah = data.data[2];

    return (
        <div className="container mx-auto py-8">
            <SurahView surah={arabicSurah} englishSurah={englishSurah} audioSurah={audioSurah} />
        </div>
    );
}

"use client";

import { useTranslations } from 'next-intl';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function SettingsPage() {
    const t = useTranslations('Settings');

    return (
        <div className="container py-8 space-y-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold border-b pb-4">{t('title')}</h1>

            <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                    <div className="space-y-0.5">
                        <label className="text-base font-semibold">{t('theme')}</label>
                        <p className="text-sm text-muted-foreground">Select your preferred appearance</p>
                    </div>
                    <ThemeToggle />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                    <div className="space-y-0.5">
                        <label className="text-base font-semibold">{t('language')}</label>
                        <p className="text-sm text-muted-foreground">Select your preferred language</p>
                    </div>
                    <LanguageSwitcher />
                </div>
            </div>
        </div>
    );
}

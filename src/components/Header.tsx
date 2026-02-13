import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { User, Settings, LogIn } from 'lucide-react';

export function Header() {
    const t = useTranslations('Navigation');
    const tHome = useTranslations('HomePage');

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-14 items-center justify-between px-4">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="font-bold text-primary text-xl font-amiri">
                            {tHome('title')}
                        </span>
                    </Link>
                    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                        <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            {t('home')}
                        </Link>
                        <Link href="/quran" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            {t('quran')}
                        </Link>
                        <Link href="/prayer-times" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            {t('prayerTimes')}
                        </Link>
                    </nav>
                </div>
                <nav className="flex items-center gap-2">
                    <Link href="/settings" className="p-2 rounded-full hover:bg-secondary transition-colors" aria-label="Settings">
                        <Settings className="h-5 w-5" />
                    </Link>
                    <Link href="/login" className="p-2 rounded-full hover:bg-secondary transition-colors" aria-label="Login">
                        <LogIn className="h-5 w-5" />
                    </Link>
                </nav>
            </div>
        </header>
    );
}

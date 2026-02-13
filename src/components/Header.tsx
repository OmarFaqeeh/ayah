"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { User, Settings, LogIn, Menu, X } from 'lucide-react';

export function Header() {
    const t = useTranslations('Navigation');
    const tHome = useTranslations('HomePage');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
                    <Link href="/settings" className="hidden sm:flex p-2 rounded-full hover:bg-secondary transition-colors" aria-label="Settings">
                        <Settings className="h-5 w-5" />
                    </Link>
                    <Link href="/login" className="hidden sm:flex p-2 rounded-full hover:bg-secondary transition-colors" aria-label="Login">
                        <LogIn className="h-5 w-5" />
                    </Link>
                    <button
                        className="md:hidden p-2 rounded-md hover:bg-secondary transition-colors"
                        onClick={toggleMenu}
                        aria-label="Toggle Menu"
                    >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </nav>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t bg-background px-4 py-4 space-y-4 shadow-lg animate-in slide-in-from-top duration-300">
                    <nav className="flex flex-col space-y-4 text-sm font-medium">
                        <Link
                            href="/"
                            className="transition-colors hover:text-primary py-2 border-b border-primary/5"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {t('home')}
                        </Link>
                        <Link
                            href="/quran"
                            className="transition-colors hover:text-primary py-2 border-b border-primary/5"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {t('quran')}
                        </Link>
                        <Link
                            href="/prayer-times"
                            className="transition-colors hover:text-primary py-2 border-b border-primary/5"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {t('prayerTimes')}
                        </Link>
                        <div className="flex gap-4 pt-2">
                            <Link href="/settings" className="flex items-center gap-2 text-foreground/60" onClick={() => setIsMenuOpen(false)}>
                                <Settings className="h-5 w-5" />
                                <span>{t('settings') || 'Settings'}</span>
                            </Link>
                            <Link href="/login" className="flex items-center gap-2 text-foreground/60" onClick={() => setIsMenuOpen(false)}>
                                <LogIn className="h-5 w-5" />
                                <span>{t('login') || 'Login'}</span>
                            </Link>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}


import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { IslamicBackground } from "@/components/IslamicBackground";
import "../globals.css";
// import { Geist, Geist_Mono } from "next/font/google"; // Removed for now to simplify, or add back if needed
import { Amiri } from "next/font/google";

import { AudioProvider } from "@/components/Audio/AudioContext";
import { AudioPlayer } from "@/components/Audio/AudioPlayer";

const amiri = Amiri({
    subsets: ["arabic", "latin"],
    weight: ["400", "700"],
    variable: "--font-amiri",
    display: "swap",
});

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const messages = await getMessages();

    return (
        <html lang={locale} dir="ltr" suppressHydrationWarning>
            <body className={`min-h-screen bg-background font-amiri antialiased text-foreground ${amiri.variable}`} dir="ltr">
                <NextIntlClientProvider messages={messages}>
                    <Providers attribute="class" defaultTheme="system" enableSystem>
                        <AudioProvider>
                            <IslamicBackground />
                            <div className="relative flex min-h-screen flex-col z-10">
                                <Header />
                                <div className="flex-1">{children}</div>
                                <Footer />
                                <AudioPlayer />
                            </div>
                        </AudioProvider>
                    </Providers>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}

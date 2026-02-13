"use client";

import { useEffect, useState } from 'react';

export function IslamicBackground() {
    const [stars, setStars] = useState<{ id: number; left: string; top: string; delay: number; duration: number }[]>([]);

    useEffect(() => {
        // Generate random floating stars
        const generatedStars = Array.from({ length: 15 }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            delay: Math.random() * 6,
            duration: 4 + Math.random() * 4
        }));
        setStars(generatedStars);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {/* Floating Stars/Ornaments */}
            {stars.map((star) => (
                <div
                    key={star.id}
                    className="absolute text-primary/20 text-2xl floating-ornament"
                    style={{
                        left: star.left,
                        top: star.top,
                        animationDelay: `${star.delay}s`,
                        animationDuration: `${star.duration}s`
                    }}
                >
                    ✦
                </div>
            ))}

            {/* Corner Decorations */}
            <div className="absolute top-4 left-4 text-primary/10 text-6xl rotating-star">
                ☪
            </div>
            <div className="absolute top-4 right-4 text-primary/10 text-6xl rotating-star" style={{ animationDirection: 'reverse' }}>
                ☪
            </div>
            <div className="absolute bottom-4 left-4 text-primary/10 text-5xl floating-ornament">
                ✦
            </div>
            <div className="absolute bottom-4 right-4 text-primary/10 text-5xl floating-ornament" style={{ animationDelay: '3s' }}>
                ✦
            </div>

            {/* Decorative Borders */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent shimmer-effect"></div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent shimmer-effect" style={{ animationDelay: '1.5s' }}></div>
        </div>
    );
}

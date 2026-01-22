"use client";

import Script from 'next/script';
import { useEffect } from 'react';

declare global {
    interface Window {
        UnicornStudio: {
            isInitialized: boolean;
            init: () => void;
        };
    }
}

export function BackgroundController() {
    useEffect(() => {
        // Check if script is already loaded and initialize if needed
        if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
            window.UnicornStudio.init();
            window.UnicornStudio.isInitialized = true;
        }
    }, []);

    return (
        <>
            <Script
                src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js"
                strategy="afterInteractive"
                onLoad={() => {
                    if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
                        window.UnicornStudio.init();
                        window.UnicornStudio.isInitialized = true;
                    }
                }}
            />
            <div
                className="aura-background-component fixed top-0 w-full h-screen -z-10 hue-rotate-15"
                data-alpha-mask="80"
                style={{
                    maskImage: "linear-gradient(to bottom, transparent 0%, black 0%, black 80%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 0%, black 80%, transparent 100%)"
                }}
            >
                <div className="aura-background-component top-0 w-full -z-10 absolute h-full">
                    <div data-us-project="ILgOO23w4wEyPQOKyLO4" className="absolute w-full h-full left-0 top-0 -z-10"></div>
                </div>
            </div>
        </>
    );
}

"use client";

import { useEffect } from 'react';

export function RevealAnimation() {
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        // Initial check
        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach(el => observer.observe(el));

        // Optional: Re-check on mutation if dynamic content is added (simplified for now)

        return () => observer.disconnect();
    }, []); // Run once on mount

    return null;
}

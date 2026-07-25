"use client";

import { useEffect, useState } from "react";
import type Lenis from "lenis";

/**
 * Fixed "back to top" button, bottom-right. Appears once the user has scrolled
 * past ~one screen. Scrolls up through Lenis (exposed on window by SmoothScroll)
 * so the ride back stays smooth and in sync with the pinned timelines; falls
 * back to native smooth scroll if Lenis isn't mounted (e.g. reduced motion).
 */
export default function BackToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 700);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const toTop = () => {
        const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
        if (lenis) lenis.scrollTo(0, { duration: 1.2 });
        else window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <button
            type="button"
            onClick={toTop}
            aria-label="Back to top"
            className={`fixed bottom-6 right-6 z-[120] flex h-12 w-12 items-center justify-center rounded-full bg-[#f4c020] text-black shadow-[0_6px_24px_rgba(0,0,0,0.5)] outline-none transition-all duration-300 hover:bg-[#ffd84d] focus-visible:ring-2 focus-visible:ring-white ${
                visible
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-4 opacity-0"
            }`}
        >
            <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <path d="M12 19V5" />
                <path d="M5 12l7-7 7 7" />
            </svg>
        </button>
    );
}

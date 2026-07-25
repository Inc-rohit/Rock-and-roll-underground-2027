"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll affordances so first-time visitors immediately grasp that the page is
 * a long, scroll-driven experience:
 *   1. a thin gold progress bar pinned to the very top that fills as you scroll
 *      (a universal "there's much more below" signal), and
 *   2. a prominent "Scroll to explore" prompt at the bottom of the first screen
 *      that persists until the visitor has clearly started scrolling, then
 *      fades — and returns if they scroll back to the top.
 *
 * Both update by writing to the DOM directly (rAF-throttled) — NO React state,
 * so nothing re-renders on the scroll hot path (keeps scrolling buttery).
 */
export default function ScrollGuide() {
    const barRef = useRef<HTMLDivElement>(null);
    const hintRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let raf = 0;
        let pending = false;
        const apply = () => {
            pending = false;
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
            if (barRef.current) barRef.current.style.width = `${p * 100}%`;
            if (hintRef.current)
                hintRef.current.style.opacity =
                    window.scrollY > window.innerHeight * 0.45 ? "0" : "1";
        };
        const onScroll = () => {
            if (!pending) {
                pending = true;
                raf = requestAnimationFrame(apply);
            }
        };
        apply();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, []);

    return (
        <>
            {/* top scroll-progress bar */}
            <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[140] h-[3px]">
                <div
                    ref={barRef}
                    className="h-full w-0 bg-[#f4c020] shadow-[0_0_10px_rgba(244,192,32,0.7)]"
                />
            </div>

            {/* bottom "scroll to explore" prompt */}
            <div
                ref={hintRef}
                aria-hidden="true"
                className="scroll-hint pointer-events-none fixed inset-x-0 bottom-6 z-[130] flex flex-col items-center gap-2 opacity-100 transition-opacity duration-500"
            >
                <span className="[font-family:var(--font-bebas)] text-base uppercase tracking-[0.42em] text-[#f4c020] [text-shadow:0_2px_12px_rgba(0,0,0,0.95)]">
                    Scroll to explore
                </span>
                <span className="scroll-hint-arrow text-[#f4c020] [filter:drop-shadow(0_0_8px_rgba(244,192,32,0.5))]">
                    <svg
                        width="30"
                        height="30"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M6 4l6 6 6-6" opacity="0.5" />
                        <path d="M6 11l6 6 6-6" />
                    </svg>
                </span>
            </div>
        </>
    );
}

"use client";

import { useEffect, useRef, useState } from "react";
import type Lenis from "lenis";

/**
 * Scroll affordances so visitors grasp that the page is a long, scroll-driven
 * experience — and can see where they are / jump around:
 *   1. side SECTION DOTS on the right edge — one per act; the current act's dot
 *      is filled gold, and clicking a dot smooth-scrolls to that section.
 *   2. a "Scroll to explore" prompt at the bottom of the first screen that
 *      persists until the visitor starts scrolling, then fades (returns at top).
 *
 * Reads Lenis's scroll (the same signal ScrollTrigger uses) and subscribes to
 * its scroll event so the indicators stay in lockstep with the experience even
 * during smooth/programmatic scrolls; falls back to the native window scroll.
 * The active section is detected by each section's viewport position, which is
 * robust for the pinned sections (a pinned act sits at top:0 while it's active).
 */
const SECTIONS = [
    { sel: ".concert-hero", label: "Concert" },
    { sel: ".audience-section", label: "Sponsor Benefits" },
    { sel: ".skydive", label: "Feel the Rush" },
    { sel: ".sponsor-tiers", label: "Sponsor Tiers" },
    { sel: "#sec-partner", label: "Partner With Us" },
];

const getLenis = () => (window as unknown as { __lenis?: Lenis }).__lenis;

export default function ScrollGuide() {
    const hintRef = useRef<HTMLDivElement>(null);
    const activeRef = useRef(0);
    const [active, setActive] = useState(0);

    useEffect(() => {
        let raf = 0;
        let pending = false;
        const apply = () => {
            pending = false;
            const scroll = getLenis()?.scroll ?? window.scrollY;
            if (hintRef.current)
                hintRef.current.style.opacity = scroll > window.innerHeight * 0.45 ? "0" : "1";
            // active = last section whose top has reached ~35% up the viewport.
            let idx = 0;
            const trigger = window.innerHeight * 0.35;
            for (let i = 0; i < SECTIONS.length; i++) {
                const el = document.querySelector(SECTIONS[i].sel);
                if (el && el.getBoundingClientRect().top <= trigger) idx = i;
            }
            if (idx !== activeRef.current) {
                activeRef.current = idx;
                setActive(idx);
            }
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

        // Subscribe to Lenis's scroll event too (handles the mount-order race
        // with a short retry, since SmoothScroll sets window.__lenis separately).
        let lenis: Lenis | undefined;
        let retry: ReturnType<typeof setInterval> | undefined;
        const attach = () => {
            const l = getLenis();
            if (l && !lenis) {
                lenis = l;
                l.on("scroll", onScroll);
            }
            return !!lenis;
        };
        if (!attach()) retry = setInterval(() => attach() && retry && clearInterval(retry), 300);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            if (retry) clearInterval(retry);
            lenis?.off("scroll", onScroll);
        };
    }, []);

    const jump = (sel: string) => {
        const el = document.querySelector(sel);
        if (!el) return;
        const lenis = getLenis();
        const top = el.getBoundingClientRect().top + (lenis?.scroll ?? window.scrollY);
        if (lenis) lenis.scrollTo(top, { duration: 1.0 });
        else window.scrollTo({ top, behavior: "smooth" });
    };

    return (
        <>
            {/* side section dots */}
            <nav
                aria-label="Sections"
                className="fixed right-5 top-1/2 z-[140] hidden -translate-y-1/2 flex-col items-end gap-3.5 md:flex"
            >
                {SECTIONS.map((s, i) => (
                    <button
                        key={s.sel}
                        type="button"
                        onClick={() => jump(s.sel)}
                        aria-label={`Go to ${s.label}`}
                        aria-current={active === i}
                        className="group flex items-center gap-2.5"
                    >
                        <span
                            className={`whitespace-nowrap rounded-full bg-black/55 px-2.5 py-1 text-[0.7rem] uppercase tracking-[0.16em] text-[#f4c020] backdrop-blur-sm transition-opacity duration-200 [font-family:var(--font-bebas)] ${
                                active === i ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                            }`}
                        >
                            {s.label}
                        </span>
                        <span
                            className={`block rounded-full transition-all duration-300 ${
                                active === i
                                    ? "h-3 w-3 bg-[#f4c020] shadow-[0_0_10px_rgba(244,192,32,0.85)]"
                                    : "h-2.5 w-2.5 border border-[#f4c020]/50 group-hover:border-[#f4c020] group-hover:bg-[#f4c020]/30"
                            }`}
                        />
                    </button>
                ))}
            </nav>

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

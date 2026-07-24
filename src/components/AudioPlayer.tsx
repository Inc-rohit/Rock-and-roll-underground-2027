"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Event soundtrack with a top-right toggle.
 *
 * Browsers block audio-with-sound from autoplaying on load, but they DO allow
 * MUTED autoplay. So we start the track muted immediately, then unmute it on
 * the very first user interaction (click / scroll / key / touch) — the track is
 * already running, so sound switches on the instant the visitor engages. The
 * button toggles sound on/off (animated equalizer bars = sound on).
 */
export default function AudioPlayer() {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [soundOn, setSoundOn] = useState(false);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.volume = 0.55;

        // 1) Muted autoplay (always allowed) — the track starts on load.
        audio.muted = true;
        audio.play().catch(() => {});

        // 2) Unmute at the first interaction. A click/tap/key is a valid user
        //    gesture; scroll/wheel are best-effort (the element is already
        //    playing, so unmuting usually takes effect immediately).
        const events = ["pointerdown", "click", "keydown", "touchstart", "wheel", "scroll"];
        const enableSound = () => {
            audio.muted = false;
            audio
                .play()
                .then(() => setSoundOn(true))
                .catch(() => {});
            cleanup();
        };
        const cleanup = () =>
            events.forEach((e) => window.removeEventListener(e, enableSound));
        events.forEach((e) =>
            window.addEventListener(e, enableSound, { passive: true }),
        );

        return cleanup;
    }, []);

    const toggle = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (soundOn) {
            audio.pause();
            setSoundOn(false);
        } else {
            audio.muted = false;
            audio
                .play()
                .then(() => setSoundOn(true))
                .catch(() => {});
        }
    };

    return (
        <>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <audio ref={audioRef} loop preload="auto">
                <source src="/audio.m4a" type="audio/mp4" />
                <source src="/audio.wav" type="audio/wav" />
            </audio>
            <button
                type="button"
                onClick={toggle}
                aria-label={soundOn ? "Mute music" : "Play music"}
                aria-pressed={soundOn}
                className="fixed right-5 top-5 z-[200] flex h-12 w-12 items-center justify-center rounded-full bg-black/45 ring-1 ring-white/25 backdrop-blur-md transition-colors hover:bg-black/70"
            >
                <span className={`sound-wave ${soundOn ? "is-playing" : "is-paused"}`}>
                    <i />
                    <i />
                    <i />
                    <i />
                </span>
            </button>
        </>
    );
}

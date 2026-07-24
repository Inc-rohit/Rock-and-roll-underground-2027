import Image from "next/image";

/**
 * Layer 3 — musicians (independent of the text panels).
 *
 * Each silhouette is absolutely positioned and horizontally centred on the
 * stage floor (feet on the floor, not the viewport edge). ConcertHero's
 * timeline drives each `.musician`: they rise to centre one at a time, then
 * the first four fan out from behind #5 into a row.
 *
 * #5 is the last child, so it naturally stacks on top — the others emerge
 * from behind it. Swap/extend these freely; the animation targets `.musician`.
 */
const SILHOUETTES = [1, 2, 3, 4, 5];

// Crisp gold outline traced to the silhouette's edge (8 stacked directional
// drop-shadows) + a soft dark drop for depth.
const GOLD = "#f7c600";
const GOLD_OUTLINE =
    `drop-shadow(0 -2px 0 ${GOLD}) drop-shadow(0 2px 0 ${GOLD}) ` +
    `drop-shadow(-2px 0 0 ${GOLD}) drop-shadow(2px 0 0 ${GOLD}) ` +
    `drop-shadow(-1.4px -1.4px 0 ${GOLD}) drop-shadow(1.4px -1.4px 0 ${GOLD}) ` +
    `drop-shadow(-1.4px 1.4px 0 ${GOLD}) drop-shadow(1.4px 1.4px 0 ${GOLD}) ` +
    `drop-shadow(0 8px 26px rgba(0,0,0,0.6))`;

export default function MusiciansLayer() {
    return (
        <div aria-hidden="true" className="musicians-layer pointer-events-none absolute inset-0 z-20">
            {SILHOUETTES.map((n) => (
                <div
                    key={n}
                    className="musician absolute bottom-[6vh] left-1/2 h-[48vh] md:h-[54vh]"
                >
                    {/* inner wrapper carries the idle "performing" sway (pivots at the feet)
                        so it never conflicts with the scroll position transforms above */}
                    <div className="musician-inner relative h-full origin-bottom will-change-transform">
                        {/* soft gold glow behind the crisp outline — pulses via GSAP */}
                        <div
                            className="musician-glow pointer-events-none absolute inset-0 will-change-[opacity]"
                            style={{
                                WebkitMaskImage: `url(/stage/silhouette-${n}.png)`,
                                maskImage: `url(/stage/silhouette-${n}.png)`,
                                WebkitMaskSize: "contain",
                                maskSize: "contain",
                                WebkitMaskRepeat: "no-repeat",
                                maskRepeat: "no-repeat",
                                WebkitMaskPosition: "center",
                                maskPosition: "center",
                                background: "linear-gradient(180deg, #ffe79a 0%, #f7a300 100%)",
                                filter: "blur(11px)",
                                mixBlendMode: "screen",
                            }}
                        />
                        <Image
                            src={`/stage/silhouette-${n}.png`}
                            alt=""
                            width={351}
                            height={695}
                            draggable={false}
                            className="relative h-full w-auto object-contain"
                            style={{ filter: GOLD_OUTLINE }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

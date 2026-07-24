import type { Metadata } from "next";

import ConcertHero from "@/components/concert/ConcertHero";
import AudienceSection from "@/components/concert/AudienceSection";
import SkyDiveSection from "@/components/concert/SkyDiveSection";
import AlternatingTextSection from "@/components/concert/AlternatingTextSection";
import SmoothScroll from "@/components/concert/SmoothScroll";

export const metadata: Metadata = {
  title: "Rock & Roll Underground 2027 — The Cutting Room",
  description:
    "Rock & Roll Underground 2027. The Cutting Room · January 11, 2027.",
};

/**
 * Homepage — one continuous, smooth-scrolling experience (all our own now; the
 * Fizzi/Monster Prismic slice showcase has been removed):
 *   1. the cinematic RRU concert hero (pinned scroll sequence)
 *   2. the concert-audience interstitial → Sponsor Benefits finale (2 cans)
 *   3. the "Feel the Rush" sky-dive beat (falling can + gold 3D words)
 *   4. the alternating "Triple the Charge" closer (copy blocks + floating can)
 */
export default function Home() {
  return (
    <SmoothScroll>
      {/* Act 1 — RRU concert hero */}
      <ConcertHero />
      {/* Black band bridging the concert into the audience interstitial. */}
      <div
        aria-hidden="true"
        className="relative z-50 -mt-[2vh] h-[16vh] w-full bg-black"
      />
      {/* Audience interstitial → Sponsor Benefits finale (ends on black). */}
      <AudienceSection />
      {/* "Feel the Rush" falling can (flows out of the black finale). */}
      <SkyDiveSection />
      {/* Closer — alternating copy blocks with a floating can. */}
      <AlternatingTextSection />
    </SmoothScroll>
  );
}

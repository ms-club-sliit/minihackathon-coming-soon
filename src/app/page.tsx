"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const bootSteps = [
  "loading challenges... ok",
  "recruiting hackers... ok",
  "initializing ideas... ok",
  "preparing Mini Hackathon 2026... ok",
  "decrypting event status...",
];

const heroTarget = "COMING SOON_";
const scrambleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-#@%";

function buildScramble(target: string, progress: number) {
  const visibleCount = Math.max(0, Math.floor(target.length * progress));
  return target
    .split("")
    .map((char, index) => {
      if (index < visibleCount) {
        return char;
      }
      return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
    })
    .join("");
}

export default function Home() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const [typingLine, setTypingLine] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const [heroText, setHeroText] = useState("");
  const [isScrambling, setIsScrambling] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();

    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setCompletedLines(bootSteps);
      setTypingLine("");
      setStepIndex(bootSteps.length);
      setHeroText(heroTarget);
      return;
    }

    if (stepIndex >= bootSteps.length) {
      return;
    }

    const line = bootSteps[stepIndex];
    let charIndex = 0;
    const timer = window.setInterval(() => {
      charIndex += 1;
      setTypingLine(line.slice(0, charIndex));

      if (charIndex >= line.length) {
        window.clearInterval(timer);
        setCompletedLines((current) => [...current, line]);
        setTypingLine("");

        nextStepTimer = window.setTimeout(() => {
          if (stepIndex === bootSteps.length - 1) {
            setIsScrambling(true);
          } else {
            setStepIndex((current) => current + 1);
          }
        }, 540);
      }
    }, 28);
    let nextStepTimer: number | undefined;
    setTypingLine("");

    return () => {
      if (timer) window.clearInterval(timer);
      if (nextStepTimer) window.clearTimeout(nextStepTimer);
    };
  }, [reducedMotion, stepIndex]);

  useEffect(() => {
    if (reducedMotion || !isScrambling) {
      return;
    }

    let raf = 0;
    const startedAt = performance.now();
    const duration = 1300;

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      setHeroText(buildScramble(heroTarget, progress));

      if (progress < 1) {
        raf = window.requestAnimationFrame(tick);
      } else {
        setHeroText(heroTarget);
        setIsScrambling(false);
      }
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [isScrambling, reducedMotion]);

  const shownHeroText = useMemo(() => {
    if (reducedMotion) {
      return heroTarget;
    }
    return heroText;
  }, [heroText, reducedMotion]);

  const visibleLines = reducedMotion ? bootSteps : completedLines;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <Image
          src="/bg.jpeg"
          alt=""
          fill
          priority
          className="bg-reference-image"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.84)_30%,rgba(255,255,255,0.42)_62%,rgba(255,255,255,0.08)_82%,rgba(255,255,255,0)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-[64%] bg-white/35" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
        <header className="mb-8 w-full max-w-4xl fade-in sm:mb-10">
          <div className="mx-auto flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 lg:gap-6">
            <Image
              src="/ms_club_logo.svg"
              alt="MS Club logo"
              width={168}
              height={52}
              className="h-10 w-auto object-contain sm:h-14 logo-emphasis"
              priority
            />

            <span
              className="hidden h-7 w-px bg-gradient-to-b from-[#8C63FE]/25 via-[#4B2E9E]/35 to-[#FF6FD8]/25 sm:block"
              aria-hidden="true"
            />

            <span className="text-[#4B2E9E]/30 sm:hidden" aria-hidden="true">
              •
            </span>

            <Image
              src="/MiniHackathon Logo.svg"
              alt="Mini Hackathon 2026 logo"
              width={248}
              height={58}
              className="h-10 w-auto object-contain sm:h-14 logo-emphasis"
              priority
            />
          </div>
        </header>

        <section className="w-full max-w-3xl">
          <div className="terminal-card fade-in flex min-h-[30rem] flex-col overflow-hidden sm:h-[34rem] lg:h-[36rem]">
            <div className="terminal-header mb-5 grid grid-cols-[auto_1fr_auto] items-center gap-2 border-b border-[#4B2E9E]/10 pb-3 sm:mb-6 sm:pb-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              </div>

              <div className="terminal-header-title min-w-0 truncate text-center text-[0.68rem] text-[#4B2E9E]/70 sm:text-xs">
                <span className="sm:hidden">bash — 80x24</span>
                <span className="hidden sm:inline">mini-hackathon-2026 — bash — 80x24</span>
              </div>

              <div className="h-3 w-[3.25rem]" aria-hidden="true" />
            </div>

            <div className="terminal-log flex-1 space-y-2 overflow-hidden font-terminal text-[0.82rem] leading-6 text-[#1c1630]/82 sm:text-base sm:leading-7">
              {visibleLines.map((line) => (
                <p key={line}>
                  <span className="text-[#7FE0FF]">&gt;</span> {line}
                </p>
              ))}

              {typingLine ? (
                <p>
                  <span className="text-[#7FE0FF]">&gt;</span> {typingLine}
                  <span className="cursor-blink ml-1 inline-block align-middle">▍</span>
                </p>
              ) : null}
            </div>

            <div className="mt-7 border-t border-[#4B2E9E]/10 pt-6 text-center sm:mt-8 sm:pt-8">
              <p className="font-terminal text-[clamp(2rem,11vw,3.25rem)] font-black tracking-[-0.08em] sm:text-[clamp(3rem,11vw,6.5rem)]">
                <span className="hero-gradient break-words">{shownHeroText || "\u00A0"}</span>
                <span className="cursor-blink ml-1 align-middle text-[#4B2E9E]/80">▍</span>
              </p>

              <p className="mt-4 text-sm font-semibold sm:mt-5 sm:text-xl">
                <span className="tagline-highlight">Innovation starts here</span>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  useMotionTemplate,
  useInView,
  type MotionValue,
} from "framer-motion";
import Lenis from "lenis";
import {
  ArrowRight,
  ChevronDown,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  Target,
  Eye,
  Flame,
} from "lucide-react";

import ballAsset from "@/assets/cricket-ball.png.asset.json";
const ballImg = ballAsset.url;
import stadiumImg from "@/assets/stadium.jpg";
import batsmanImg from "@/assets/batsman.jpg";
import crowdImg from "@/assets/crowd.jpg";
import helmetImg from "@/assets/helmet.jpg";
import ttLogo from "@/assets/tt-logo.png.asset.json";
import { useIsMobile } from "@/hooks/use-mobile";

/* ---------------- Perf gate ---------------- */
function usePerfMode() {
  const mobile = useIsMobile();
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return { mobile, reduced, lite: mobile || reduced };
}

export const Route = createFileRoute("/")({
  component: TitansLanding,
  head: () => ({
    meta: [
      { title: "Tezpur Titans — Ready to Dominate" },
      {
        name: "description",
        content:
          "Assam's fearless T20 franchise. Step into the Tezpur Titans cinematic universe — story, partners, campus ambassadors and how to join the roar.",
      },
      { property: "og:title", content: "Tezpur Titans — Ready to Dominate" },
      {
        property: "og:description",
        content:
          "A cinematic home for Assam's roar — Tezpur Titans. One team. One dream.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const LOGO_URL = ttLogo.url;
const HERO_BALL_CLEANUP_PROGRESS = 0.62;
let heroBallIntroCompleted = false;

/* ---------------- Smooth scroll ---------------- */
function useLenis(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [enabled]);
}

/* ---------------- Ambient particles ---------------- */
function Embers({ count = 40, className = "" }: { count?: number; className?: string }) {
  const { lite } = usePerfMode();
  const effective = lite ? 0 : count;
  const items = useMemo(
    () =>
      Array.from({ length: effective }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 1 + Math.random() * 3,
        delay: Math.random() * 8,
        duration: 8 + Math.random() * 10,
        dx: (Math.random() - 0.5) * 200,
        hue: Math.random() > 0.7 ? "oklch(0.9 0.15 88)" : "oklch(0.72 0.19 55)",
      })),
    [effective],
  );
  if (effective === 0) return null;
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {items.map((p) => (
        <span
          key={p.id}
          className="absolute bottom-0 rounded-full animate-ember"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: p.hue,
            boxShadow: `0 0 ${p.size * 4}px ${p.hue}`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            ["--dx" as string]: `${p.dx}px`,
          }}
        />
      ))}
    </div>
  );
}

function StadiumLights() {
  const { lite } = usePerfMode();
  if (lite) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {[15, 45, 75].map((left, i) => (
        <div
          key={i}
          className="absolute top-0 h-[120%] w-[40vw] animate-floodlight"
          style={{
            left: `${left}%`,
            background:
              "linear-gradient(180deg, oklch(0.95 0.12 70 / 0.35), oklch(0.72 0.19 55 / 0.05) 60%, transparent)",
            filter: "blur(30px)",
            animationDelay: `${i * 1.6}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ---------------- NAV ---------------- */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-6 transition-all duration-500 ${
          scrolled ? "rounded-full glass mx-4 md:mx-auto py-2 pl-3 pr-2" : "bg-transparent"
        }`}
      >
        <a href="#top" className="flex items-center gap-3">
          <img
            src={LOGO_URL}
            alt="Tezpur Titans"
            width={40}
            height={40}
            className="h-9 w-9 object-contain drop-shadow-[0_0_16px_oklch(0.72_0.19_55/0.6)]"
          />
          <div className="hidden font-display text-xl leading-none tracking-wider sm:block">
            TEZPUR <span className="text-titans">TITANS</span>
          </div>
        </a>
        <nav className="hidden items-center gap-9 lg:flex">
          {[
            ["Home", "top"],
            ["About Us", "about"],
          ].map(([label, id]) => (
            <a
              key={id}
              href={`#${id}`}
              className="group relative text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/70 transition hover:text-titans"
            >
              {label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-titans transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>
        <a
          href="#join"
          className="group inline-flex items-center gap-2 rounded-full bg-titans px-5 py-2.5 text-xs font-bold uppercase tracking-[0.24em] text-jet transition hover:shadow-[0_0_40px_oklch(0.72_0.19_55/0.7)]"
        >
          Join The Titans
          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </a>
      </div>
    </motion.header>
  );
}

/* ================================================================
   SECTION 01 — HERO · "The First Delivery"
   Single cinematic shot: a real white cricket ball sits behind the
   "D" of DOMINATE. Rack focus travels from the headline to the ball,
   the ball rolls up and arcs 45° clockwise above the type, the
   virtual camera dollies in until the leather fills the frame, and
   the seam morphs seamlessly into the Titans helmet that opens
   Section 02. No stadium, no batsman, no cuts — one continuous take.
================================================================ */
function HeroCinematic() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // Second progress track: 0 while hero is still pinned, 1 once hero has fully
  // scrolled out — used to fade the leather out ONLY as About enters view.
  const { scrollYProgress: postProgress } = useScroll({ target: ref, offset: ["end end", "end start"] });
  const { lite } = usePerfMode();
  const [introComplete, setIntroComplete] = useState(() => heroBallIntroCompleted);
  const introCompleteRef = useRef(heroBallIntroCompleted);

  const completeHeroBallIntro = useCallback(() => {
    if (introCompleteRef.current) return;
    introCompleteRef.current = true;
    heroBallIntroCompleted = true;
    setIntroComplete(true);
  }, []);

  useEffect(() => {
    if (heroBallIntroCompleted || postProgress.get() >= HERO_BALL_CLEANUP_PROGRESS) {
      completeHeroBallIntro();
    }
  }, [completeHeroBallIntro, postProgress]);

  useMotionValueEvent(postProgress, "change", (latest) => {
    if (latest >= HERO_BALL_CLEANUP_PROGRESS) {
      completeHeroBallIntro();
    }
  });


  /* --- Rack focus: ball starts soft (background element), sharpens as
     it dollies toward camera. Text is dominant in the first frame. --- */
  const ballBlurPx = useTransform(scrollYProgress, [0.00, 0.20, 0.45], [4.5, 2, 0]);
  const ballBrightness = useTransform(scrollYProgress, [0.00, 0.45, 0.80], [0.78, 1.05, 1.15]);
  const ballContrast = useTransform(scrollYProgress, [0.00, 0.45, 0.80], [0.9, 1.05, 1.18]);
  const ballSaturate = useTransform(scrollYProgress, [0.00, 0.45], [0.9, 1.05]);
  const ballFilter = useMotionTemplate`blur(${ballBlurPx}px) brightness(${ballBrightness}) contrast(${ballContrast}) saturate(${ballSaturate})`;

  /* --- Continuous 3D path ---
     Ball begins BEHIND the headline at the top-left of the "D" in
     DOMINATE, sweeps left→right behind the type, then curves forward
     around the right edge and slides in FRONT of the D as it dollies
     toward camera. One single arc, no cuts. ArcX/Y are viewport units
     applied on top of the anchor at left-[22%] top-[22%]. */
  const ballArcX = useTransform(
    scrollYProgress,
    [0.00, 0.20, 0.40, 0.60, 0.78, 0.94],
    [0, 14, 32, 40, 22, 6],
  );
  const ballArcY = useTransform(
    scrollYProgress,
    [0.00, 0.20, 0.40, 0.60, 0.78, 0.94],
    [-8, 2, 10, 8, -6, -16],
  );
  const ballRotate = useTransform(scrollYProgress, [0.00, 0.94], [0, lite ? 360 : 620]);

  /* --- Depth-driven scale: slow crawl while behind text, accelerates
     as it comes forward, then fills the frame. --- */
  const ballScaleRaw = useTransform(
    scrollYProgress,
    [0.00, 0.25, 0.50, 0.70, 0.85, 0.94],
    [0.55, 0.75, 1.15, 2.4, 6.0, 13],
  );
  const ballScale = useSpring(ballScaleRaw, { stiffness: 90, damping: 22, mass: 0.6 });

  /* --- z-depth swap: ball is BEHIND text (z=10) for the first half of
     the arc, then steps to FRONT (z=30) once it curves around. Stepped
     so there is no half-in/half-out flicker on the type. --- */
  const ballZ = useTransform(scrollYProgress, (p) => (p < 0.55 ? 10 : 30));

  /* --- Subtle camera parallax (perspective / orbit) --- */
  const camRotX = useTransform(scrollYProgress, [0, 0.5, 1], [2, -1, -4]);
  const camRotY = useTransform(scrollYProgress, [0, 0.5, 1], [-3, 1, 5]);
  const camZ = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const camTransform = useMotionTemplate`perspective(1400px) rotateX(${camRotX}deg) rotateY(${camRotY}deg) translateZ(${camZ}px)`;
  const ballTransform = useMotionTemplate`translate(-50%, -50%) translate(${ballArcX}vw, ${ballArcY}vh) scale(${ballScale}) rotate(${ballRotate}deg)`;


  /* --- Text stays dominant early, softens only after the ball has
     clearly moved to the foreground. Then drifts up into About. --- */
  const heroTextBlur = useTransform(scrollYProgress, [0.35, 0.65, 0.9], [0, 2.2, 5]);
  const heroTextFilter = useMotionTemplate`blur(${heroTextBlur}px)`;
  const heroTextOpacityIn = useTransform(scrollYProgress, [0.00, 0.55, 0.9], [1, 0.9, 0.75]);
  const heroTextOpacityOut = useTransform(postProgress, [0, 0.55, 0.85], [0.75, 0.25, 0]);
  const heroTextOpacity = useTransform(
    [heroTextOpacityIn, heroTextOpacityOut, postProgress] as unknown as MotionValue<number>[],
    ([a, b, pp]: number[]) => (pp > 0 ? b : a),
  );

  const heroCopyYIn = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const heroCopyYOut = useTransform(postProgress, [0, 1], [0, -260]);
  const heroCopyY = useTransform(
    [heroCopyYIn, heroCopyYOut] as unknown as MotionValue<number>[],
    ([a, b]: number[]) => a + b,
  );

  /* --- Rim / floodlight warmth as the camera closes in --- */
  const hazeOpacity = useTransform(scrollYProgress, [0.00, 0.40, 0.95], [0.35, 0.55, 0.15]);

  /* --- Ball fades naturally as About takes over --- */
  const ballFadeOut = useTransform(postProgress, [0.10, 0.45], [1, 0]);

  /* --- Seamless section blend: a soft charcoal gradient at the bottom
     of the sticky frame that grows as we approach the boundary, so
     Hero dissolves into About with no visible edge. --- */
  const blendOpacity = useTransform(scrollYProgress, [0.6, 1], [0, 1]);



  return (
    <section ref={ref} id="top" className="relative h-[320vh] bg-jet">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Atmospheric background — soft charcoal vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 65% at 50% 55%, oklch(0.14 0.05 55 / 0.55), oklch(0.05 0 0) 72%)",
          }}
        />

        {/* Drifting haze / dust — subtle atmosphere */}
        <motion.div
          style={{ opacity: hazeOpacity }}
          className="pointer-events-none absolute inset-0"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 40% at 35% 45%, oklch(0.75 0.02 60 / 0.06), transparent 60%), radial-gradient(ellipse 50% 35% at 70% 60%, oklch(0.7 0.03 55 / 0.05), transparent 65%)",
              mixBlendMode: "screen",
            }}
          />
        </motion.div>
        <Embers count={18} />

        {/* Chapter tag */}
        <div className="absolute left-1/2 top-24 z-30 -translate-x-1/2">
          <div className="rounded-full glass px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.4em] text-titans">
            I · The First Delivery
          </div>
        </div>

        {/* Hero copy — sits BEHIND the ball. Stays alive across the
            boundary and drifts upward into the About section. */}
        <motion.div
          style={{
            opacity: heroTextOpacity,
            y: heroCopyY,
            filter: heroTextFilter,
          }}
          className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center will-change-transform"
        >
          <div className="mb-8 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.5em] text-foreground/60">
            <span className="h-px w-10 bg-titans/60" />
            Tezpur Titans
            <span className="h-px w-10 bg-titans/60" />
          </div>
          <h1 className="font-display text-fire leading-[0.84] tracking-[-0.02em]">
            <span className="block text-6xl font-light text-foreground/85 md:text-[7rem]">READY&nbsp;TO</span>
            <span className="block text-8xl md:text-[14rem]">DOMINATE</span>
          </h1>
          <p className="mt-10 max-w-xl text-[11px] font-semibold uppercase leading-relaxed tracking-[0.35em] text-foreground/55 md:text-xs">
            A new era of cricket.
            <br />
            A new era of Titans.
          </p>
          <div className="pointer-events-auto mt-12 flex items-center gap-3 rounded-full border border-titans/40 bg-titans/5 px-9 py-3.5 text-[11px] font-bold uppercase tracking-[0.4em] text-titans backdrop-blur">
            Scroll To Begin
            <ChevronDown className="h-3.5 w-3.5 animate-bounce" />
          </div>
        </motion.div>

        {/* Ball layer — single continuous instance. Starts BEHIND the
            headline (z=10) at the top-left of the "D", sweeps behind
            the type, then steps in FRONT (z=30) as it curves around and
            dollies to camera. Fades out along the same path. */}
        {!introComplete && (
          <motion.div
            data-hero-ball-root="true"
            style={{ transform: camTransform, zIndex: ballZ }}
            className="pointer-events-none fixed inset-0"
          >
            <div className="absolute left-[22%] top-[22%]">
              <motion.div
                style={{
                  opacity: ballFadeOut,
                  filter: ballFilter,
                  transform: ballTransform,
                }}
                className="will-change-transform"
              >
                <div
                  className="relative"
                  style={{
                    width: "clamp(160px, 14vw, 240px)",
                    height: "clamp(160px, 14vw, 240px)",
                  }}
                >
                  <img
                    src={ballImg}
                    alt="White professional cricket ball"
                    className="h-full w-full object-contain"
                    width={512}
                    height={512}
                    style={{
                      filter: "drop-shadow(0 30px 34px oklch(0 0 0 / 0.55))",
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}


        {/* Seamless blend into About — soft gradient dissolves the
            bottom edge of the Hero into the next section. */}
        <motion.div
          style={{ opacity: blendOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-[55vh]"
        >
          <div
            className="h-full w-full"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, oklch(0.06 0.003 60 / 0.55) 55%, oklch(0.06 0.003 60) 100%)",
            }}
          />
        </motion.div>

      </div>
    </section>
  );
}

/* ================================================================
   SECTION 02 — ABOUT US · "The Identity of a Titan"
   Cinematic scroll-driven helmet transition. Helmet enters from the
   left, orbits with 360° spin toward center, dollies forward until
   it fills the frame, then softly fades revealing the About copy.
================================================================ */
function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const { lite } = usePerfMode();

  // Resting state at scroll=0: helmet parked on the LEFT, slightly above
  // vertical center, fully visible and completely still. Motion is 100%
  // scroll-driven — no autoplay, no idle animation.
  const helmetX = useTransform(scrollYProgress, [0, 0.4, 0.65, 0.9], ["-32vw", "-10vw", "0vw", "0vw"]);
  const helmetY = useTransform(scrollYProgress, [0, 0.4, 0.7, 0.9], ["-8vh", "-2vh", "4vh", "6vh"]);
  // Z: backward first (side reveal), then forward push-in toward the camera
  const helmetZ = useTransform(scrollYProgress, [0, 0.25, 0.6, 0.9], [0, -160, 60, 320]);
  const helmetScale = useTransform(scrollYProgress, [0, 0.4, 0.65, 0.85, 0.95], [0.95, 1.1, 1.4, 2.8, 5.6]);
  // 360° spin begins only as the user scrolls; stabilises near center
  const helmetRot = useTransform(scrollYProgress, [0, 0.7, 0.9], [0, lite ? 180 : 360, lite ? 180 : 360]);
  const helmetTilt = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0, -4]);
  // Fully visible at rest; only fades at the very end after full-frame push-in
  const helmetOpacity = useTransform(scrollYProgress, [0, 0.9, 0.98], [1, 1, 0]);
  const helmetTransform = useMotionTemplate`perspective(1600px) translate3d(${helmetX}, ${helmetY}, ${helmetZ}px) rotateX(${helmetTilt}deg) rotateY(${helmetRot}deg) scale(${helmetScale})`;

  // Rim light intensifies at hero-center moment (subtle & stable at rest)
  const rimIntensity = useTransform(scrollYProgress, [0, 0.4, 0.65, 0.9], [0.15, 0.25, 0.7, 0.15]);

  // Content: hidden behind helmet, resolves as helmet centers, holds
  const copyOpacity = useTransform(scrollYProgress, [0.3, 0.55, 0.82, 0.95], [0, 1, 1, 0.9]);
  const copyBlur = useTransform(scrollYProgress, [0.3, 0.55], [10, 0]);
  const copyFilter = useMotionTemplate`blur(${copyBlur}px)`;
  const copyX = useTransform(scrollYProgress, [0.3, 0.6], [60, 0]);

  return (
    <section id="about" ref={ref} className="relative h-[280vh] bg-jet">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div
          className="absolute inset-0 opacity-80"
          style={{
            background:
              "radial-gradient(ellipse at 30% 50%, oklch(0.72 0.19 55 / 0.18), transparent 55%), radial-gradient(ellipse at 80% 30%, oklch(0.55 0.22 32 / 0.12), transparent 60%)",
          }}
        />
        <motion.div
          style={{ opacity: rimIntensity }}
          className="pointer-events-none absolute inset-0"
          aria-hidden
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 40% 30% at 50% 50%, oklch(0.72 0.19 55 / 0.35), transparent 65%)",
              mixBlendMode: "screen",
            }}
          />
        </motion.div>
        <Embers count={22} />

        <div className="relative mx-auto grid h-full w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
          {/* Copy — revealed as helmet reaches center */}
          <motion.div
            style={{ opacity: copyOpacity, x: copyX, filter: copyFilter }}
            className="relative order-2 lg:order-2 lg:col-start-2"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.4em] text-titans">
              II · The Identity of a Titan
            </span>
            <h2 className="mt-3 font-display text-5xl leading-[0.9] md:text-7xl">
              Forged in <span className="text-fire">Assam.</span>
              <br />
              Built for the World.
            </h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-foreground/70">
              Tezpur Titans are more than a franchise. We are a promise — that the North East will no
              longer sit at the edge of the game, but at its centre. Every stitch, every strike,
              every roar carries the weight of a region that has waited a long time to be heard.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { icon: Target, label: "Mission", body: "Take Assam's fearless spirit to every corner of world cricket." },
                { icon: Eye, label: "Vision", body: "A generation of North East cricketers on the global stage by 2035." },
                { icon: Flame, label: "Values", body: "Fearless · Rooted · Together · Relentless." },
              ].map((v) => (
                <div key={v.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur">
                  <v.icon className="h-5 w-5 text-titans" />
                  <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-titans">
                    {v.label}
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-foreground/70">{v.body}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Helmet — cinematic camera track. Fixed to viewport so scale
            can fill the frame without being clipped. */}
        <motion.div
          style={{ opacity: helmetOpacity, transform: helmetTransform }}
          className="pointer-events-none absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 will-change-transform"
          aria-hidden
        >
          <div className="relative" style={{ width: "clamp(260px, 34vw, 560px)", height: "clamp(260px, 34vw, 560px)" }}>
            <div className="absolute -inset-10 rounded-full bg-titans/25 blur-3xl" />
            <img
              src={helmetImg}
              alt=""
              loading="lazy"
              width={1280}
              height={1280}
              className="relative h-full w-full object-contain drop-shadow-[0_40px_100px_oklch(0.72_0.19_55/0.4)]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ================================================================
   SECTION 05 — JOIN THE TITANS · "Write The Next Chapter"
================================================================ */
function JoinSection() {
  const btnRef = useRef<HTMLAnchorElement>(null);
  const [mag, setMag] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.2, 1]);

  const onMove = (e: React.MouseEvent) => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * 0.25;
    const y = (e.clientY - (r.top + r.height / 2)) * 0.25;
    setMag({ x, y });
  };

  return (
    <section id="join" ref={ref} className="relative min-h-screen overflow-hidden bg-jet" onMouseMove={onMove} onMouseLeave={() => setMag({ x: 0, y: 0 })}>
      <motion.div style={{ scale: bgScale }} className="absolute inset-0">
        <img src={crowdImg} alt="" loading="lazy" className="h-full w-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-b from-jet/40 via-jet/70 to-jet" />
      </motion.div>
      <StadiumLights />
      <Embers count={40} />

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-24 text-center">
        <span className="font-mono text-[11px] uppercase tracking-[0.4em] text-titans">
          V · Write The Next Chapter
        </span>
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mt-6 font-display text-6xl leading-[0.9] text-fire md:text-[10rem]"
        >
          Join The
          <br />
          Titans.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-6 max-w-xl text-lg text-foreground/70"
        >
          The stadium is lit. The city is waiting. The season begins with you in the stands — and
          your name in the chant.
        </motion.p>
        <motion.a
          ref={btnRef}
          href="#contact"
          animate={{ x: mag.x, y: mag.y }}
          transition={{ type: "spring", stiffness: 180, damping: 15 }}
          className="mt-12 group relative inline-flex items-center gap-3 rounded-full bg-titans px-12 py-6 font-display text-2xl uppercase tracking-[0.25em] text-jet animate-pulse-glow"
        >
          Become A Titan
          <ArrowRight className="h-6 w-6 transition group-hover:translate-x-1" />
        </motion.a>
        <div className="mt-16 flex items-center gap-6 text-foreground/60">
          {[Instagram, Twitter, Youtube, Facebook].map((I, i) => (
            <a key={i} href="#" className="rounded-full border border-white/10 p-3 transition hover:border-titans hover:text-titans">
              <I className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   SECTION 07 — FOOTER · "The Legacy Continues"
================================================================ */
function FooterSection() {
  return (
    <footer className="relative overflow-hidden bg-jet">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-titans/15 to-transparent blur-3xl" />
      <StadiumLights />
      <div className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <img src={LOGO_URL} alt="Tezpur Titans" width={44} height={44} className="h-11 w-11 object-contain drop-shadow-[0_0_16px_oklch(0.72_0.19_55/0.6)]" />
              <div className="font-display text-xl leading-none tracking-wider">
                TEZPUR <span className="text-titans">TITANS</span>
              </div>
            </div>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-foreground/60">
              Assam's fearless T20 franchise. One team. One dream. Built for the fearless — powered
              by the roar.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[Instagram, Twitter, Youtube, Facebook].map((I, i) => (
                <a key={i} href="#" className="rounded-full border border-white/10 p-2.5 text-foreground/60 transition hover:border-titans hover:text-titans">
                  <I className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="Explore" links={[["Home", "#top"], ["About Us", "#about"]]} />
          <FooterCol title="Community" links={[["Join The Titans", "#join"]]} />
          <FooterCol title="Reach" links={[["hello@tezpurtitans.in", "mailto:hello@tezpurtitans.in"], ["+91 361 000 0000", "tel:+913610000000"]]} />
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/50">
            © 2026 Tezpur Titans · Assam, India
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40">
            The legacy continues.
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-titans">{title}</div>
      <ul className="mt-5 space-y-3">
        {links.map(([label, href]) => (
          <li key={label}>
            <a href={href} className="group inline-flex items-center gap-1.5 text-sm text-foreground/70 transition hover:text-titans">
              {label}
              <ArrowRight className="h-3 w-3 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- Scroll progress ---------------- */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scale = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <motion.div
      style={{ scaleX: scale }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-titans via-gold to-titans"
    />
  );
}

/* ---------------- Chapter Rail (right side) ---------------- */
const CHAPTERS: { id: string; label: string }[] = [
  { id: "top", label: "Hero" },
  { id: "about", label: "About Us" },
  { id: "join", label: "Join The Titans" },
  { id: "footer", label: "Legacy" },
];

function ChapterRail() {
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll();
  const trackY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    const els = CHAPTERS
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => !!el);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const idx = CHAPTERS.findIndex((c) => c.id === visible[0].target.id);
          if (idx >= 0) setActive(idx);
        }
      },
      { threshold: [0.25, 0.5, 0.75], rootMargin: "-30% 0px -30% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const onJump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="Chapters"
      className="pointer-events-none fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 md:block"
    >
      <div className="pointer-events-auto relative flex flex-col items-center gap-4 rounded-full border border-white/10 bg-jet/40 px-2 py-5 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-y-5 left-1/2 w-px -translate-x-1/2 overflow-hidden rounded-full bg-white/10">
          <motion.div
            style={{ scaleY: trackY, transformOrigin: "top" }}
            className="h-full w-full bg-gradient-to-b from-titans via-gold to-titans"
          />
        </div>

        {CHAPTERS.map((c, i) => {
          const isActive = i === active;
          return (
            <button
              key={c.id}
              onClick={() => onJump(c.id)}
              aria-label={`Go to chapter ${i + 1}: ${c.label}`}
              className="group relative flex items-center"
            >
              <span
                className={`absolute right-full mr-3 whitespace-nowrap rounded-full border border-white/10 bg-jet/80 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.28em] text-titans opacity-0 backdrop-blur transition group-hover:translate-x-0 group-hover:opacity-100 ${
                  isActive ? "translate-x-0" : "translate-x-2"
                }`}
              >
                {c.label}
              </span>
              <motion.span
                animate={{
                  scale: isActive ? 1.25 : 1,
                  color: isActive ? "oklch(0.72 0.19 55)" : "oklch(0.75 0 0 / 0.55)",
                }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full font-mono text-[11px] font-bold tabular-nums"
                style={{
                  textShadow: isActive ? "0 0 18px oklch(0.72 0.19 55 / 0.9)" : "none",
                  background: isActive
                    ? "radial-gradient(circle, oklch(0.72 0.19 55 / 0.22), transparent 70%)"
                    : "transparent",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </motion.span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/* ---------------- ROOT ---------------- */
function TitansLanding() {
  const { lite } = usePerfMode();
  useLenis(!lite);

  return (
    <main className="relative bg-jet text-foreground">
      <ScrollProgress />
      <Nav />
      <ChapterRail />
      <HeroCinematic />
      <AboutSection />
      <JoinSection />
      <div id="footer">
        <FooterSection />
      </div>
    </main>
  );
}

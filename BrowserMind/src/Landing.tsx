import React, { useState, useEffect } from "react";

type Result = {
  global_score: number;
  local_score: number;
  final_score: number;
  top_reasons: { feature: string; reason: string }[];
  tips: string[];
};

const mockAnalyze = async (): Promise<Result> => {
  await new Promise((r) => setTimeout(r, 1600));
  return {
    global_score: 78,
    local_score: 62,
    final_score: 71,
    top_reasons: [
      { feature: "webgl_vendor", reason: "Distinctive GPU/WebGL" },
      { feature: "fontsCount", reason: "Unusual number of fonts" }
    ],
    tips: ["Enable WebGL masking", "Limit remote fonts in browser settings"]
  };
};

// simple letter-by-letter reveal for "Mind"
const RevealWord = ({ word, delay = 0.6 }: { word: string; delay?: number }) => (
  <span className="inline-flex">
    {word.split("").map((ch, i) => (
      <span
        key={i}
        className="letter-pop"
        style={{ animationDelay: `${delay + i * 0.12}s` }}
      >
        {ch}
      </span>
    ))}
  </span>
);

const BgMagnifiers = () => (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* A */}
      <div className="realMag magA">
        <div className="magWrap">
          <MagnifierSVG size={380} />
          <div className="scanLight scanA" />
        </div>
      </div>
      {/* B */}
      <div className="realMag magB">
        <div className="magWrap">
          <MagnifierSVG size={300} />
          <div className="scanLight scanB" />
        </div>
      </div>
      {/* C */}
      <div className="realMag magC">
        <div className="magWrap">
          <MagnifierSVG size={440} />
          <div className="scanLight scanC" />
        </div>
      </div>
    </div>
  );
  
// realistic magnifier SVG (lens + metallic rim + handle)
const MagnifierSVG = ({ size = 340 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="glass" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.28)" />
        <stop offset="70%" stopColor="rgba(255,255,255,0.08)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
      </radialGradient>
      <linearGradient id="rim" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#bcbcbc" />
        <stop offset="100%" stopColor="#6b6b6b" />
      </linearGradient>
    </defs>

    {/* rim */}
    <circle cx="90" cy="90" r="60" stroke="url(#rim)" strokeWidth="6" fill="none" />
    {/* glass */}
    <circle cx="90" cy="90" r="55" fill="url(#glass)" />
    {/* glare highlight */}
    <ellipse cx="72" cy="68" rx="18" ry="8" fill="white" opacity="0.18" />

    {/* handle */}
    <g transform="rotate(38 90 90)">
      <rect x="130" y="86" width="70" height="12" rx="6" fill="url(#rim)" />
      <rect x="198" y="86" width="14" height="12" rx="6" fill="#555" />
    </g>
  </svg>
);
export default function Landing() {
  const [phase, setPhase] = useState<"idle" | "loading" | "done">("idle");
  const [pct, setPct] = useState(0);
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    let id: number | undefined;
    if (phase === "loading") {
      const start = Date.now();
      id = window.setInterval(() => {
        const t = Date.now() - start;
        const p = Math.min(95, Math.round((t / 1400) * 100));
        setPct(p);
      }, 90);
    }
    return () => clearInterval(id);
  }, [phase]);

  const handleClick = async () => {
    setResult(null);
    setPct(0);
    setPhase("loading");
    const data = await mockAnalyze();
    setPct(100);
    setTimeout(() => {
      setResult(data);
      setPhase("done");
    }, 250);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
      {/* animated color wash + grain */}
      <div className="absolute inset-0 animated-gradient opacity-30 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_35%,rgba(168,85,247,0.25)_0%,rgba(0,0,0,0)_70%)]" />
      <div className="noise" />

      {/* floating magnifiers */}
      <BgMagnifiers />

      {/* content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
        {/* title with staggered reveal */}
        <h1 className="text-center font-semibold tracking-tight">
          <span className="block text-5xl md:text-6xl">
            <span className="title-instant">Browser</span>{" "}
            <RevealWord word="Mind" />
          </span>
          <span className="block text-lg md:text-2xl text-white/70 mt-3 subtitle-fade">
            Check how unique your browser is — in one click.
          </span>
        </h1>

        {/* CTA / content */}
        <div className="mt-10 w-full max-w-xl">
          {phase === "idle" && (
            <div className="flex justify-center">
              <button
                onClick={handleClick}
                className="group relative inline-flex items-center gap-3 rounded-2xl bg-white/5 px-8 py-4 text-lg font-medium backdrop-blur-xl ring-1 ring-white/15 hover:ring-white/25 transition
                           shadow-[0_0_30px_-10px_rgba(139,92,246,0.8)]
                           hover:shadow-[0_0_45px_-10px_rgba(139,92,246,1)]
                           before:absolute before:-inset-0.5 before:-z-10 before:rounded-2xl before:bg-gradient-to-r before:from-fuchsia-500/40 before:via-sky-400/40 before:to-emerald-400/40 before:blur-lg before:opacity-60 before:transition group-hover:before:opacity-90"
              >
                <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
                Get My Privacy Score
              </button>
            </div>
          )}

          {phase === "loading" && (
            <div className="rounded-2xl bg-white/5 p-6 backdrop-blur-xl ring-1 ring-white/10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-white/80">Analyzing your browser…</p>
                <p className="text-white/60 text-sm">{pct}%</p>
              </div>
              <div className="relative h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-fuchsia-400 via-sky-400 to-emerald-400 transition-[width] duration-200 ease-out"
                  style={{ width: `${pct}%` }}
                />
                <div className="absolute inset-y-0 -left-20 w-20 bg-white/30 blur-md animate-[shimmer_1.3s_linear_infinite]" />
              </div>
            </div>
          )}

          {phase === "done" && result && (
            <div className="rounded-2xl bg-white/5 p-6 backdrop-blur-xl ring-1 ring-white/10">
              <div className="grid md:grid-cols-3 gap-4">
                <ScoreCard label="Global" value={result.global_score} />
                <ScoreCard label="Local" value={result.local_score} />
                <ScoreCard label="Overall" value={result.final_score} />
              </div>

              <div className="mt-6 grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-white/90 font-medium mb-2">Top Reasons</h3>
                  <ul className="space-y-2">
                    {result.top_reasons.map((r, i) => (
                      <li key={i} className="text-white/70">
                        • <b className="text-white/90">{r.feature}</b> — {r.reason}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-white/90 font-medium mb-2">Tips to Improve</h3>
                  <ul className="space-y-2">
                    {result.tips.map((t, i) => (
                      <li key={i} className="text-white/80">• {t}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => setPhase("idle")}
                  className="text-sm text-white/70 hover:text-white transition underline underline-offset-4"
                >
                  Check again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_100%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.6)_100%)]" />

      {/* keyframes (scoped) */}
      <style>{`
        .title-instant { 
          opacity: 0; transform: translateY(8px); 
          animation: fadeUp 600ms ease forwards; 
          animation-delay: .1s;
        }
        .subtitle-fade {
          opacity: 0; transform: translateY(6px);
          animation: fadeUp 600ms ease forwards;
          animation-delay: 1.4s;
        }
        .letter-pop {
          opacity: 0; transform: translateY(10px) scale(.98);
          animation: popIn .45s cubic-bezier(.2,.7,.2,1) forwards;
        }
        @keyframes popIn {
          0% { opacity: 0; transform: translateY(10px) scale(.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        /* floating magnifiers */
        .mag { position: absolute; filter: blur(.5px); }
        .mag-1 { top: -10vh; left: -15vw; animation: drift1 32s ease-in-out infinite alternate; }
        .mag-2 { bottom: -12vh; right: -20vw; animation: drift2 36s ease-in-out infinite alternate; }
        @keyframes drift1 {
          0%   { transform: translate(0,0) rotate(0deg) scale(1); }
          50%  { transform: translate(35vw, 18vh) rotate(8deg) scale(1.05); }
          100% { transform: translate(10vw, 35vh) rotate(14deg) scale(1.08); }
        }
        @keyframes drift2 {
          0%   { transform: translate(0,0) rotate(0deg) scale(1); }
          50%  { transform: translate(-30vw, -12vh) rotate(-6deg) scale(.95); }
          100% { transform: translate(-5vw, -28vh) rotate(-12deg) scale(.9); }
        }
        @keyframes shimmer { 
          0% { transform: translateX(0%); } 
          100% { transform: translateX(120%); } 
        }
      `}</style>
    </div>
  );
}

function ScoreCard({ label, value }: { label: string; value: number }) {
  const color =
    value >= 71
      ? "from-emerald-400 to-teal-300"
      : value >= 41
      ? "from-amber-400 to-yellow-300"
      : "from-rose-500 to-pink-400";

  return (
    <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
      <p className="text-white/70 text-sm mb-2">{label} score</p>
      <div className="flex items-center gap-4">
        <div className={`text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r ${color}`}>
          {value}
        </div>
        <div className="h-2 flex-1 rounded-full bg-white/10 overflow-hidden">
          <div
            className={`h-2 rounded-full bg-gradient-to-r ${color}`}
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
    </div>
  );
}

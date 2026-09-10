import React, { useEffect, useRef, useState } from "react";
import { ArrowDownRight } from "lucide-react";

const ROLE_LINES = [
  "builds software for cooperatives managing shared money.",
  "ships full-stack systems in React, Django, and Flutter.",
  "is wiring blockchain payments into everyday finance.",
  "is training to turn code into a company.",
];

const STACK = ["React", "Django", "PostgreSQL", "Flutter", "Solidity", "Web3.py", "Supabase", "Tailwind", "Python", "Java"];

const STATS = [
  { value: "3", label: "platforms shipped\n(web, mobile, chain)" },
  { value: "10", label: "tools in my\ncore stack" },
  { value: "2027", label: "graduating,\nopen to work" },
];

function useTypedLines(lines, typingSpeed = 42, pauseMs = 1400, deleteSpeed = 22) {
  const [text, setText] = useState("");
  const indexRef = useRef(0);
  const charRef = useRef(0);
  const phaseRef = useRef("typing");

  useEffect(() => {
    let timeoutId;
    const tick = () => {
      const current = lines[indexRef.current % lines.length];
      if (phaseRef.current === "typing") {
        charRef.current += 1;
        setText(current.slice(0, charRef.current));
        if (charRef.current >= current.length) {
          phaseRef.current = "pausing";
          timeoutId = setTimeout(tick, pauseMs);
          return;
        }
        timeoutId = setTimeout(tick, typingSpeed);
        return;
      }
      if (phaseRef.current === "pausing") {
        phaseRef.current = "deleting";
        timeoutId = setTimeout(tick, deleteSpeed);
        return;
      }
      if (phaseRef.current === "deleting") {
        charRef.current -= 1;
        setText(current.slice(0, charRef.current));
        if (charRef.current <= 0) {
          indexRef.current += 1;
          phaseRef.current = "typing";
          timeoutId = setTimeout(tick, typingSpeed);
          return;
        }
        timeoutId = setTimeout(tick, deleteSpeed);
      }
    };
    timeoutId = setTimeout(tick, typingSpeed);
    return () => clearTimeout(timeoutId);
  }, [lines, typingSpeed, pauseMs, deleteSpeed]);

  return text;
}

export default function Hero({ colors, loaded }) {
  const typed = useTypedLines(ROLE_LINES);

  return (
    <section id="home" style={{ padding: "8vh 6vw 0" }}>
      <div
        data-cursor-hover
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          border: `1px solid ${colors.line}`,
          borderRadius: 999,
          padding: "6px 14px",
          fontSize: 12,
          color: colors.lime,
          marginBottom: 26,
          animation: loaded ? "jd-rise 0.6s ease both" : "none",
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: colors.lime, animation: "jd-pulse 2s ease infinite" }} />
        open to part-time, full-time & freelance &middot; remote
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "4vw", alignItems: "center" }}>
        <div style={{ animation: loaded ? "jd-rise 0.7s ease 0.1s both" : "none" }}>
          <p style={{ color: colors.amber, fontSize: 13, letterSpacing: 0.4, margin: "0 0 16px" }}>
            Lucena City, Quezon &middot; Philippines
          </p>
          <h1
            className="jd-serif"
            style={{
              fontSize: "clamp(2.6rem, 5.4vw, 4.6rem)",
              lineHeight: 1.06,
              margin: "0 0 22px",
              fontWeight: 480,
              maxWidth: 660,
              minHeight: "4.5em",
            }}
          >
            Junelle Dinglasan{" "}
            <span style={{ color: colors.lime }}>
              {typed}
              <span style={{ opacity: 0.6 }}>|</span>
            </span>
          </h1>
          <p style={{ color: colors.textMuted, fontSize: 15, lineHeight: 1.75, maxWidth: 480, margin: "0 0 30px" }}>
            Full-stack developer working across React, Django, Flutter, and a
            bit of blockchain. My capstone &mdash; a payments and loan system
            for a real agricultural cooperative &mdash; is the biggest thing
            I've built so far, but I'm always exploring other small projects
            on the side and picking up new tools as I go.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 40 }}>
            <a
              href="#work"
              data-cursor-hover
              className="jd-btn"
              style={{
                background: colors.lime,
                color: colors.bg,
                border: "none",
                padding: "13px 22px",
                borderRadius: 2,
                fontFamily: "'Space Mono', monospace",
                fontSize: 13,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 8,
                textDecoration: "none",
              }}
            >
              See the work <ArrowDownRight size={15} />
            </a>
            <a
              href="#contact"
              data-cursor-hover
              className="jd-btn"
              style={{
                background: "transparent",
                color: colors.text,
                border: `1px solid ${colors.line}`,
                padding: "13px 22px",
                borderRadius: 2,
                fontFamily: "'Space Mono', monospace",
                fontSize: 13,
                textDecoration: "none",
              }}
            >
              Get in touch
            </a>
          </div>

          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            {STATS.map((s) => (
              <div key={s.value}>
                <p className="jd-serif" style={{ fontSize: 30, color: colors.amber, margin: "0 0 4px", fontWeight: 600 }}>
                  {s.value}
                </p>
                <p style={{ fontSize: 11, color: colors.textMuted, whiteSpace: "pre-line", lineHeight: 1.5, margin: 0 }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: "relative", height: 440 }}>
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: -40,
              background: `radial-gradient(circle at 60% 40%, ${colors.lime}22, transparent 60%)`,
              pointerEvents: "none",
            }}
          />
          <svg viewBox="0 0 320 420" width="100%" height="100%" role="img" aria-label="Abstract ledger network illustration" style={{ position: "relative" }}>
            <g stroke={colors.line} strokeWidth="1" fill="none">
              <line x1="20" y1="40" x2="20" y2="380" />
              <line x1="20" y1="40" x2="300" y2="40" />
              {[80, 130, 180, 230, 280, 330].map((y) => (
                <line key={y} x1="20" y1={y} x2="300" y2={y} opacity="0.5" />
              ))}
            </g>
            <g
              className="jd-draw-line"
              style={{
                strokeDasharray: 480,
                animation: loaded ? "jd-draw 1.6s ease forwards 0.3s" : "none",
                opacity: loaded ? undefined : 0,
              }}
              stroke={colors.lime}
              strokeWidth="1.8"
              fill="none"
            >
              <path d="M40,330 L110,220 L160,260 L210,110 L280,70" />
            </g>
            {[
              [40, 330],
              [110, 220],
              [160, 260],
              [210, 110],
              [280, 70],
            ].map(([cx, cy], i) => (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={i === 4 ? 8 : 5.5}
                fill={i === 4 ? colors.amber : colors.lime}
                style={{ opacity: loaded ? 1 : 0, transition: `opacity 0.4s ease ${0.4 + i * 0.18}s` }}
              />
            ))}
            <text x="230" y="60" fill={colors.amber} fontSize="10" fontFamily="'Space Mono', monospace">
              deployed
            </text>
            <g stroke={colors.lime} strokeWidth="1" opacity="0.5">
              <circle cx="280" cy="70" r="16" fill="none" style={{ animation: loaded ? "jd-pulse 2.4s ease infinite" : "none" }} />
            </g>
          </svg>
        </div>
      </div>

      <div style={{ marginTop: 70, borderTop: `1px solid ${colors.line}`, borderBottom: `1px solid ${colors.line}`, padding: "24px 0" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
          {STACK.map((tech, i) => (
            <span
              key={i}
              data-cursor-hover
              className="jd-chip"
              style={{
                border: `1px solid ${colors.line}`,
                borderRadius: 999,
                padding: "9px 20px",
                fontSize: 12.5,
                fontWeight: 700,
                color: colors.lime,
                display: "flex",
                alignItems: "center",
                gap: 8,
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: colors.lime, flexShrink: 0 }} />
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div style={{ height: "6vh" }} />
    </section>
  );
}
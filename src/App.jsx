import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { PALETTE } from "./palette";
import Hero from "./components/Hero";
import About from "./components/About";
import Work from "./components/Work";
import Contact from "./components/Contact";

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "contact", label: "Contact" },
];

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const height = (doc.scrollHeight || 0) - window.innerHeight;
      setProgress(height > 0 ? Math.min(100, (scrollTop / height) * 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return progress;
}

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

function useCustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const isFine = window.matchMedia && window.matchMedia("(pointer: fine)").matches;
    setEnabled(Boolean(isFine));
    if (!isFine) return;
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    const overCheck = (e) => {
      const el = e.target;
      setHovering(Boolean(el.closest && el.closest("[data-cursor-hover]")));
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", overCheck);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", overCheck);
    };
  }, []);

  return { pos, hovering, enabled };
}

export default function App() {
  const [mode, setMode] = useState("dark");
  const colors = PALETTE[mode];
  const progress = useScrollProgress();
  const cursor = useCustomCursor();
  const active = useActiveSection(NAV_ITEMS.map((n) => n.id));
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 120);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        background: colors.bg,
        backgroundImage: `radial-gradient(${colors.dot} 1px, transparent 1px)`,
        backgroundSize: "26px 26px",
        color: colors.text,
        minHeight: "100vh",
        fontFamily: "'Space Mono', ui-monospace, monospace",
        position: "relative",
        overflowX: "hidden",
        cursor: cursor.enabled ? "none" : "auto",
        transition: "background 0.4s ease, color 0.4s ease",
      }}
    >
      {cursor.enabled && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            left: cursor.pos.x,
            top: cursor.pos.y,
            width: cursor.hovering ? 36 : 10,
            height: cursor.hovering ? 36 : 10,
            marginLeft: cursor.hovering ? -18 : -5,
            marginTop: cursor.hovering ? -18 : -5,
            borderRadius: "50%",
            border: `1px solid ${colors.lime}`,
            background: cursor.hovering ? "transparent" : colors.lime,
            boxShadow: cursor.hovering ? "none" : `0 0 14px ${colors.lime}88`,
            pointerEvents: "none",
            zIndex: 100,
            transition: "width 0.18s ease, height 0.18s ease, margin 0.18s ease, background 0.18s ease",
          }}
        />
      )}

      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: 3,
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${colors.lime}, ${colors.amber})`,
          zIndex: 90,
          transition: "width 0.1s linear",
        }}
      />

      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "22px 6vw",
          background: `${colors.bg}CC`,
          backdropFilter: "blur(6px)",
          borderBottom: `1px solid ${colors.line}`,
        }}
      >
        <nav style={{ display: "flex", gap: 28, alignItems: "center", fontSize: 13 }}>
          {NAV_ITEMS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              data-cursor-hover
              className="jd-link"
              style={{
                color: active === id ? colors.lime : colors.textMuted,
                textDecoration: "none",
              }}
            >
              {label}
            </a>
          ))}
          <button
            data-cursor-hover
            onClick={() => setMode(mode === "dark" ? "light" : "dark")}
            aria-label="Toggle dark and light mode"
            className="jd-btn"
            style={{
              border: `1px solid ${colors.line}`,
              background: "transparent",
              color: colors.text,
              width: 34,
              height: 34,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {mode === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </nav>
      </header>

      <main>
        <Hero colors={colors} loaded={loaded} />
        <About colors={colors} mode={mode} loaded={loaded} />
        <Work colors={colors} loaded={loaded} />
        <Contact colors={colors} loaded={loaded} />
      </main>
    </div>
  );
}
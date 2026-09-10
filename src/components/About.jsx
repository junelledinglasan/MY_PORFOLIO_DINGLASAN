import React from "react";
import { School, Code2, Database, Wallet, Wrench } from "lucide-react";
import profileImg from "../assets/profile.png";

const SKILL_GROUPS = [
  { icon: Code2, label: "Frontend", items: ["React", "Flutter", "Tailwind CSS", "Vite"] },
  { icon: Database, label: "Backend & data", items: ["Django REST", "PostgreSQL", "Supabase"] },
  { icon: Wallet, label: "Blockchain", items: ["Solidity", "Web3.py", "MetaMask", "Polygon"] },
  { icon: Wrench, label: "Tools & flow", items: ["Git", "Android Studio", "Agile Scrum", "Figma"] },
];

export default function About({ colors, mode, loaded }) {
  return (
    <section id="about" style={{ padding: "7vh 6vw" }}>
      <div style={{ display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: "4vw", alignItems: "start" }}>
        <div style={{ position: "relative", animation: loaded ? "jd-rise 0.7s ease both" : "none" }}>
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 18,
              left: 18,
              right: -18,
              bottom: -18,
              border: `1px solid ${colors.line}`,
              zIndex: 0,
            }}
          />
          <div
            style={{
              position: "relative",
              background: colors.surface,
              border: `1px solid ${colors.line}`,
              padding: 18,
              zIndex: 1,
            }}
          >
            <img
              src={profileImg}
              alt="Junelle Dinglasan"
              style={{
                width: "100%",
                display: "block",
                objectFit: "cover",
                filter: mode === "dark" ? "contrast(1.02)" : "none",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 14,
                fontSize: 11,
                color: colors.textMuted,
              }}
            >
              <span>Lucena City, Quezon</span>
              <span style={{ color: colors.amber }}>est. 2027</span>
            </div>
          </div>
        </div>

        <div style={{ animation: loaded ? "jd-rise 0.7s ease 0.12s both" : "none" }}>
          <p style={{ color: colors.amber, fontSize: 13, letterSpacing: 0.4, margin: "0 0 12px" }}>
            About me
          </p>
          <h2
            className="jd-serif"
            style={{
              fontSize: "clamp(2rem, 3.6vw, 3rem)",
              lineHeight: 1.15,
              margin: "0 0 18px",
              fontWeight: 480,
              maxWidth: 560,
            }}
          >
            I like software that people actually rely on, not just demos.
          </h2>
          <p style={{ color: colors.textMuted, fontSize: 15, lineHeight: 1.7, maxWidth: 560, margin: "0 0 14px" }}>
            I'm an IT student in Lucena City, finishing a BSIT degree at the
            Dalubhasaan ng Lungsod ng Lucena, graduating in 2027. Most of my
            time these days goes into a capstone project that runs a real
            agricultural cooperative &mdash; member records, loans, and
            payments &mdash; across a React web app, a Flutter mobile app, and
            a Django backend, with a Polygon smart contract handling part of
            the payment flow.
          </p>
          <p style={{ color: colors.textMuted, fontSize: 15, lineHeight: 1.7, maxWidth: 560, margin: "0 0 22px" }}>
            The capstone isn't the only thing I work on &mdash; I like picking
            up new tools and trying things outside of it too. I'm also taking
            Technopreneurship classes, which got me thinking beyond just
            building features, and more about how a system like this could
            work as an actual business. Right now I'm also exploring other
            small projects I could build on my own, and I'm always open to
            learning new things that help me grow, whether that's a new
            framework, tool, or skill.
          </p>
          <p style={{ color: colors.textMuted, fontSize: 15, lineHeight: 1.7, maxWidth: 560, margin: "0 0 22px" }}>
            Outside of coding, I'm usually watching a drama, playing Mobile
            Legends, or coding with music on so I don't get bored. I got into
            building software out of curiosity &mdash; wanting to know if I
            could actually put together a working system on my own &mdash;
            and I stuck with it because finishing something you set out to
            build feels genuinely rewarding, even when it takes patience. I
            wouldn't call myself a pro yet; I'm still learning a lot, mostly
            by exploring as I go, the same way I picked things up while
            building the capstone piece by piece. I'm chatty over text, but
            pretty quiet in person &mdash; and when I'm working, I like it
            quiet too. No noise, just focus.
          </p>

          <div
            className="jd-card"
            style={{
              display: "flex",
              gap: 14,
              alignItems: "flex-start",
              border: `1px solid ${colors.line}`,
              padding: "16px 18px",
              marginBottom: 28,
              maxWidth: 560,
            }}
          >
            <School size={18} color={colors.lime} style={{ marginTop: 2, flexShrink: 0 }} />
            <div>
              <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700 }}>
                BSIT &mdash; Dalubhasaan ng Lungsod ng Lucena
              </p>
              <p style={{ margin: 0, fontSize: 13, color: colors.textMuted }}>
                Expected graduation, 2027
              </p>
            </div>
          </div>

          <p style={{ color: colors.amber, fontSize: 13, letterSpacing: 0.4, margin: "0 0 14px" }}>
            What I work with
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {SKILL_GROUPS.map(({ icon: Icon, label, items }) => (
              <div
                key={label}
                className="jd-card"
                style={{
                  border: `1px solid ${colors.line}`,
                  padding: "14px 16px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <Icon size={16} color={colors.lime} />
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{label}</span>
                </div>
                <p style={{ margin: 0, fontSize: 12.5, color: colors.textMuted, lineHeight: 1.9 }}>
                  {items.join(" \u00b7 ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
import React, { useEffect, useState } from "react";
import { Github, Linkedin, Facebook, Mail } from "lucide-react";

const QUICK_LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "contact", label: "Contact" },
];

export default function Footer({ colors }) {
  const [settings, setSettings] = useState({ email: "", github: "", linkedin: "", facebook: "" });

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then(setSettings)
      .catch(() => {});
  }, []);

  const socials = [
    { key: "email", icon: Mail, href: settings.email ? `mailto:${settings.email}` : "" },
    { key: "github", icon: Github, href: settings.github },
    { key: "linkedin", icon: Linkedin, href: settings.linkedin },
    { key: "facebook", icon: Facebook, href: settings.facebook },
  ].filter((s) => s.href);

  return (
    <footer
      style={{
        borderTop: `1px solid ${colors.line}`,
        padding: "34px 6vw",
        display: "flex",
        flexWrap: "wrap",
        gap: 20,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <p className="jd-serif" style={{ fontSize: 15, margin: 0, color: colors.textMuted }}>
        &copy; {new Date().getFullYear()} Junelle Dinglasan
      </p>

      <nav style={{ display: "flex", gap: 22, fontSize: 12.5 }}>
        {QUICK_LINKS.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            data-cursor-hover
            className="jd-link"
            style={{ color: colors.textMuted, textDecoration: "none" }}
          >
            {label}
          </a>
        ))}
      </nav>

      {socials.length > 0 && (
        <div style={{ display: "flex", gap: 12 }}>
          {socials.map(({ key, icon: Icon, href }) => (
            <a
              key={key}
              href={href}
              target={key === "email" ? undefined : "_blank"}
              rel="noreferrer"
              data-cursor-hover
              aria-label={key}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: `1px solid ${colors.line}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: colors.textMuted,
              }}
            >
              <Icon size={13} />
            </a>
          ))}
        </div>
      )}
    </footer>
  );
}
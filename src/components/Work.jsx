import React, { useEffect, useState } from "react";
import { ExternalLink, FileDown, Plus, X } from "lucide-react";
import ProjectComposer from "./ProjectComposer";

function ImageGallery({ images, colors }) {
  if (!images || images.length === 0) return null;

  if (images.length === 1) {
    return (
      <img
        src={images[0]}
        alt=""
        style={{ width: "100%", maxHeight: 340, objectFit: "cover", display: "block" }}
      />
    );
  }

  if (images.length === 2) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
        {images.map((src, i) => (
          <img key={i} src={src} alt="" style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 2, height: 260 }}>
      <img src={images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      <div style={{ display: "grid", gridTemplateRows: images.length > 3 ? "1fr 1fr" : "1fr", gap: 2 }}>
        {images.slice(1, 3).map((src, i) => (
          <div key={i} style={{ position: "relative" }}>
            <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            {i === 1 && images.length > 3 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.5)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                +{images.length - 3}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project, colors }) {
  const { title, description, tags, link, fileName, fileData, images } = project;
  return (
    <div className="jd-card" style={{ border: `1px solid ${colors.line}`, background: colors.surface }}>
      <ImageGallery images={images} colors={colors} />
      <div style={{ padding: "22px 24px" }}>
        <h3 className="jd-serif" style={{ fontSize: 22, fontWeight: 600, margin: "0 0 10px" }}>
          {title}
        </h3>
        <p style={{ color: colors.textMuted, fontSize: 14, lineHeight: 1.75, margin: "0 0 16px" }}>
          {description}
        </p>
        {tags && tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
            {tags.map((t, i) => (
              <span
                key={i}
                style={{
                  fontSize: 11,
                  color: colors.lime,
                  border: `1px solid ${colors.line}`,
                  borderRadius: 999,
                  padding: "4px 12px",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        )}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              data-cursor-hover
              className="jd-btn"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12.5,
                color: colors.bg,
                background: colors.lime,
                border: "none",
                borderRadius: 2,
                padding: "9px 16px",
                textDecoration: "none",
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
              }}
            >
              Visit link <ExternalLink size={13} />
            </a>
          )}
          {fileData && (
            <a
              href={fileData}
              download={fileName || "file"}
              data-cursor-hover
              className="jd-btn"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12.5,
                color: colors.text,
                background: "transparent",
                border: `1px solid ${colors.line}`,
                borderRadius: 2,
                padding: "9px 16px",
                textDecoration: "none",
                fontFamily: "'Space Mono', monospace",
              }}
            >
              {fileName || "Download file"} <FileDown size={13} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Work({ colors, loaded }) {
  const [showComposer, setShowComposer] = useState(false);
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState("loading");
  const [errorDetail, setErrorDetail] = useState("");

  const loadProjects = async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Request failed (${res.status})`);
      }
      const data = await res.json();
      setProjects(data);
      setStatus("ready");
    } catch (err) {
      setErrorDetail(err.message || "Unknown error");
      setStatus("error");
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <section id="work" style={{ padding: "10vh 6vw" }}>
      <p style={{ color: colors.amber, fontSize: 13, letterSpacing: 0.4, margin: "0 0 16px" }}>
        Work
      </p>
      <h2
        className="jd-serif"
        style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)", lineHeight: 1.15, margin: "0 0 44px", fontWeight: 480, maxWidth: 600 }}
      >
        A few things I've built.
      </h2>

      {status === "loading" && (
        <p style={{ color: colors.textMuted, fontSize: 13 }}>Loading projects&hellip;</p>
      )}

      {status === "error" && (
        <p style={{ color: colors.textMuted, fontSize: 13, lineHeight: 1.8, maxWidth: 480 }}>
          Couldn't reach the projects database: <span style={{ color: "#E24B4A" }}>{errorDetail}</span>
        </p>
      )}

      {status === "ready" && projects.length === 0 && (
        <p style={{ color: colors.textMuted, fontSize: 13 }}>
          No projects yet &mdash; add your first one below.
        </p>
      )}

      {status === "ready" && projects.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} colors={colors} />
          ))}
        </div>
      )}

      <div style={{ marginTop: 32 }}>
        <button
          data-cursor-hover
          onClick={() => setShowComposer((v) => !v)}
          className="jd-btn"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 12.5,
            color: colors.textMuted,
            background: "transparent",
            border: `1px dashed ${colors.line}`,
            borderRadius: 2,
            padding: "12px 18px",
            fontFamily: "'Space Mono', monospace",
          }}
        >
          {showComposer ? <X size={14} /> : <Plus size={14} />}
          {showComposer ? "Close" : "Add a project (only you should see this)"}
        </button>
      </div>

      {showComposer && <ProjectComposer colors={colors} onAdded={loadProjects} />}
    </section>
  );
}
import React, { useEffect, useState } from "react";
import { ExternalLink, FileDown, Plus, X, Pencil, Trash2 } from "lucide-react";
import ProjectComposer from "./ProjectComposer";
import AuthGate from "./AuthGate";

function Frame({ src, height, colors, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{ position: "relative", height, overflow: "hidden", background: colors.bg, cursor: onClick ? "pointer" : "default" }}
    >
      <img
        src={src}
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "blur(24px) brightness(0.45)",
          transform: "scale(1.15)",
        }}
      />
      <img
        src={src}
        alt=""
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          objectFit: "contain",
          display: "block",
        }}
      />
    </div>
  );
}

function ImageGallery({ images, colors, onImageClick }) {
  if (!images || images.length === 0) return null;

  if (images.length === 1) {
    return <Frame src={images[0]} height={220} colors={colors} onClick={() => onImageClick(0)} />;
  }

  if (images.length === 2) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
        {images.map((src, i) => (
          <Frame key={i} src={src} height={200} colors={colors} onClick={() => onImageClick(i)} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 2, height: 240 }}>
      <Frame src={images[0]} height="100%" colors={colors} onClick={() => onImageClick(0)} />
      <div style={{ display: "grid", gridTemplateRows: images.length > 3 ? "1fr 1fr" : "1fr", gap: 2 }}>
        {images.slice(1, 3).map((src, i) => (
          <div key={i} style={{ position: "relative" }}>
            <Frame src={src} height="100%" colors={colors} onClick={() => onImageClick(i + 1)} />
            {i === 1 && images.length > 3 && (
              <div
                onClick={() => onImageClick(3)}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.55)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  fontWeight: 700,
                  cursor: "pointer",
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

function Lightbox({ images, index, onClose, onNav, colors }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav(1);
      if (e.key === "ArrowLeft") onNav(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onNav]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.88)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          background: "none",
          border: `1px solid ${colors.line}`,
          borderRadius: "50%",
          width: 36,
          height: 36,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <X size={16} />
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNav(-1);
            }}
            aria-label="Previous image"
            style={{
              position: "absolute",
              left: 16,
              background: "none",
              border: `1px solid ${colors.line}`,
              borderRadius: "50%",
              width: 40,
              height: 40,
              color: "#fff",
              fontSize: 18,
              cursor: "pointer",
            }}
          >
            &lsaquo;
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNav(1);
            }}
            aria-label="Next image"
            style={{
              position: "absolute",
              right: 16,
              background: "none",
              border: `1px solid ${colors.line}`,
              borderRadius: "50%",
              width: 40,
              height: 40,
              color: "#fff",
              fontSize: 18,
              cursor: "pointer",
            }}
          >
            &rsaquo;
          </button>
        </>
      )}

      <img
        src={images[index]}
        alt=""
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "88vw", maxHeight: "84vh", objectFit: "contain" }}
      />

      {images.length > 1 && (
        <div
          style={{
            position: "absolute",
            bottom: 20,
            color: colors.textMuted,
            fontSize: 12,
            fontFamily: "'Space Mono', monospace",
          }}
        >
          {index + 1} / {images.length}
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project, colors, isAdmin, onEdit, onDelete, onImageClick }) {
  const { title, description, tags, link, fileName, fileData, images } = project;
  return (
    <div className="jd-card" style={{ border: `1px solid ${colors.line}`, background: colors.surface }}>
      <ImageGallery images={images} colors={colors} onImageClick={onImageClick} />
      <div style={{ padding: "22px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <h3 className="jd-serif" style={{ fontSize: 22, fontWeight: 600, margin: "0 0 10px" }}>
            {title}
          </h3>
          {isAdmin && (
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <button
                type="button"
                onClick={onEdit}
                aria-label="Edit project"
                style={{
                  background: "none",
                  border: `1px solid ${colors.line}`,
                  borderRadius: 2,
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: colors.textMuted,
                  cursor: "pointer",
                }}
              >
                <Pencil size={13} />
              </button>
              <button
                type="button"
                onClick={onDelete}
                aria-label="Delete project"
                style={{
                  background: "none",
                  border: `1px solid ${colors.line}`,
                  borderRadius: 2,
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#E24B4A",
                  cursor: "pointer",
                }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          )}
        </div>
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
  const [adminToken, setAdminToken] = useState(() => sessionStorage.getItem("jd_admin_token") || "");
  const [editingProject, setEditingProject] = useState(null);
  const [lightbox, setLightbox] = useState(null);

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

  const doLogout = () => {
    sessionStorage.removeItem("jd_admin_token");
    setAdminToken("");
    setEditingProject(null);
    setShowComposer(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project? This can't be undone.")) return;
    try {
      const res = await fetch(`/api/projects?id=${id}`, {
        method: "DELETE",
        headers: { "x-auth-token": adminToken },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Delete failed.");
      }
      loadProjects();
    } catch (err) {
      alert("Couldn't delete that: " + err.message);
    }
  };

  const showingAddButton = !editingProject;

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
            <ProjectCard
              key={project.id}
              project={project}
              colors={colors}
              isAdmin={Boolean(adminToken)}
              onEdit={() => {
                setEditingProject(project);
                setShowComposer(false);
              }}
              onDelete={() => handleDelete(project.id)}
              onImageClick={(idx) => setLightbox({ images: project.images, index: idx })}
            />
          ))}
        </div>
      )}

      {showingAddButton && (
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
      )}

      {showComposer && !adminToken && (
        <AuthGate colors={colors} onUnlock={setAdminToken}>
          {(token, logout) => (
            <ProjectComposer
              colors={colors}
              authToken={token}
              onAdded={() => {
                loadProjects();
                setShowComposer(false);
              }}
              onLogout={() => {
                logout();
                doLogout();
              }}
            />
          )}
        </AuthGate>
      )}

      {showComposer && adminToken && (
        <ProjectComposer
          colors={colors}
          authToken={adminToken}
          onAdded={() => {
            loadProjects();
            setShowComposer(false);
          }}
          onLogout={doLogout}
        />
      )}

      {editingProject && (
        <ProjectComposer
          colors={colors}
          authToken={adminToken}
          initialProject={editingProject}
          onCancel={() => setEditingProject(null)}
          onAdded={() => {
            loadProjects();
            setEditingProject(null);
          }}
          onLogout={doLogout}
        />
      )}

      {lightbox && (
        <Lightbox
          images={lightbox.images}
          index={lightbox.index}
          colors={colors}
          onClose={() => setLightbox(null)}
          onNav={(dir) =>
            setLightbox((prev) => ({
              ...prev,
              index: (prev.index + dir + prev.images.length) % prev.images.length,
            }))
          }
        />
      )}
    </section>
  );
}
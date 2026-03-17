"use client";

export function EmptyState({ onOpenDrawer }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 380,
        gap: 16,
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 20,
          background: "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%)",
          border: "2px dashed #c7d2fe",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="10" r="5" stroke="#a5b4fc" strokeWidth="2"/>
          <path d="M7 28c0-4.97 4.03-9 9-9s9 4.03 9 9" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="23" cy="7" r="3.5" stroke="#c4b5fd" strokeWidth="1.5"/>
          <circle cx="9" cy="7" r="3.5" stroke="#c4b5fd" strokeWidth="1.5"/>
        </svg>
      </div>
      <div>
        <p style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700, color: "#1f2937" }}>
          Aucun rôle sélectionné
        </p>
        <p style={{ margin: "0 0 20px", fontSize: 13, color: "#9ca3af", maxWidth: 300 }}>
          Commencez par choisir un rôle pour configurer ses permissions d'accès.
        </p>
      </div>
      <button
        onClick={onOpenDrawer}
        style={{
          padding: "11px 24px",
          borderRadius: 10,
          border: "none",
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
          color: "#fff",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        Choisir un rôle →
      </button>
    </div>
  );
}
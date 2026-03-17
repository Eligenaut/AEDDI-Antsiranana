"use client";

export function ProgressBar({ totalSelected, totalPerms, onSelectAll }) {
  const percentage = Math.round((totalSelected / totalPerms) * 100);

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #f0f0f0",
        borderRadius: 12,
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        gap: 20,
        flexWrap: "wrap",
        marginBottom: 24,
      }}
    >
      <span style={{ fontSize: 13, color: "#6b7280", flexShrink: 0 }}>
        <span style={{ color: "#6366f1", fontWeight: 700, fontSize: 16 }}>{totalSelected}</span>
        <span style={{ color: "#9ca3af" }}> / {totalPerms} permissions</span>
      </span>
      <div style={{ flex: 1, minWidth: 120, height: 6, background: "#f0f0f0", borderRadius: 99, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${percentage}%`,
            background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
            borderRadius: 99,
            transition: "width 0.4s ease",
          }}
        />
      </div>
      <span style={{ fontSize: 12, color: "#9ca3af", flexShrink: 0 }}>
        {percentage}%
      </span>
      <button
        onClick={onSelectAll}
        style={{
          fontSize: 12,
          padding: "5px 12px",
          borderRadius: 6,
          cursor: "pointer",
          background: "#f5f3ff",
          border: "1px solid #ddd6fe",
          color: "#6366f1",
          fontFamily: "inherit",
          fontWeight: 600,
          flexShrink: 0,
        }}
      >
        Tout sélectionner
      </button>
    </div>
  );
}
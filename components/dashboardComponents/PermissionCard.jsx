"use client";

export function PermissionCard({ category, selected, onToggle, onToggleCategory }) {
  const allIn = category.permissions.every((p) => selected.includes(p.id));
  const countIn = category.permissions.filter((p) => selected.includes(p.id)).length;

  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${allIn ? "#ddd6fe" : "#f0f0f0"}`,
        borderRadius: 14,
        padding: 20,
        transition: "all 0.2s ease",
      }}
    >
      {/* Card header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>{category.icon}</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0f0f0f", letterSpacing: "-0.01em" }}>
              {category.name}
            </div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>
              {countIn}/{category.permissions.length} actifs
            </div>
          </div>
        </div>
        <button
          onClick={() => onToggleCategory(category.permissions)}
          style={{
            fontSize: 11,
            padding: "5px 12px",
            borderRadius: 7,
            cursor: "pointer",
            background: allIn ? "#eef2ff" : "#f9fafb",
            border: `1px solid ${allIn ? "#c7d2fe" : "#e5e7eb"}`,
            color: allIn ? "#4f46e5" : "#6b7280",
            fontFamily: "inherit",
            fontWeight: 600,
            transition: "all 0.15s",
          }}
        >
          {allIn ? "Retirer tout" : "Tout ajouter"}
        </button>
      </div>

      {/* Permissions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
        {category.permissions.map((perm) => {
          const isChecked = selected.includes(perm.id);
          return (
            <div
              key={perm.id}
              onClick={() => onToggle(perm.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "9px 11px",
                borderRadius: 8,
                background: isChecked ? "#f5f3ff" : "#fafafa",
                border: `1px solid ${isChecked ? "#ddd6fe" : "#f0f0f0"}`,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  border: `1.5px solid ${isChecked ? "#6366f1" : "#d1d5db"}`,
                  background: isChecked ? "#6366f1" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 0.15s ease",
                }}
              >
                {isChecked && (
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                    <path d="M1.5 4.5l2.2 2.2L7.5 2" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span
                style={{
                  fontSize: 12,
                  color: isChecked ? "#4f46e5" : "#6b7280",
                  fontWeight: isChecked ? 600 : 400,
                  userSelect: "none",
                }}
              >
                {perm.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
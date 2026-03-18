"use client";

import { ROLES, SUB_ROLE_LABELS } from "./roles";

export function Header({
  onBack,
  selectedRole,
  selectedSubRole,
  onOpenDrawer,
  onReset,
  onSave,
  saving,
}) {
  const getRoleLabel = () => {
    if (!selectedRole) return null;
    const roleLabels = {
      [ROLES.BUREAU]: "Membre du Bureau",
      [ROLES.MEMBER]: "Membre",
    };
    let label = roleLabels[selectedRole] || selectedRole;
    if (selectedSubRole) {
      label += ` — ${SUB_ROLE_LABELS[selectedSubRole] ?? selectedSubRole}`;
    }
    return label;
  };

  return (
    <div
      style={{
        background: "#fff",
        borderBottom: "1px solid #f0f0f0",
        padding: "24px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {onBack && (
          <button
            onClick={onBack}
            style={{
              background: "#f5f5f5",
              border: "1px solid #e5e5e5",
              borderRadius: 8,
              padding: "8px 14px",
              cursor: "pointer",
              color: "#6b7280",
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "inherit",
              fontWeight: 500,
            }}
          >
            ← Retour
          </button>
        )}
        <div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#0f0f0f",
              margin: 0,
              letterSpacing: "-0.03em",
            }}
          >
            Gérer les Permissions
          </h1>
          <p style={{ margin: "3px 0 0", fontSize: 12, color: "#9ca3af" }}>
            Configurez les droits d'accès par rôle
          </p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Role badge + edit button */}
        {selectedRole ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 12px 6px 8px",
              background: "#eef2ff",
              border: "1px solid #c7d2fe",
              borderRadius: 99,
              cursor: "pointer",
            }}
            onClick={onOpenDrawer}
          >
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 10,
                flexShrink: 0,
              }}
            >
              ✓
            </div>
            <span
              style={{
                fontSize: 12,
                color: "#4f46e5",
                fontWeight: 600,
                maxWidth: 220,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {getRoleLabel()}
            </span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              style={{ color: "#6366f1" }}
            >
              <path
                d="M2 4l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        ) : (
          <button
            onClick={onOpenDrawer}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "9px 16px",
              borderRadius: 9,
              border: "2px dashed #c7d2fe",
              background: "#eef2ff",
              color: "#6366f1",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M7 2v10M2 7h10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Choisir un rôle
          </button>
        )}

        {selectedRole && (
          <>
            <button
              onClick={onReset}
              style={{
                padding: "9px 14px",
                borderRadius: 8,
                cursor: "pointer",
                background: "#fff",
                border: "1px solid #e5e5e5",
                color: "#6b7280",
                fontSize: 13,
                fontFamily: "inherit",
                fontWeight: 500,
              }}
            >
              Réinitialiser
            </button>
            <button
              onClick={onSave}
              disabled={saving}
              style={{
                padding: "9px 20px",
                borderRadius: 8,
                cursor: saving ? "not-allowed" : "pointer",
                opacity: saving ? 0.7 : 1,
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                border: "none",
                color: "#fff",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                gap: 7,
              }}
            >
              {saving ? (
                <>
                  <span
                    style={{
                      width: 13,
                      height: 13,
                      border: "2px solid rgba(255,255,255,0.4)",
                      borderTopColor: "#fff",
                      borderRadius: "50%",
                      display: "inline-block",
                      animation: "spin 0.7s linear infinite",
                    }}
                  />
                  Sauvegarde...
                </>
              ) : (
                "💾 Sauvegarder"
              )}
            </button>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

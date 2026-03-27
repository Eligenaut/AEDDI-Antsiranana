"use client";

import { useState, useEffect } from "react";
import {
  ROLES,
  SUB_ROLES,
  SUB_ROLE_LABELS,
  roleIcons,
  subRoleCategories,
  roleConfigs,
} from "./roles";

export function RoleDrawer({ open, onClose, onSelect }) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedSubRole, setSelectedSubRole] = useState(null); // ✅ un seul subRole

  useEffect(() => {
    if (open) {
      setMounted(true);
      setTimeout(() => setVisible(true), 10);
    } else {
      setVisible(false);
      setTimeout(() => {
        setMounted(false);
        setSelectedRole(null);
        setSelectedSubRole(null); // ✅
      }, 380);
    }
  }, [open]);

  if (!mounted) return null;

  // ✅ sélection exclusive (radio)
  const handleSelectSubRole = (sr) =>
    setSelectedSubRole((prev) => (prev === sr ? null : sr));

  // ✅ validation avec string
  const isValid =
    selectedRole &&
    (selectedRole === ROLES.MEMBER ||
      selectedRole === ROLES.NOVICE ||
      (selectedRole === ROLES.BUREAU && selectedSubRole !== null));

  const handleConfirm = () => {
    if (!isValid) return;
    onSelect({ role: selectedRole, subRole: selectedSubRole }); // ✅ singulier
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.35)",
          zIndex: 100,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.35s ease",
        }}
      />

      {/* Drawer panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: 480,
          maxWidth: "100vw",
          background: "#fff",
          zIndex: 101,
          display: "flex",
          flexDirection: "column",
          transform: visible ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.38s cubic-bezier(0.32, 0.72, 0, 1)",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.12)",
          fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
        }}
      >
        {/* Drawer header */}
        <div
          style={{
            padding: "28px 28px 20px",
            borderBottom: "1px solid #f0f0f0",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background:
                      "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path
                      d="M9 2a3 3 0 100 6 3 3 0 000-6zM4 14c0-3.31 2.24-5 5-5s5 1.69 5 5"
                      stroke="#fff"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="14.5"
                      cy="5.5"
                      r="2.5"
                      fill="#fff"
                      fillOpacity="0.7"
                    />
                    <circle
                      cx="3.5"
                      cy="5.5"
                      r="2.5"
                      fill="#fff"
                      fillOpacity="0.7"
                    />
                  </svg>
                </div>
                <div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: 17,
                      fontWeight: 700,
                      color: "#0f0f0f",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Assigner un rôle
                  </h2>
                  <p style={{ margin: 0, fontSize: 12, color: "#9ca3af" }}>
                    Choisissez le rôle et la fonction
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                background: "#f9fafb",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6b7280",
                flexShrink: 0,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 1l12 12M13 1L1 13"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* Step indicator */}
          <div style={{ display: "flex", gap: 6, marginTop: 20 }}>
            {["Rôle principal", "Fonction"].map((label, i) => {
              const done = i === 0 && selectedRole;
              const active =
                i === 0 || (i === 1 && selectedRole === ROLES.BUREAU);
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    flex: i === 1 ? 1 : "none",
                  }}
                >
                  {i === 1 && (
                    <div
                      style={{
                        height: 1,
                        width: 16,
                        background: active ? "#6366f1" : "#e5e7eb",
                      }}
                    />
                  )}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "4px 10px",
                      borderRadius: 99,
                      background: done
                        ? "#eef2ff"
                        : active
                        ? "#f5f3ff"
                        : "#f9fafb",
                      border: `1px solid ${
                        done ? "#c7d2fe" : active ? "#ddd6fe" : "#e5e7eb"
                      }`,
                    }}
                  >
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        background: done
                          ? "#6366f1"
                          : active
                          ? "#a5b4fc"
                          : "#d1d5db",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 9,
                        color: "#fff",
                        fontWeight: 700,
                      }}
                    >
                      {done ? "✓" : i + 1}
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        color: active ? "#6366f1" : "#9ca3af",
                        fontWeight: 500,
                      }}
                    >
                      {label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
          {/* Role selection */}
          <div style={{ marginBottom: 28 }}>
            <p
              style={{
                margin: "0 0 12px",
                fontSize: 11,
                fontWeight: 600,
                color: "#9ca3af",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Rôle principal
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {roleConfigs.map((r) => {
                const isSelected = selectedRole === r.key;
                return (
                  <div
                    key={r.key}
                    onClick={() => {
                      setSelectedRole(r.key);
                      if (r.key === ROLES.MEMBER || r.key === ROLES.NOVICE)
                        setSelectedSubRole(null);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "16px 18px",
                      border: `2px solid ${
                        isSelected ? r.accentBorder : "#f3f4f6"
                      }`,
                      borderRadius: 14,
                      background: isSelected ? r.accent : "#fafafa",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {isSelected && (
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: 4,
                          background: r.gradient,
                          borderRadius: "14px 0 0 14px",
                        }}
                      />
                    )}
                    <div
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: 12,
                        background: isSelected ? r.gradient : "#f0f0f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: isSelected ? "#fff" : "#9ca3af",
                        flexShrink: 0,
                        transition: "all 0.2s ease",
                      }}
                    >
                      {roleIcons[r.key]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: isSelected ? r.accentText : "#1f2937",
                        }}
                      >
                        {r.label}
                      </div>
                      <div
                        style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}
                      >
                        {r.desc}
                      </div>
                    </div>
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        border: `2px solid ${
                          isSelected ? r.accentText : "#d1d5db"
                        }`,
                        background: isSelected ? r.accentText : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        transition: "all 0.2s ease",
                      }}
                    >
                      {isSelected && (
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          fill="none"
                        >
                          <path
                            d="M2 5l2.5 2.5L8 3"
                            stroke="#fff"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sub-role (Bureau only) */}
          {selectedRole === ROLES.BUREAU && (
            <div
              style={{
                opacity: 1,
                animation: "fadeSlideIn 0.3s ease forwards",
              }}
            >
              <p
                style={{
                  margin: "0 0 12px",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Fonction{" "}
                <span style={{ color: "#ef4444", fontWeight: 700 }}>*</span>
              </p>

              {subRoleCategories.map((cat) => (
                <div key={cat.label} style={{ marginBottom: 18 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 8,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: cat.color,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#374151",
                      }}
                    >
                      {cat.label}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 7,
                    }}
                  >
                    {cat.roles.map((sr) => {
                      const isSel = selectedSubRole === sr; // ✅ comparaison string
                      return (
                        <div
                          key={sr}
                          onClick={() => handleSelectSubRole(sr)} // ✅ radio
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "9px 12px",
                            borderRadius: 9,
                            border: `1.5px solid ${
                              isSel ? cat.color : "#e5e7eb"
                            }`,
                            background: isSel ? cat.bg : "#fff",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                          }}
                        >
                          {/* ✅ radio rond */}
                          <div
                            style={{
                              width: 15,
                              height: 15,
                              borderRadius: "50%",
                              border: `1.5px solid ${
                                isSel ? cat.color : "#d1d5db"
                              }`,
                              background: isSel ? cat.color : "transparent",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              transition: "all 0.15s ease",
                            }}
                          >
                            {isSel && (
                              <div
                                style={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: "50%",
                                  background: "#fff",
                                }}
                              />
                            )}
                          </div>
                          <span
                            style={{
                              fontSize: 11.5,
                              color: isSel ? cat.color : "#6b7280",
                              fontWeight: isSel ? 600 : 400,
                              lineHeight: 1.3,
                            }}
                          >
                            {SUB_ROLE_LABELS[sr]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Selected summary */}
          {selectedRole && (
            <div
              style={{
                marginTop: 8,
                padding: "12px 14px",
                borderRadius: 10,
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
              }}
            >
              <p
                style={{
                  margin: "0 0 4px",
                  fontSize: 10,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                }}
              >
                Sélection actuelle
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#6366f1",
                  lineHeight: 1.4,
                }}
              >
                {selectedRole === ROLES.BUREAU
                  ? "Membre du Bureau"
                  : selectedRole === ROLES.NOVICE
                  ? "Novice"
                  : "Membre"}
                {selectedSubRole && (
                  <span style={{ fontWeight: 400, color: "#64748b" }}>
                    {" — "}
                    {SUB_ROLE_LABELS[selectedSubRole]}
                  </span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 28px",
            borderTop: "1px solid #f0f0f0",
            display: "flex",
            gap: 10,
            flexShrink: 0,
          }}
        >
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "11px",
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              background: "#f9fafb",
              color: "#374151",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isValid}
            style={{
              flex: 2,
              padding: "11px",
              borderRadius: 10,
              border: "none",
              background: isValid
                ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
                : "#e5e7eb",
              color: isValid ? "#fff" : "#9ca3af",
              fontSize: 13,
              fontWeight: 600,
              cursor: isValid ? "pointer" : "not-allowed",
              fontFamily: "inherit",
              transition: "all 0.2s ease",
            }}
          >
            Confirmer le rôle →
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

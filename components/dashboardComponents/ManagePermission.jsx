"use client";

import { useState } from "react";
import { RoleDrawer } from "./RoleDrawer.jsx";
import { Header } from "./Header.jsx";
import { ProgressBar } from "./ProgressBar.jsx";
import { PermissionCard } from "./PermissionCard.jsx";
import { EmptyState } from "./EmptyState.jsx";
import { permissionCategories, allPermissionIds } from "./Permissions.js";
import { url } from "../context/url.js";

export function ManagePermission({ onSave, onBack } = {}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedSubRole, setSelectedSubRole] = useState(null); // ✅ un seul subRole
  const [selected, setSelected] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loadingPerms, setLoadingPerms] = useState(false);
  const [error, setError] = useState(null);

  const fetchCurrentPermissions = async (role, subRole) => {
    setLoadingPerms(true);
    setError(null);
    try {
      const params = new URLSearchParams({ role });
      if (subRole) params.append("subRole", subRole);

      const response = await fetch(`${url}permissions/get?${params}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok)
        throw new Error("Impossible de charger les permissions");

      const data = await response.json();
      setSelected(data.data?.permissions ?? []);
    } catch (err) {
      setError(err.message);
      setSelected([]);
    } finally {
      setLoadingPerms(false);
    }
  };

  const handleRoleSelect = (roleData) => {
    setSelectedRole(roleData.role);
    setSelectedSubRole(roleData.subRole);
    fetchCurrentPermissions(roleData.role, roleData.subRole);
  };

  const toggle = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );

  const toggleCategory = (perms) => {
    const allIn = perms.every((p) => selected.includes(p.id));
    if (allIn) {
      setSelected((prev) =>
        prev.filter((p) => !perms.find((cp) => cp.id === p)),
      );
    } else {
      const toAdd = perms
        .filter((p) => !selected.includes(p.id))
        .map((p) => p.id);
      setSelected((prev) => [...prev, ...toAdd]);
    }
  };
  const handleReset = async () => {
    if (!selectedRole) return;

    try {
      const response = await fetch(`${url}permissions/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: selectedRole,
          subRole: selectedSubRole,
        }),
      });

      if (!response.ok) throw new Error("Erreur lors de la réinitialisation");

      alert("Permissions réinitialisées avec succès !");
    } catch (err) {
      setError(err.message);
    }
  };

  // ✅ Un seul appel : role + subRole
  const handleSave = async () => {
    setSaving(true);
    setError(null);

    const payload = {
      role: selectedRole,
      subRole: selectedSubRole, // ✅ un seul subRole
      permissions: selected,
    };

    try {
      const response = await fetch(`${url}permissions/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok)
        throw new Error("Erreur lors de la sauvegarde des permissions");

      const data = await response.json();
      onSave?.(data);
      alert("Permissions sauvegardées avec succès !");
    } catch (err) {
      setError(err.message);
      alert("Erreur lors de la sauvegarde : " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const totalSelected = selected.length;
  const totalPerms = allPermissionIds.length;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f9fc",
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
        color: "#0f0f0f",
      }}
    >
      <Header
        onBack={onBack}
        selectedRole={selectedRole}
        selectedSubRole={selectedSubRole}
        onOpenDrawer={() => setDrawerOpen(true)}
        onReset={handleReset} 
        onSave={handleSave}
        saving={saving}
      />

      <div style={{ padding: "28px 40px" }}>
        {error && (
          <div
            style={{
              padding: "12px 16px",
              background: "#fee",
              border: "1px solid #fcc",
              borderRadius: 8,
              color: "#c00",
              marginBottom: 16,
            }}
          >
            ❌ {error}
          </div>
        )}

        {!selectedRole ? (
          <EmptyState onOpenDrawer={() => setDrawerOpen(true)} />
        ) : loadingPerms ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 0",
              color: "#888",
              fontSize: 16,
            }}
          >
            ⏳ Chargement des permissions en cours...
          </div>
        ) : (
          <>
            <ProgressBar
              totalSelected={totalSelected}
              totalPerms={totalPerms}
              onReset={handleReset}
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 16,
              }}
            >
              {permissionCategories.map((cat) => (
                <PermissionCard
                  key={cat.id}
                  category={cat}
                  selected={selected}
                  onToggle={toggle}
                  onToggleCategory={toggleCategory}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <RoleDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSelect={handleRoleSelect}
      />
    </div>
  );
}

export default ManagePermission;

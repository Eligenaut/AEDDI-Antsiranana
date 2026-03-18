"use client";

import { useState } from "react";
import { RoleDrawer } from "./RoleDrawer.jsx";
import { Header } from "./Header.jsx";
import { ProgressBar } from "./ProgressBar.jsx";
import { PermissionCard } from "./PermissionCard.jsx";
import { EmptyState } from "./EmptyState.jsx";
import { permissionCategories, allPermissionIds } from "./Permissions.js";
import {url} from '../context/url.js';

export function ManagePermission({ onSave, onBack } = {}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedSubRoles, setSelectedSubRoles] = useState([]);
  const [selected, setSelected] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleRoleSelect = (roleData) => {
    setSelectedRole(roleData.role);
    setSelectedSubRoles(roleData.subRoles);
    setSelected([]);
  };

  const toggle = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );

  const toggleCategory = (perms) => {
    const allIn = perms.every((p) => selected.includes(p.id));
    if (allIn) {
      setSelected((prev) => prev.filter((p) => !perms.find((cp) => cp.id === p)));
    } else {
      const toAdd = perms.filter((p) => !selected.includes(p.id)).map((p) => p.id);
      setSelected((prev) => [...prev, ...toAdd]);
    }
  };

  const selectAll = () => setSelected(allPermissionIds);
  const clearAll = () => setSelected([]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    const payload = {
      role: selectedRole,
      subRoles: selectedSubRoles,
      permissions: selected,
    };
    console.log('Payload à envoyer:', payload);

    try {
      const response = await fetch(`${url}permissions/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde des permissions');
      }

      const data = await response.json();
      
      // Callback optionnel
      onSave?.(data);
      
      // Afficher un message de succès (vous pouvez utiliser un toast)
      alert('Permissions sauvegardées avec succès !');
      
    } catch (err) {
      setError(err.message);
      console.error('Erreur:', err);
      alert('Erreur lors de la sauvegarde : ' + err.message);
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
      {/* Header */}
      <Header
        onBack={onBack}
        selectedRole={selectedRole}
        selectedSubRoles={selectedSubRoles}
        onOpenDrawer={() => setDrawerOpen(true)}
        onClearAll={clearAll}
        onSave={handleSave}
        saving={saving}
      />

      {/* Content */}
      <div style={{ padding: "28px 40px" }}>
        {/* Message d'erreur */}
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
        ) : (
          <>
            {/* Progress bar */}
            <ProgressBar
              totalSelected={totalSelected}
              totalPerms={totalPerms}
              onSelectAll={selectAll}
            />

            {/* Permission cards */}
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

      {/* Drawer */}
      <RoleDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSelect={handleRoleSelect}
      />
    </div>
  );
}

export default ManagePermission;
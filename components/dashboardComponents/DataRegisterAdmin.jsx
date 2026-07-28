"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { url } from "../context/url.js";
import { getAuthHeaders } from "../context/headers.jsx";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import {
  Plus,
  Edit3,
  Trash2,
  Building2,
  GraduationCap,
  Layers,
  Calendar,
  Home,
  MapPin,
  Save,
  X,
} from "lucide-react";

const TABS = [
  { id: "etablissements", label: "Établissements", icon: Building2, dataKey: "etablissements", nested: true },
  { id: "parcours", label: "Parcours", icon: GraduationCap, dataKey: "parcours", nested: false },
  { id: "niveaux", label: "Niveaux", icon: Layers, dataKey: "niveaux", nested: false },
  { id: "promotions", label: "Promotions", icon: Calendar, dataKey: "promotions", nested: false },
  { id: "types-logement", label: "Types logement", icon: Home, dataKey: "types_logement", nested: true },
  { id: "options-campus", label: "Options campus", icon: MapPin, dataKey: "options_campus", nested: true },
  { id: "sections-campus", label: "Sections campus", icon: MapPin, dataKey: "sections_campus", nested: true },
  { id: "blocs-campus", label: "Blocs campus", icon: MapPin, dataKey: "blocs_campus", nested: false },
  { id: "quartiers", label: "Quartiers", icon: MapPin, dataKey: "quartiers", nested: false },
];

function entityLabel(entity) {
  const labels = {
    etablissements: "établissement",
    parcours: "parcours",
    niveaux: "niveau",
    promotions: "promotion",
    "types-logement": "type de logement",
    "options-campus": "option campus",
    "sections-campus": "section campus",
    "blocs-campus": "bloc campus",
    quartiers: "quartier",
  };
  return labels[entity] || entity;
}

export default function DataRegisterAdmin() {
  const [activeTab, setActiveTab] = useState("etablissements");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const activeTabDef = TABS.find((t) => t.id === activeTab);
  const activeDataKey = activeTabDef?.dataKey;

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${url}data-register`);
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (e) {
      console.error(e);
      Notify.failure("Erreur chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleSave = async (entity, payload, id = null) => {
    const method = id ? "PUT" : "POST";
    const endpoint = id
      ? `${url}admin/data-register/${entity}/${id}`
      : `${url}admin/data-register/${entity}`;

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        Notify.success(id ? "Modifié" : "Créé");
        setModal(null);
        fetchAll();
      } else {
        Notify.failure(json.message || "Erreur");
      }
    } catch (e) {
      Notify.failure("Erreur réseau");
    }
  };

  const handleDelete = async (entity, id, label) => {
    if (!confirm(`Supprimer "${label}" ?`)) return;
    try {
      const res = await fetch(`${url}admin/data-register/${entity}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (json.success) {
        Notify.success("Supprimé");
        fetchAll();
      } else {
        Notify.failure(json.message || "Erreur");
      }
    } catch (e) {
      Notify.failure("Erreur réseau");
    }
  };

  const openModal = (type, entity, options = {}) => {
    setModal({ type, entity, ...options });
  };

  const deleteWithConfirm = (entity, item) => {
    handleDelete(entity, item.id, item.nom);
  };

  const renderFlatList = (entity) => {
    const items = data[activeDataKey];
    if (!items || items.length === 0) {
      return (
        <p className="text-gray-500 text-sm py-8 text-center">
          Aucun élément. Cliquez sur "Ajouter" pour commencer.
        </p>
      );
    }
    return (
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-white rounded-lg px-4 py-3 border border-gray-200 hover:shadow-sm transition-shadow"
          >
            <span className="text-gray-800 font-medium">{item.nom}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => openModal("edit", entity, { item })}
                className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                title="Modifier"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteWithConfirm(entity, item)}
                className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                title="Supprimer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderNestedList = (entity, dataKey) => {
    const items = data[dataKey];
    if (!items || items.length === 0) {
      return (
        <p className="text-gray-500 text-sm py-8 text-center">
          Aucun élément.
        </p>
      );
    }

    return (
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
              <span className="font-semibold text-gray-800">{item.nom}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openModal("edit", entity, { item })}
                  className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                  title="Modifier"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteWithConfirm(entity, item)}
                  className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {entity === "etablissements" && Array.isArray(item.parcours) && (
              <div className="border-t border-gray-100">
                {item.parcours.map((p) => (
                  <div key={p.id} className="border-b border-gray-50 last:border-0">
                    <div className="flex items-center justify-between px-4 py-2 pl-8 text-sm">
                      <span className="text-gray-700 font-medium">{p.nom}</span>
                      <div className="flex gap-1">
                        <button onClick={() => openModal("edit", "parcours", { item: p, defaultParent: item.id, parentField: "etablissement_id" })} className="p-1 text-blue-500 hover:bg-blue-50 rounded" title="Modifier">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => deleteWithConfirm("parcours", p)} className="p-1 text-red-500 hover:bg-red-50 rounded" title="Supprimer">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => openModal("create", "niveaux", { parent: p, parentField: "parcours_id" })} className="p-1 text-green-500 hover:bg-green-50 rounded" title="Ajouter un niveau">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    {Array.isArray(p.niveaux) && (
                      <div className="pl-12 pb-2 space-y-1">
                        {p.niveaux.map((n) => (
                          <div key={n.id} className="flex items-center justify-between py-0.5 text-xs text-gray-600">
                            <span>{n.nom}</span>
                            <div className="flex gap-1">
                              <button onClick={() => openModal("edit", "niveaux", { item: n, defaultParent: p.id, parentField: "parcours_id" })} className="p-0.5 text-blue-400 hover:bg-blue-50 rounded">
                                <Edit3 className="w-3 h-3" />
                              </button>
                              <button onClick={() => deleteWithConfirm("niveaux", n)} className="p-0.5 text-red-400 hover:bg-red-50 rounded">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={() => openModal("create", "niveaux", { parent: p, parentField: "parcours_id" })}
                          className="text-xs text-blue-600 hover:text-blue-800 pl-2 py-1"
                        >
                          + Ajouter un niveau
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => openModal("create", "parcours", { defaultParent: item.id, parentField: "etablissement_id" })}
                  className="text-xs text-blue-600 hover:text-blue-800 pl-8 py-2"
                >
                  + Ajouter un parcours
                </button>
              </div>
            )}

            {entity === "types-logement" && Array.isArray(item.options_campus) && (
              <div className="border-t border-gray-100">
                {item.options_campus.map((o) => (
                  <div key={o.id} className="border-b border-gray-50 last:border-0">
                    <div className="flex items-center justify-between px-4 py-2 pl-8 text-sm">
                      <span className="text-gray-700 font-medium">{o.nom}</span>
                      <div className="flex gap-1">
                        <button onClick={() => openModal("edit", "options-campus", { item: o, defaultParent: item.id, parentField: "type_logement_id" })} className="p-1 text-blue-500 hover:bg-blue-50 rounded" title="Modifier">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => deleteWithConfirm("options-campus", o)} className="p-1 text-red-500 hover:bg-red-50 rounded" title="Supprimer">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => openModal("create", "sections-campus", { parent: o, parentField: "option_campus_id" })} className="p-1 text-green-500 hover:bg-green-50 rounded" title="Ajouter une section">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    {Array.isArray(o.sections) && (
                      <div className="pl-12 pb-2 space-y-1">
                        {o.sections.map((s) => (
                          <div key={s.id} className="border-b border-gray-50 last:border-0">
                            <div className="flex items-center justify-between py-1 pl-2 text-xs text-gray-600">
                              <span className="font-medium">{s.nom}</span>
                              <div className="flex gap-1">
                                <button onClick={() => openModal("edit", "sections-campus", { item: s, defaultParent: o.id, parentField: "option_campus_id" })} className="p-0.5 text-blue-400 hover:bg-blue-50 rounded">
                                  <Edit3 className="w-3 h-3" />
                                </button>
                                <button onClick={() => deleteWithConfirm("sections-campus", s)} className="p-0.5 text-red-400 hover:bg-red-50 rounded">
                                  <Trash2 className="w-3 h-3" />
                                </button>
                                <button onClick={() => openModal("create", "blocs-campus", { parent: s, parentField: "section_campus_id" })} className="p-0.5 text-green-400 hover:bg-green-50 rounded" title="Ajouter un bloc">
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            {Array.isArray(s.blocs) && (
                              <div className="pl-4 space-y-0.5">
                                {s.blocs.map((b) => (
                                  <div key={b.id} className="flex items-center justify-between py-0.5 text-xs text-gray-500">
                                    <span>{b.nom}</span>
                                    <div className="flex gap-1">
                                      <button onClick={() => openModal("edit", "blocs-campus", { item: b, defaultParent: s.id, parentField: "section_campus_id" })} className="p-0.5 text-blue-400 hover:bg-blue-50 rounded">
                                        <Edit3 className="w-2.5 h-2.5" />
                                      </button>
                                      <button onClick={() => deleteWithConfirm("blocs-campus", b)} className="p-0.5 text-red-400 hover:bg-red-50 rounded">
                                        <Trash2 className="w-2.5 h-2.5" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                                <button
                                  onClick={() => openModal("create", "blocs-campus", { parent: s, parentField: "section_campus_id" })}
                                  className="text-xs text-blue-600 hover:text-blue-800 pl-2 py-0.5"
                                >
                                  + Ajouter un bloc
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={() => openModal("create", "sections-campus", { parent: o, parentField: "option_campus_id" })}
                          className="text-xs text-blue-600 hover:text-blue-800 pl-2 py-1"
                        >
                          + Ajouter une section
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => openModal("create", "options-campus", { defaultParent: item.id, parentField: "type_logement_id" })}
                  className="text-xs text-blue-600 hover:text-blue-800 pl-8 py-2"
                >
                  + Ajouter une option campus
                </button>
              </div>
            )}

            {entity === "options-campus" && Array.isArray(item.sections) && (
              <div className="border-t border-gray-100">
                {item.sections.map((s) => (
                  <div key={s.id} className="border-b border-gray-50 last:border-0">
                    <div className="flex items-center justify-between px-4 py-2 pl-8 text-sm">
                      <span className="text-gray-700 font-medium">{s.nom}</span>
                      <div className="flex gap-1">
                        <button onClick={() => openModal("edit", "sections-campus", { item: s, defaultParent: item.id, parentField: "option_campus_id" })} className="p-1 text-blue-500 hover:bg-blue-50 rounded" title="Modifier">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => deleteWithConfirm("sections-campus", s)} className="p-1 text-red-500 hover:bg-red-50 rounded" title="Supprimer">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => openModal("create", "blocs-campus", { parent: s, parentField: "section_campus_id" })} className="p-1 text-green-500 hover:bg-green-50 rounded" title="Ajouter un bloc">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    {Array.isArray(s.blocs) && (
                      <div className="pl-12 pb-2 space-y-1">
                        {s.blocs.map((b) => (
                          <div key={b.id} className="flex items-center justify-between py-0.5 text-xs text-gray-600">
                            <span>{b.nom}</span>
                            <div className="flex gap-1">
                              <button onClick={() => openModal("edit", "blocs-campus", { item: b, defaultParent: s.id, parentField: "section_campus_id" })} className="p-0.5 text-blue-400 hover:bg-blue-50 rounded">
                                <Edit3 className="w-3 h-3" />
                              </button>
                              <button onClick={() => deleteWithConfirm("blocs-campus", b)} className="p-0.5 text-red-400 hover:bg-red-50 rounded">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={() => openModal("create", "blocs-campus", { parent: s, parentField: "section_campus_id" })}
                          className="text-xs text-blue-600 hover:text-blue-800 pl-2 py-1"
                        >
                          + Ajouter un bloc
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => openModal("create", "sections-campus", { defaultParent: item.id, parentField: "option_campus_id" })}
                  className="text-xs text-blue-600 hover:text-blue-800 pl-8 py-2"
                >
                  + Ajouter une section
                </button>
              </div>
            )}

            {entity === "sections-campus" && Array.isArray(item.blocs) && (
              <div className="border-t border-gray-100">
                <div className="pl-8 pb-2 space-y-1">
                  {item.blocs.map((b) => (
                    <div key={b.id} className="flex items-center justify-between py-1 text-sm text-gray-600">
                      <span>{b.nom}</span>
                      <div className="flex gap-1">
                        <button onClick={() => openModal("edit", "blocs-campus", { item: b, defaultParent: item.id, parentField: "section_campus_id" })} className="p-1 text-blue-500 hover:bg-blue-50 rounded" title="Modifier">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => deleteWithConfirm("blocs-campus", b)} className="p-1 text-red-500 hover:bg-red-50 rounded" title="Supprimer">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => openModal("create", "blocs-campus", { parent: item, parentField: "section_campus_id" })}
                    className="text-xs text-blue-600 hover:text-blue-800 pl-2 py-1"
                  >
                    + Ajouter un bloc
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const modalFields = () => {
    if (!modal) return [];
    const { entity, item, parent, parentField, defaultParent } = modal;

    if (modal.type === "edit" && item) {
      // For edit, use the item's existing parent_id if applicable
    }

    switch (entity) {
      case "etablissements":
      case "quartiers":
      case "types-logement":
        return [{ name: "nom", label: "Nom", type: "text" }];
      case "parcours":
        return [
          { name: "etablissement_id", label: "Établissement", type: "select", options: data.etablissements, defaultParentId: modal.type === "create" ? (parent?.id || defaultParent) : item?.etablissement_id },
          { name: "nom", label: "Nom", type: "text" },
        ];
      case "niveaux":
        return [
          { name: "parcours_id", label: "Parcours", type: "select", options: parcoursOptions(), defaultParentId: modal.type === "create" ? (parent?.id || defaultParent) : item?.parcours_id },
          { name: "nom", label: "Nom", type: "text" },
        ];
      case "promotions":
        return [
          { name: "nom", label: "Nom (ex: 2025-2026)", type: "text" },
          { name: "annee", label: "Année", type: "number" },
        ];
      case "options-campus":
        return [
          { name: "type_logement_id", label: "Type logement", type: "select", options: data.types_logement, defaultParentId: modal.type === "create" ? (parent?.id || defaultParent) : item?.type_logement_id },
          { name: "nom", label: "Nom", type: "text" },
        ];
      case "sections-campus":
        return [
          { name: "option_campus_id", label: "Option campus", type: "select", options: optionsCampusOptions(), defaultParentId: modal.type === "create" ? (parent?.id || defaultParent) : item?.option_campus_id },
          { name: "nom", label: "Nom", type: "text" },
        ];
      case "blocs-campus":
        return [
          { name: "section_campus_id", label: "Section campus", type: "select", options: sectionsCampusOptions(), defaultParentId: modal.type === "create" ? (parent?.id || defaultParent) : item?.section_campus_id },
          { name: "nom", label: "Nom", type: "text" },
        ];
      default:
        return [];
    }
  };

  const parcoursOptions = () => {
    const result = [];
    (data.etablissements || []).forEach((e) => {
      (e.parcours || []).forEach((p) => {
        result.push({ id: p.id, nom: `${e.nom} > ${p.nom}` });
      });
    });
    return result;
  };

  const optionsCampusOptions = () => {
    const result = [];
    (data.types_logement || []).forEach((t) => {
      (t.options_campus || []).forEach((o) => {
        result.push({ id: o.id, nom: `${t.nom} > ${o.nom}` });
      });
    });
    return result;
  };

  const sectionsCampusOptions = () => {
    const result = [];
    (data.options_campus || []).forEach((o) => {
      (o.sections || []).forEach((s) => {
        result.push({ id: s.id, nom: `${o.nom} > ${s.nom}` });
      });
    });
    return result;
  };

  const modalDefaultValues = () => {
    if (!modal) return {};
    const { type, item } = modal;

    if (type === "edit" && item) {
      return { ...item };
    }

    const values = {};
    modalFields().forEach((f) => {
      if (f.defaultParentId) values[f.name] = f.defaultParentId;
      else if (f.type === "number") values[f.name] = "";
      else values[f.name] = "";
    });
    return values;
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
        </div>
      );
    }

    const entity = activeTabDef.id;
    const dataKey = activeTabDef.dataKey;

    if (activeTabDef.nested) {
      return (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">{activeTabDef.label}</h3>
            <button
              onClick={() => openModal("create", entity)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" /> Ajouter
            </button>
          </div>
          {renderNestedList(entity, dataKey)}
        </div>
      );
    }

    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{activeTabDef.label}</h3>
          <button
            onClick={() => openModal("create", entity)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" /> Ajouter
          </button>
        </div>
        {renderFlatList(entity)}
      </div>
    );
  };

  const modalTitle = () => {
    if (!modal) return "";
    const { type, entity } = modal;
    const action = type === "create" ? "Ajouter" : "Modifier";
    return `${action} un ${entityLabel(entity)}`;
  };

  const modalSaveEntity = () => {
    return modal?.entity || "";
  };

  const modalSaveId = () => {
    if (!modal || modal.type !== "edit") return null;
    return modal.item?.id || null;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des données d'inscription</h1>
        <p className="text-gray-500 text-sm mt-1">
          Gérez les établissements, parcours, niveaux, promotions et options de logement.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-purple-600 text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {renderTabContent()}
      </motion.div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{modalTitle()}</h3>
              <button
                onClick={() => setModal(null)}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <ModalForm
              fields={modalFields()}
              defaultValues={modalDefaultValues()}
              onSave={(payload) => handleSave(modalSaveEntity(), payload, modalSaveId())}
              onCancel={() => setModal(null)}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
}

function ModalForm({ fields, defaultValues, onSave, onCancel }) {
  const [values, setValues] = useState(defaultValues);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(values);
    setSaving(false);
  };

  if (!fields || fields.length === 0) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
          {field.type === "select" ? (
            <select
              value={values[field.name] || ""}
              onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
              required
            >
              <option value="">Sélectionner...</option>
              {(field.options || []).map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.nom}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type || "text"}
              value={values[field.name] || ""}
              onChange={(e) =>
                setValues({
                  ...values,
                  [field.name]: field.type === "number" ? parseInt(e.target.value) || "" : e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
              required
            />
          )}
        </div>
      ))}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Enregistrer
        </button>
      </div>
    </form>
  );
}

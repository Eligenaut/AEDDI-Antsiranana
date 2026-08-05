"use client";

import { useState, useEffect } from "react";
import { getAuthHeaders } from "../context/headers";
import { url } from "../context/url";
import {
  etablissements,
  optionsCampus,
  quartiers,
  getNiveauxOptions,
  getPromotionsOptions,
  refreshData,
} from "../loginComponents/DataRegister";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

const SUB_ROLE_LABELS = {
  PRESIDENT: "Président",
  VICE_PRESIDENT: "Vice-Président",
  TRESORIER: "Trésorier",
  VICE_TRESORIER: "Vice-Trésorier",
  COMMISSAIRE_COMPTE: "Commissaire aux comptes",
  COMMISSION_CERCLE_ETUDE: "Commission Cercle d'étude",
  COMMISSION_INFORMATIQUE: "Commission Informatique",
  COMMISSION_LOGEMENT: "Commission Logement",
  COMMISSION_SOCIAL: "Commission Social",
  COMMISSION_FETE: "Commission Fête",
  COMMISSION_SPORT: "Commission Sport",
  COMMISSION_COMMUNICATION: "Commission Communication",
  COMMISSION_ENVIRONNEMENT: "Commission Environnement",
};

function isFile(obj) {
  return typeof File !== "undefined" && obj instanceof File;
}

const Alert = ({ type, message }) => (
  <div
    className={`p-4 border-l-4 rounded ${
      type === "success"
        ? "bg-green-50 border-green-500 text-green-800 font-medium"
        : "bg-red-50 border-red-500 text-red-800 font-medium"
    }`}
  >
    {message}
  </div>
);

// ✅ Composant label réutilisable plus visible
const Label = ({ children, required }) => (
  <label className="block text-sm font-semibold text-gray-800 mb-1">
    {children} {required && <span className="text-red-500">*</span>}
  </label>
);

// ✅ Composant input réutilisable plus visible
const Input = ({ ...props }) => (
  <input
    {...props}
    className="w-full px-3 py-2 border border-gray-400 rounded-lg text-black font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
  />
);

// ✅ Composant select réutilisable plus visible
const Select = ({ children, ...props }) => (
  <select
    {...props}
    className="w-full px-3 py-2 border border-gray-400 rounded-lg text-black font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
  >
    {children}
  </select>
);

export default function UserEdit({
  isOpen,
  onCancel = () => {},
  onClose = () => {},
  initialData = {},
  onSave,
  showRole = false,
  userId = null,
}) {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(isOpen);
  const [notifyCloseOnExit, setNotifyCloseOnExit] = useState(false);
  const [closing, setClosing] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const defaultForm = {
    role: "MEMBER",
    sub_role: [],
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    etablissement: "",
    parcours: "",
    niveau: "",
    promotion: "",
    logement: "",
    blocCampus: "",
    quartier: "",
    image: null,
  };

  const [formData, setFormData] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedEtablissement, setSelectedEtablissement] = useState("");
  const [selectedParcours, setSelectedParcours] = useState("");
  const [selectedCampusType, setSelectedCampusType] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [dataReady, setDataReady] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => { refreshData().then(() => setDataReady(true)); }, []);

  useEffect(() => {
    if (!mounted) return;

    if (userId && isOpen) {
      fetchMemberData();
      return;
    }

    if (initialData?.nom) {
      setFormData({
        role: initialData.role || "MEMBER",
        sub_role: Array.isArray(initialData.sub_role) ? initialData.sub_role : [],
        nom: initialData.nom || "",
        prenom: initialData.prenom || "",
        email: initialData.email || "",
        telephone: initialData.telephone || "",
        etablissement: initialData.etablissement || "",
        parcours: initialData.parcours || "",
        niveau: initialData.niveau || "",
        promotion: initialData.promotion || "",
        logement: initialData.logement || "",
        blocCampus: initialData.blocCampus || initialData.bloc_campus || "",
        quartier: initialData.quartier || "",
        image: null,
      });
      setSelectedEtablissement(initialData.etablissement || "");
      setSelectedParcours(initialData.parcours || "");
      setImagePreview(initialData.avatar || null);
      if (initialData.logement === "campus") {
        const blocName = initialData.blocCampus || initialData.bloc_campus || "";
        const optName = initialData.option_campus || "";
        const secName = initialData.section_campus || "";

        if (optName && optionsCampus[optName]) {
          setSelectedCampusType(optName);
          if (secName && optionsCampus[optName]?.sections?.[secName]) {
            setSelectedSection(secName);
          }
        } else if (blocName) {
          const type = Object.keys(optionsCampus).find((key) =>
            Object.values(optionsCampus[key]?.sections || {}).some((blocs) =>
              blocs.includes(blocName),
            ),
          );
          if (type) {
            setSelectedCampusType(type);
            const sec = Object.keys(optionsCampus[type].sections).find((s) =>
              optionsCampus[type].sections[s].includes(blocName),
            );
            if (sec) setSelectedSection(sec);
          }
        }
      }
      setLoadingData(false);
    }
  }, [isOpen, userId, mounted, initialData, dataReady]);

  const fetchMemberData = async () => {
      setLoadingData(true);
      try {
        const res = await fetch(`${url}members/${userId}`, {
          credentials: "include",
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        if (data.success && data.data) {
          const d = data.data;
          console.log("Données récupérées", d);
          const subRole = Array.isArray(d.sub_role) ? d.sub_role : [];

          setFormData({
            role: d.role || "MEMBER",
            sub_role: subRole,
            nom: d.nom || "",
            prenom: d.prenom || "",
            email: d.email || "",
            telephone: d.telephone || "",
            etablissement: d.etablissement || "",
            parcours: d.parcours || "",
            niveau: d.niveau || "",
            promotion: d.promotion || "",
            logement: d.logement || "campus",
            blocCampus: d.bloc_campus || "",
            quartier: d.quartier || "",
            image: null,
          });

          setSelectedEtablissement(d.etablissement || "");
          setSelectedParcours(d.parcours || "");
          setImagePreview(d.avatar || null);

          if (d.logement === "campus") {
            const bloc = d.bloc_campus || "";
            const opt = d.option_campus || "";
            const sec = d.section_campus || "";

            if (opt && optionsCampus[opt]) {
              setSelectedCampusType(opt);
              if (sec && optionsCampus[opt]?.sections?.[sec]) {
                setSelectedSection(sec);
              }
            } else if (bloc) {
              const type = Object.keys(optionsCampus).find((key) =>
                Object.values(optionsCampus[key]?.sections || {}).some((blocs) =>
                  blocs.includes(bloc),
                ),
              );
              if (type) {
                setSelectedCampusType(type);
                const s = Object.keys(optionsCampus[type].sections).find((s) =>
                  optionsCampus[type].sections[s].includes(bloc),
                );
                if (s) setSelectedSection(s);
              }
            }
          }
        }
      } catch (err) {
        setError("Erreur lors du chargement des données");
      } finally {
        setLoadingData(false);
      }
    };

  useEffect(() => {
    if (!mounted) return;
    if (isOpen) {
      setIsVisible(true);
      setNotifyCloseOnExit(false);
      setClosing(false);
    } else {
      setIsVisible(false);
    }
  }, [isOpen, mounted]);

  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = isVisible ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isVisible, mounted]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubRoleChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, sub_role: value ? [value] : [] }));
  };

  const handleEtablissementChange = (e) => {
    const value = e.target.value;
    setSelectedEtablissement(value);
    setSelectedParcours("");
    setFormData((prev) => ({
      ...prev,
      etablissement: value,
      parcours: "",
      niveau: "",
      promotion: "",
    }));
  };

  const handleParcoursChange = (e) => {
    const value = e.target.value;
    setSelectedParcours(value);
    setFormData((prev) => ({
      ...prev,
      parcours: value,
      niveau: "",
      promotion: "",
    }));
  };

  const handleCampusTypeChange = (e) => {
    const value = e.target.value;
    setSelectedCampusType(value);
    setSelectedSection("");
    setFormData((prev) => ({ ...prev, blocCampus: "" }));
  };

  const handleSectionChange = (e) => {
    const value = e.target.value;
    setSelectedSection(value);
    setFormData((prev) => ({ ...prev, blocCampus: "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, image: file }));
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");

    if (formData.logement === "campus" && !formData.blocCampus) {
      setError(
        'Le champ "bloc campus" est requis lorsque le logement est campus.',
      );
      return;
    }

    setSaving(true);
    try {
      const payload = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
        etablissement: formData.etablissement,
        parcours: formData.parcours,
        niveau: formData.niveau,
        promotion: formData.promotion,
        logement: formData.logement,
        blocCampus: formData.logement === "campus" ? formData.blocCampus : "",
        quartier: formData.quartier,
      };

      if (showRole) {
        payload.role = formData.role;
        payload.subRoles = formData.role === "BUREAU" ? formData.sub_role : [];
      }

      if (isFile(formData.image)) {
        const toBase64 = (file) =>
          new Promise((res, rej) => {
            const reader = new FileReader();
            reader.onload = () => res(reader.result);
            reader.onerror = rej;
            reader.readAsDataURL(file);
          });
        payload.image = await toBase64(formData.image);
        payload.imageName = formData.image.name;
        payload.imageType = formData.image.type;
      }
      const endpoint = userId ? `${url}members/${userId}` : `${url}auth/me`;
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data.message || data.error || "Erreur lors de la mise à jour",
        );

      setSuccess("Profil mis à jour avec succès");
      if (onSave) onSave(data.data || payload);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Erreur de mise à jour");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (saving || closing) return;
    setClosing(true);
    setNotifyCloseOnExit(true);
    setIsVisible(false);
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence
      onExitComplete={() => {
        if (notifyCloseOnExit) {
          setFormData(defaultForm);
          setError("");
          setSuccess("");
          setImagePreview(null);
          setSelectedSection("");
          onCancel();
          onClose();
          setNotifyCloseOnExit(false);
        }
        setClosing(false);
      }}
    >
      {isVisible && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
          />
          <motion.div
            className="fixed top-0 right-0 h-full w-full sm:w-[620px] bg-white shadow-2xl z-50 overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">
                Modifier le profil
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {loadingData ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-700 font-medium">
                  Chargement...
                </span>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {success && <Alert type="success" message={success} />}
                {error && <Alert type="error" message={error} />}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSave();
                  }}
                  className="space-y-5"
                >
                  {/* Section Identité */}
                  <div>
                    <h3 className="text-base font-bold text-gray-800 mb-3 pb-1 border-b border-gray-200">
                      Identité
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label required>Nom</Label>
                        <Input
                          type="text"
                          name="nom"
                          value={formData.nom}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <Label required>Prénom</Label>
                        <Input
                          type="text"
                          name="prenom"
                          value={formData.prenom}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <Label required>Email</Label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <Label required>Téléphone</Label>
                        <Input
                          type="tel"
                          name="telephone"
                          value={formData.telephone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section Rôle */}
                  {showRole && (
                    <div>
                      <h3 className="text-base font-bold text-gray-800 mb-3 pb-1 border-b border-gray-200">
                        Rôle
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label required>Rôle</Label>
                          <Select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                          >
                            <option value="NOVICE">Novice</option>
                            <option value="MEMBER">Ancien</option>
                            <option value="BUREAU">Bureau</option>
                          </Select>
                        </div>
                        {formData.role === "BUREAU" && (
                          <div>
                            <Label required>Sous-rôle</Label>
                            <Select
                              value={formData.sub_role?.[0] || ""}
                              onChange={handleSubRoleChange}
                            >
                              <option value="">
                                Sélectionner un sous-rôle
                              </option>
                              {Object.entries(SUB_ROLE_LABELS).map(
                                ([key, label]) => (
                                  <option key={key} value={key}>
                                    {label}
                                  </option>
                                ),
                              )}
                            </Select>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Section Académique */}
                  {/* Section Académique */}
                  <div>
                    <h3 className="text-base font-bold text-gray-800 mb-3 pb-1 border-b border-gray-200">
                      Académique
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Établissement</Label>
                        <Select
                          key={`etab-${dataReady}`}
                          value={selectedEtablissement}
                          onChange={handleEtablissementChange}
                        >
                          <option value="">Sélectionner</option>
                          {/* ✅ etablissements est un objet, la clé est le nom */}
                          {Object.entries(etablissements).map(([key, val]) => (
                            <option key={key} value={key}>
                              {key}
                            </option>
                          ))}
                        </Select>
                      </div>

                      {selectedEtablissement && (
                        <div>
                          <Label>Parcours</Label>
                          <Select
                            value={selectedParcours}
                            onChange={handleParcoursChange}
                          >
                            <option value="">Sélectionner</option>
                            {/* ✅ parcours est un tableau de strings */}
                            {etablissements[
                              selectedEtablissement
                            ]?.parcours.map((p) => (
                              <option key={p} value={p}>
                                {p}
                              </option>
                            ))}
                          </Select>
                        </div>
                      )}

                      {selectedParcours && (
                        <div>
                          <Label>Niveau</Label>
                          <Select
                            name="niveau"
                            value={formData.niveau}
                            onChange={handleChange}
                          >
                            <option value="">Sélectionner</option>
                            {/* ✅ getNiveauxOptions prend selectedParcours */}
                            {getNiveauxOptions(selectedParcours).map((n) => (
                              <option key={n} value={n}>
                                {n}
                              </option>
                            ))}
                          </Select>
                        </div>
                      )}

                      {formData.niveau && (
                        <div>
                          <Label>Promotion</Label>
                          <Select
                            name="promotion"
                            value={formData.promotion}
                            onChange={handleChange}
                          >
                            <option value="">Sélectionner</option>
                            {/* ✅ getPromotionsOptions retourne des années */}
                            {getPromotionsOptions().map((p) => (
                              <option key={p} value={p}>
                                {p}
                              </option>
                            ))}
                          </Select>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section Logement */}
                  <div>
                    <h3 className="text-base font-bold text-gray-800 mb-3 pb-1 border-b border-gray-200">
                      Logement
                    </h3>
                    <div className="space-y-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.logement === "campus"}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              logement: e.target.checked ? "campus" : "",
                              blocCampus: e.target.checked ? prev.blocCampus : "",
                            }));
                            if (!e.target.checked) {
                              setSelectedCampusType("");
                            }
                          }}
                          className="w-5 h-5 border-gray-400 rounded"
                        />
                        <span className="text-sm font-semibold text-gray-800">
                          Je loge au campus
                        </span>
                      </label>

                      {formData.logement === "campus" && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-7">
                          <div>
                            <Label>Type de campus</Label>
                            <Select
                              key={`campus-${dataReady}`}
                              value={selectedCampusType}
                              onChange={handleCampusTypeChange}
                            >
                              <option value="">Sélectionner</option>
                              {Object.entries(optionsCampus).map(
                                ([key]) => (
                                  <option key={key} value={key}>
                                    {key}
                                  </option>
                                ),
                              )}
                            </Select>
                          </div>
                          {selectedCampusType && (
                            <div>
                              <Label>Bâtiment</Label>
                              <Select
                                value={selectedSection}
                                onChange={handleSectionChange}
                              >
                                <option value="">Sélectionner</option>
                                {Object.keys(optionsCampus[selectedCampusType]?.sections || {}).map(
                                  (s) => (
                                    <option key={s} value={s}>
                                      {s}
                                    </option>
                                  ),
                                )}
                              </Select>
                            </div>
                          )}
                          {selectedSection && (
                            <div>
                              <Label required>Bloc</Label>
                              <Select
                                name="blocCampus"
                                value={formData.blocCampus}
                                onChange={handleChange}
                              >
                                <option value="">Sélectionner</option>
                                {(optionsCampus[selectedCampusType]?.sections?.[selectedSection] || []).map(
                                  (b) => (
                                    <option key={b} value={b}>
                                      {b}
                                    </option>
                                  ),
                                )}
                              </Select>
                            </div>
                          )}
                        </div>
                      )}

                      <div className={formData.logement === "campus" ? "pl-7" : ""}>
                        <Label required>Quartier</Label>
                        <Select
                          name="quartier"
                          value={formData.quartier}
                          onChange={handleChange}
                        >
                          <option value="">Sélectionner un quartier</option>
                          {quartiers.map((q) => (
                            <option key={q} value={q}>
                              {q}
                            </option>
                          ))}
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Section Photo */}
                  <div>
                    <h3 className="text-base font-bold text-gray-800 mb-3 pb-1 border-b border-gray-200">
                      Photo de profil
                    </h3>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 border border-gray-400 rounded-lg text-gray-800 font-medium"
                    />
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Aperçu"
                        className="mt-3 h-24 w-24 rounded-full object-cover border-2 border-gray-300"
                      />
                    )}
                  </div>

                  {/* Boutons */}
                  <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-6 py-2 border border-gray-400 rounded-lg text-gray-800 font-semibold hover:bg-gray-100"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {saving ? "Mise à jour..." : "Mettre à jour"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}

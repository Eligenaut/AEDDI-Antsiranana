"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  DollarSign,
  Download,
  Mail,
} from "lucide-react";
import axios from "axios";
import { url } from "../context/url.js";
import { getAuthHeaders } from "../context/headers.jsx";
import { CotisationModal } from "./CotisationModal";
import { ShowMember } from "./ShowMember";
import { FilterUser } from "./FilterUser";
import AddAuthorizedEmail from "../loginComponents/AddAuthorizedEmail.jsx";
import UserEdit from "./UserEdit";
import { usePermissions } from "../context/permissions";

export function DashboardUser() {
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalUser, setModalUser] = useState(null);
  const [showMemberId, setShowMemberId] = useState(null);
  const [filters, setFilters] = useState({ etablissement: "", promotion: "" });
  const [editUser, setEditUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [exporting, setExporting] = useState(false);

  const { ready, can } = usePermissions();
  const canCreateMember = ready && can("create_membre");
  const canEditMember = ready && can("edit_membre");
  const canDeleteMember = ready && can("delete_membre");
  const canManageCotisation = ready && can("edit_cotisation");
  const canExport = ready && can("show_membre");


  const handleOpenEdit = async (member) => {
    try {
      const response = await axios.get(`${url}members/${member.id}`, {
        headers: getAuthHeaders(),
      });
      const userData = response.data.data;
      const normalizedData = {
        ...userData,
        nom: userData.nom || userData.name || "",
        prenom: userData.prenom || userData.firstname || "",
        email: userData.email || "",
        telephone: userData.telephone || userData.phone || "",
        etablissement: userData.etablissement || "",
        parcours: userData.parcours || "",
        niveau: userData.niveau || "",
        promotion: userData.promotion || "",
        logement: userData.logement || "",
        blocCampus: userData.blocCampus || userData.bloc_campus || "",
        quartier: userData.quartier || "",
        role: userData.role || "member",
        sub_role: userData.sub_role || "",
        image: userData.image || userData.avatar || "",
      };
      setEditUser({ ...userData, ...normalizedData });
    } catch (err) {
      console.error("Erreur lors du chargement de l'utilisateur:", err);
      setEditUser(null);
    }
  };

  const handleCloseEdit = () => setEditUser(null);
  const handleSaveEdit = () => {
    setEditUser(null);
    fetchMembers();
  };

  const fetchMembers = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${url}members`, {
        headers: getAuthHeaders(),
      });
      const membersData = response.data.data || [];
      console.log("Membres chargés:", membersData);
      setMembers(membersData);
      setFilteredMembers(membersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      console.error("Erreur lors du chargement des membres:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleExportXLSX = async () => {
    if (!canExportUsers(currentUser)) {
      alert("Vous n'avez pas les permissions pour exporter les données");
      return;
    }
    setExporting(true);
    try {
      const response = await axios.get(`${url}export/users/xlsx`, {
        headers: getAuthHeaders(),
        responseType: "blob",
      });
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      const downloadUrl = window.URL.createObjectURL(blob);
      link.setAttribute("href", downloadUrl);

      const contentDisposition = response.headers["content-disposition"];
      let filename = "utilisateurs_aeddi.xlsx";
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) filename = filenameMatch[1];
      }

      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("Erreur lors de l'exportation XLSX:", err);
      alert("Erreur lors de l'exportation XLSX des données");
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    let filtered = [...members];
    if (filters.etablissement) {
      filtered = filtered.filter(
        (m) => m.etablissement === filters.etablissement,
      );
    }
    if (filters.promotion) {
      filtered = filtered.filter((m) => m.promotion === filters.promotion);
    }
    setFilteredMembers(filtered);
  }, [members, filters]);

  const handleFiltersChange = (newFilters) => setFilters(newFilters);

  const getMemberType = (member) => member.role?.toUpperCase() ?? "MEMBER";

  const getTypeColor = (type) => {
    switch (type) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "MEMBER":
        return "bg-purple-100 text-purple-800";
      case "NOVICE":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "ADMIN":
        return "Admin";
      case "MEMBER":
        return "Ancien";
      case "NOVICE":
        return "Novice";
      default:
        return type;
    }
  };

  const handleDeleteMember = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce membre ?")) return;
    try {
      setLoading(true);
      await axios.delete(`${url}members/${id}`, { headers: getAuthHeaders() });
      fetchMembers();
    } catch (err) {
      setError("Erreur lors de la suppression du membre.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AddAuthorizedEmail
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onEmailAdded={() => setShowAddModal(true)}
      />
      {editUser && (
        <UserEdit
          isOpen={!!editUser}
          initialData={editUser}
          onSave={handleSaveEdit}
          onCancel={handleCloseEdit}
          userId={editUser?.id}
          showRole={true}
        />
      )}
      <main className="flex-1 overflow-y-auto p-2 sm:p-6 pb-20 lg:pb-6 flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900 mb-1 sm:text-3xl sm:font-bold sm:mb-2">
                Gestion des Membres 👥
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => router.push("/dashboard/membres/email")}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-2 py-1.5 text-xs rounded-lg flex items-center space-x-2 transition-colors sm:px-3 sm:py-2 sm:text-sm"
              >
                <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Emails autorisés</span>
              </button>
              {canCreateMember && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1.5 text-xs rounded-lg flex items-center space-x-2 transition-colors sm:px-3 sm:py-2 sm:text-sm"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Ajouter un membre</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <FilterUser
            onFiltersChange={handleFiltersChange}
            className="w-full"
            currentUser={currentUser}
            onExportXLSX={handleExportXLSX}
            canExport={canExport}
          />
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-red-800">{error}</p>
            <button
              onClick={fetchMembers}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Réessayer
            </button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-3 sm:p-6 rounded-lg shadow-md border border-gray-200 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Membre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Adhésion
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cotisations
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {loading ? (
                  <tr className="border-b border-gray-200">
                    <td
                      colSpan={6}
                      className="px-6 py-20 text-left text-gray-500"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span>Chargement des membres...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredMembers.length === 0 ? (
                  <tr className="border-b border-gray-200">
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                          <Users className="w-10 h-10 text-gray-400" />
                        </div>
                        <div className="text-lg font-medium text-gray-600">
                          {members.length === 0
                            ? "Aucun donnée enregistré"
                            : "Aucun membre ne correspond aux filtres"}
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member) => (
                    <motion.tr
                      key={member.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            {member.avatar ? (
                              <img
                                src={member.avatar}
                                alt={member.name}
                                className="w-10 h-10 rounded-full"
                              />
                            ) : (
                              <span className="text-sm font-medium text-gray-700">
                                {member.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {member.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {member.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(
                            getMemberType(member),
                          )}`}
                        >
                          {getTypeLabel(getMemberType(member))}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(member.created_at).toLocaleDateString(
                          "fr-FR",
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                          {member.cotisation_stats
                            ? `${member.cotisation_stats.payees}/${member.cotisation_stats.total}`
                            : "0/0"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            title="Voir les détails"
                            onClick={() => setShowMemberId(member.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {canEditMember && (
                            <button
                              className="text-green-600 hover:text-green-900"
                              title="Modifier le membre"
                              onClick={() => handleOpenEdit(member)}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                          {canManageCotisation && (
                            <button
                              onClick={() => setModalUser(member)}
                              className="p-1 md:p-2 rounded-full hover:bg-green-100 transition-colors"
                              title="Gérer les cotisations"
                            >
                              <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                            </button>
                          )}
                          {canDeleteMember && (
                            <button
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleDeleteMember(member.id)}
                              title="Supprimer le membre"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        <CotisationModal
          isOpen={!!modalUser}
          onClose={() => setModalUser(null)}
          user={modalUser}
          onUpdate={fetchMembers}
        />
        <ShowMember
          isOpen={!!showMemberId}
          onClose={() => setShowMemberId(null)}
          memberId={showMemberId}
        />
      </main>
    </>
  );
}

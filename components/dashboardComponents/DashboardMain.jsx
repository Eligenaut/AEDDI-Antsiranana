'use client';

import { motion } from 'framer-motion';
import { Users, DollarSign, Calendar, BarChart, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { url } from '../context/url.js';
import { getAuthHeaders } from '../context/headers.jsx';
import { usePermissions } from '../context/permissions';

export function DashboardMain() {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [userRole, setUserRole] = useState('');
  const { user } = usePermissions();
  const isManagement =
    user?.role === 'ADMIN' || user?.role === 'BUREAU';
  const formatMontant = (montant) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0
    }).format(montant).replace('MGA', 'AR');
  };
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}dashboard-stats`, {
        headers: getAuthHeaders()
      });
      
      if (response.data.success && response.data.data) {
        setDashboardStats(response.data.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };
  const LoadingSpinner = () => (
    <span className="inline-flex items-center justify-center">
      <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
    </span>
  );

  useEffect(() => {
    setIsClient(true);

    fetchDashboardStats();
  }, []);
  const membersChartData = {
    labels: ['Bureau', 'Membres'],
    datasets: [
      {
        data: dashboardStats ? [dashboardStats.membres.bureau, dashboardStats.membres.membres] : [0, 0],
        backgroundColor: ['#3B82F6', '#8B5CF6'],
        borderWidth: 0,
      },
    ],
  };
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <main className="flex-1 overflow-y-auto p-2 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 hidden sm:block"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Bienvenue</h1>
        <p className="text-gray-600">Vue d'ensemble de votre donné</p>
      </motion.div>

      <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <div className="bg-white p-3 sm:p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Membres</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {loading ? <LoadingSpinner /> : (dashboardStats ? dashboardStats.membres.total : '-')}
                </h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex justify-between text-sm">
              <span className="text-gray-600">Bureau: {dashboardStats ? dashboardStats.membres.bureau : '-'}</span>
              <span className="text-gray-600">Membres: {dashboardStats ? dashboardStats.membres.membres : '-'}</span>
            </div>
          </div>
          <div className="bg-white p-3 sm:p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Cotisations (Total de cotisation)</p>
                <h3 className="text-2xl font-bold text-gray-800">

                    {loading ? <LoadingSpinner /> : (dashboardStats ? (isManagement ? dashboardStats.cotisations.total_cotisations : formatMontant(dashboardStats.cotisations.montant_total)) : '-')}

                </h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Payées: {loading ? <LoadingSpinner /> : (dashboardStats ? dashboardStats.cotisations.total_paye : '-')}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Non payé: {loading ? <LoadingSpinner /> : (dashboardStats ? dashboardStats.cotisations.total_non_paye : '-')}
                </div>
              </div>

            </div>

          {/* Carte des activités */}
          <div className="bg-white p-3 sm:p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Activités</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {loading ? <LoadingSpinner /> : (dashboardStats ? dashboardStats.activites.total : '-')}
                </h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              </div>
            <div className="mt-4 flex justify-between text-sm">
              <span className="text-gray-600">En cours: {dashboardStats ? dashboardStats.activites.en_cours : '-'}</span>
              <span className="text-gray-600">Terminées: {dashboardStats ? dashboardStats.activites.terminees : '-'}</span>
              </div>
            </div>

          {/* Carte des montants */}
          <div className="bg-white p-3 sm:p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Montants</p>
                <h3 className="text-xl font-bold text-gray-800">


                    {loading ? <LoadingSpinner /> : (dashboardStats ? formatMontant(dashboardStats.cotisations.montant_restant) : '-')}
                  
                </h3>
            </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <BarChart className="h-6 w-6 text-yellow-600" />
                  </div>
                  </div>

              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  Restant: {loading ? <LoadingSpinner /> : (dashboardStats ? formatMontant(dashboardStats.cotisations.montant_restant) : '-')}
                </p>
              </div>
          </div>
        </motion.div>

        {/* Graphiques */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Graphique des membres - Sphère colorée */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Répartition des membres</h3>
            <div className="h-64 flex items-center justify-center">
              {/* Sphère avec segments colorés */}
              <div className="relative">
                {/* Cercle principal */}
                <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
                  {/* Segment Bureau (bleu) */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="40"
                    strokeDasharray={`${dashboardStats ? (dashboardStats.membres.bureau / dashboardStats.membres.total) * 502.4 : 0} 502.4`}
                    className="transition-all duration-500"
                  />
                  {/* Segment Membres (violet) */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#8B5CF6"
                    strokeWidth="40"
                    strokeDasharray={`${dashboardStats ? (dashboardStats.membres.membres / dashboardStats.membres.total) * 502.4 : 0} 502.4`}
                    strokeDashoffset={`-${dashboardStats ? (dashboardStats.membres.bureau / dashboardStats.membres.total) * 502.4 : 0}`}
                    className="transition-all duration-500"
                  />
                </svg>
                
                {/* Centre avec total */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-800">{dashboardStats ? dashboardStats.membres.total : 0}</div>
                    <div className="text-sm text-gray-600">Total</div>
                  </div>
                </div>
              </div>
              
              {/* Légende */}
              <div className="ml-6 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Bureau: {dashboardStats ? dashboardStats.membres.bureau : 0}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Membres: {dashboardStats ? dashboardStats.membres.membres : 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Graphique des cotisations - Tableau graphique */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">État des cotisations</h3>
            <div className="h-64">
             (
                <div className="space-y-4">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <LoadingSpinner />
                    </div>
                  ) : dashboardStats ? (
                    <>
                      {/* Cotisations payées */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Payées</span>
                          <span className="font-semibold text-green-600">{dashboardStats.cotisations.total_paye}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-green-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${(dashboardStats.cotisations.total_paye / (dashboardStats.cotisations.total_cotisations || 1)) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Cotisations non payées */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Non payé</span>
                          <span className="font-semibold text-red-600">{dashboardStats.cotisations.total_non_paye}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-red-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${(dashboardStats.cotisations.total_non_paye / (dashboardStats.cotisations.total_cotisations || 1)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Total et pourcentages */}
                      <div className="pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <div className="text-lg font-bold text-green-600">
                              {Math.round((dashboardStats.cotisations.total_paye / (dashboardStats.cotisations.total_cotisations || 1)) * 100)}%
                            </div>
                            <div className="text-xs text-gray-500">Payées</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-red-600">
                              {Math.round((dashboardStats.cotisations.total_non_paye / (dashboardStats.cotisations.total_cotisations || 1)) * 100)}%
                            </div>
                            <div className="text-xs text-gray-500">Non payé</div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      Aucune donnée disponible
                    </div>
                  )}
                </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

'use client';

import { useState } from 'react';
import UserDetail from './UserDetail';
import NotificationUser from './NotificationUser';

export default function DashboardSetting() {
    const [formData, setFormData] = useState({
        nomAssociation: "AEDDI",
        emailContact: "contact@aeddi.com",
        devise: "MGA",
        currentTab: 'general'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Paramètres enregistrés:", formData);
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        const checked = e.target.checked;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const renderTabContent = () => {
        switch (formData.currentTab) {
            case 'general':
                return (
                    <div className="space-y-4 p-4 border rounded">
                        <h2 className="text-xl font-semibold">Informations générales</h2>
                        <div className="grid gap-4">
                            <div>
                                <label className="block mb-2">Nom de l'association</label>
                                <input
                                    type="text"
                                    name="nomAssociation"
                                    value={formData.nomAssociation}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block mb-2">Email de contact</label>
                                <input
                                    type="email"
                                    name="emailContact"
                                    value={formData.emailContact}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block mb-2">Devise</label>
                                <select
                                    name="devise"
                                    value={formData.devise}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="MGA">Ariary (MGA)</option>
                                    <option value="EUR">Euro (€)</option>
                                    <option value="USD">Dollar ($)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );
            case 'notifications':
                return (
                    <div>
                        <NotificationUser/>
                    </div>
                );
            case 'moncompte':
                return (
                    <UserDetail />
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex-1 overflow-y-auto h-full">
            <div className="px-6 py-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Paramètres</h1>
                    <p className="text-gray-600">Gérez les paramètres de votre association</p>
                </div>

                <div className="flex border-b">
                    {['general', 'notifications', 'moncompte'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFormData(prev => ({ ...prev, currentTab: tab }))}
                            className={`px-4 py-2 font-medium ${formData.currentTab === tab
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab === 'general' && 'Général'}
                            {tab === 'notifications' && 'Notifications'}
                            {tab === 'moncompte' && 'Mon compte'}                  
                        </button>
                    ))}
                </div>

                {renderTabContent()}
            </div>
        </div>
    );
}

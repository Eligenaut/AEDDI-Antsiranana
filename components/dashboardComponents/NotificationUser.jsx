import { useState } from "react";
export default function NotificationUser() {
    const [notificationsEmail, setNotificationEmail] = useState(false);
    const handleCheckboxChange = (e) => {
        setNotificationEmail(e.target.checked);
    };
    return (
        <div className="space-y-4 p-4 border rounded">
            <h2 className="text-xl font-semibold">Notifications</h2>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3>Notifications par email</h3>
                        <p className="text-sm text-gray-600">Recevoir des mises à jour par email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            name="notificationsEmail"
                            checked={notificationsEmail}
                            onChange={handleCheckboxChange}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
                {notificationsEmail && (
                    <div>
                    <label className="text-red-500">vous allez recevoir notification par mail</label>
                </div>
                )}

            </div>
        </div>
    );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Undo2, Trash2, Bell } from "lucide-react";
import { url } from "../context/url.js";
import { getAuthHeaders } from "../context/headers.jsx";

function formatDateTime(dateStr) {
  try {
    return new Date(dateStr).toLocaleString("fr-FR");
  } catch {
    return "";
  }
}

export function NotificationsDrawer({ isOpen, onClose }) {
  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [actionLoading, setActionLoading] = useState({ id: null, action: null });

  useEffect(() => setMounted(true), []);

  const readAndSyncBadge = (count) => {
    const next = Math.max(0, Number(count) || 0);
    localStorage.setItem("notif_unread_badge", String(next));
    window.dispatchEvent(new Event("notif:unread"));
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${url}notifications?limit=30`, {
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (!json?.success) return;
      setItems(Array.isArray(json.data) ? json.data : []);
      const count = Number(json?.meta?.unread_count || 0);
      setUnreadCount(count);
      readAndSyncBadge(count);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    fetchNotifications();
  }, [isOpen]);

  const markRead = async (id) => {
    setActionLoading({ id, action: "read" });
    try {
      await fetch(`${url}notifications/${id}/read`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      setItems((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, read_at: new Date().toISOString() } : n,
        ),
      );
      setUnreadCount((c) => {
        const next = Math.max(0, c - 1);
        readAndSyncBadge(next);
        return next;
      });
    } finally {
      setActionLoading({ id: null, action: null });
    }
  };

  const markUnread = async (id) => {
    setActionLoading({ id, action: "unread" });
    try {
      await fetch(`${url}notifications/${id}/unread`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read_at: null } : n)));
      setUnreadCount((c) => {
        const next = c + 1;
        readAndSyncBadge(next);
        return next;
      });
    } finally {
      setActionLoading({ id: null, action: null });
    }
  };

  const readAll = async () => {
    setActionLoading({ id: "all", action: "read-all" });
    try {
      await fetch(`${url}notifications/read-all`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      const now = new Date().toISOString();
      setItems((prev) => prev.map((n) => (n.read_at ? n : { ...n, read_at: now })));
      setUnreadCount(0);
      readAndSyncBadge(0);
    } finally {
      setActionLoading({ id: null, action: null });
    }
  };

  const remove = async (id) => {
    setActionLoading({ id, action: "delete" });
    try {
      await fetch(`${url}notifications/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      setItems((prev) => {
        const removed = prev.find((x) => x.id === id);
        if (removed && !removed.read_at) {
          setUnreadCount((c) => {
            const next = Math.max(0, c - 1);
            readAndSyncBadge(next);
            return next;
          });
        }
        return prev.filter((n) => n.id !== id);
      });
    } finally {
      setActionLoading({ id: null, action: null });
    }
  };

  const empty = useMemo(() => !loading && items.length === 0, [loading, items]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[9999]"
            style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed top-0 right-0 h-full w-full sm:w-[520px] bg-white shadow-2xl z-[10000] flex flex-col overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                <h2 className="text-xl font-bold">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs font-semibold">
                    {unreadCount} non lue{unreadCount > 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={readAll}
                  disabled={actionLoading.id === "all"}
                  className="bg-white/15 hover:bg-white/25 px-3 py-2 rounded-lg text-xs font-semibold transition"
                >
                  {actionLoading.id === "all" && actionLoading.action === "read-all"
                    ? "Chargement..."
                    : "Tout marquer lu"}
                </button>
                <button
                  onClick={onClose}
                  className="hover:bg-white/20 p-2 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {loading && (
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="border rounded-xl p-3 animate-pulse bg-white"
                    >
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/3 mt-2" />
                      <div className="h-8 bg-gray-100 rounded w-full mt-3" />
                    </div>
                  ))}
                </div>
              )}

              {empty && (
                <div className="text-sm text-gray-600">
                  Aucune notification pour le moment.
                </div>
              )}

              {items.map((n) => {
                const isUnread = !n.read_at;
                const message = n?.data?.message || "Notification";
                const when = formatDateTime(n?.created_at);
                return (
                  <div
                    key={n.id}
                    className={`border rounded-xl p-3 flex gap-3 items-start ${
                      isUnread ? "border-purple-200 bg-purple-50" : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900">
                        {message}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{when}</div>
                      <div className="text-[11px] text-gray-400 mt-1">
                        {n.type === "activite.created"
                          ? "Activité • Création"
                          : n.type === "activite.updated"
                            ? "Activité • Modification"
                            : "Activité"}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {isUnread ? (
                        <button
                          onClick={() => markRead(n.id)}
                          disabled={actionLoading.id === n.id}
                          className="text-xs px-2 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-60 flex items-center gap-1"
                          title="Marquer comme lue"
                        >
                          {actionLoading.id === n.id && actionLoading.action === "read" ? (
                            <span className="w-4 h-4 rounded-full border-2 border-white/70 border-t-transparent animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                          Lu
                        </button>
                      ) : (
                        <button
                          onClick={() => markUnread(n.id)}
                          disabled={actionLoading.id === n.id}
                          className="text-xs px-2 py-1 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 disabled:opacity-60 flex items-center gap-1"
                          title="Marquer comme non lue"
                        >
                          {actionLoading.id === n.id && actionLoading.action === "unread" ? (
                            <span className="w-4 h-4 rounded-full border-2 border-gray-500/70 border-t-transparent animate-spin" />
                          ) : (
                            <Undo2 className="w-4 h-4" />
                          )}
                          Non lu
                        </button>
                      )}
                      <button
                        onClick={() => remove(n.id)}
                        disabled={actionLoading.id === n.id}
                        className="text-xs px-2 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 flex items-center gap-1"
                        title="Supprimer"
                      >
                        {actionLoading.id === n.id && actionLoading.action === "delete" ? (
                          <span className="w-4 h-4 rounded-full border-2 border-white/70 border-t-transparent animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        Supprimer
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}


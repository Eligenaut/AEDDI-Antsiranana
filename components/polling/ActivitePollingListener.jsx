"use client";

import { useEffect, useRef } from "react";
import { url } from "../context/url.js";
import { getAuthHeaders } from "../context/headers.jsx";

export default function ActivitePollingListener({ intervalMs = 10000 }) {
  const stopRef = useRef(false);
  const timerRef = useRef(null);

  useEffect(() => {
    stopRef.current = false;

    const readAfterId = () => {
      const v = Number(localStorage.getItem("notifications_after_id") || "0");
      return Number.isFinite(v) ? v : 0;
    };

    const writeAfterId = (id) => {
      if (typeof id === "number" && id > 0) {
        localStorage.setItem("notifications_after_id", String(id));
      }
    };

    const setBadge = (value) => {
      const next = Math.max(0, Number(value) || 0);
      localStorage.setItem("notif_unread_badge", String(next));
      window.dispatchEvent(new Event("notif:unread"));
    };

    const tick = async () => {
      if (stopRef.current) return;

      try {
        const afterId = readAfterId();
        const endpoint = `${url}notifications/poll?after_id=${encodeURIComponent(afterId)}&limit=20`;

        const res = await fetch(endpoint, {
          headers: getAuthHeaders(),
        });

        if (!res.ok) return;
        const json = await res.json();
        if (!json?.success) return;

        const unreadCount = Number(json?.meta?.unread_count);
        if (Number.isFinite(unreadCount)) setBadge(unreadCount);

        const maxId = Number(json?.meta?.max_id);
        if (Number.isFinite(maxId) && maxId > 0) writeAfterId(maxId);
      } catch {
        // no-op
      } finally {
        if (!stopRef.current) {
          timerRef.current = setTimeout(tick, intervalMs);
        }
      }
    };

    tick();

    return () => {
      stopRef.current = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [intervalMs]);

  return null;
}


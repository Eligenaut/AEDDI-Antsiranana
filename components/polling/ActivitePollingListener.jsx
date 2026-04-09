"use client";

import { useEffect, useRef } from "react";
import Notiflix from "notiflix";
import { url } from "../context/url.js";
import { getAuthHeaders } from "../context/headers.jsx";

export default function ActivitePollingListener({ intervalMs = 10000 }) {
  const stopRef = useRef(false);
  const timerRef = useRef(null);

  useEffect(() => {
    stopRef.current = false;

    const readAfterId = () => {
      const v = Number(localStorage.getItem("activites_after_id") || "0");
      return Number.isFinite(v) ? v : 0;
    };

    const writeAfterId = (id) => {
      if (typeof id === "number" && id > 0) {
        localStorage.setItem("activites_after_id", String(id));
      }
    };

    const incBadge = (delta) => {
      const current = Number(localStorage.getItem("notif_activites_badge") || "0");
      const next = Math.max(0, (Number.isFinite(current) ? current : 0) + delta);
      localStorage.setItem("notif_activites_badge", String(next));
      window.dispatchEvent(new Event("notif:activites"));
    };

    const tick = async () => {
      if (stopRef.current) return;

      try {
        const afterId = readAfterId();
        const endpoint =
          afterId > 0
            ? `${url}activites/latest?after_id=${encodeURIComponent(afterId)}&limit=5`
            : `${url}activites/latest`;

        const res = await fetch(endpoint, {
          headers: getAuthHeaders(),
        });

        if (!res.ok) return;
        const json = await res.json();
        if (!json?.success) return;

        const items = Array.isArray(json.data) ? json.data : [];
        if (items.length > 0) {
          // Mettre à jour le curseur (max id)
          const maxId =
            Number(json?.meta?.max_id) ||
            Math.max(...items.map((x) => Number(x?.id || 0)));
          writeAfterId(maxId);

          // Notif visuelle "temps réel"
          const newest = items[items.length - 1];
          const nom = newest?.nom || "Nouvelle activité";
          Notiflix.Notify.info(`${nom} vient d'être ajoutée.`);

          // Badge (nombre de nouveautés)
          incBadge(items.length);
        }
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


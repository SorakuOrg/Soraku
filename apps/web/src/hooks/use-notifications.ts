"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Notification } from "@/lib/notifications";

const POLL_MS = 30_000; // 30 detik

export function useNotifications(enabled = true) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications", { cache: "no-store" });
      if (!res.ok) return;
      const { data } = await res.json();
      setNotifications(data ?? []);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    setLoading(true);
    fetch_();
    timer.current = setInterval(fetch_, POLL_MS);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [enabled, fetch_]);

  const markRead = useCallback(async (ids: string[]) => {
    setNotifications((prev) =>
      prev.map((n) => ids.includes(n.id) ? { ...n, read: true } : n)
    );
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    }).catch(() => {});
  }, []);

  const markAllRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    }).catch(() => {});
  }, []);

  return {
    notifications,
    unreadCount: notifications.filter((n) => !n.read).length,
    loading,
    markRead,
    markAllRead,
    refresh: fetch_,
  };
}

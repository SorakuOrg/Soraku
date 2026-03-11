"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Notification } from "@/lib/notifications";

const POLL_MS    = 60_000; // 60s polling sebagai fallback jika Realtime gagal
const REALTIME_TIMEOUT = 5_000; // 5s — jika realtime tidak konek, fallback ke polling

export function useNotifications(enabled = true) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading,   setLoading]   = useState(false);
  const [realtimeOk, setRealtimeOk] = useState(false);
  const pollTimer  = useRef<ReturnType<typeof setInterval> | null>(null);
  const channelRef = useRef<ReturnType<typeof createClient>["channel"] extends (...args: infer A) => infer R ? R : never | null>(null);

  const fetchNotifs = useCallback(async () => {
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
    fetchNotifs();

    // Setup Supabase Realtime
    const supabase = createClient();
    // Ambil user id untuk filter channel
    supabase.auth.getUser().then(({ data }) => {
      const userId = data?.user?.id;
      if (!userId) {
        // Tidak login — fallback polling saja
        pollTimer.current = setInterval(fetchNotifs, POLL_MS);
        return;
      }

      const channel = supabase
        .channel(`notifications:${userId}`)
        .on(
          "postgres_changes",
          {
            event:  "*",
            schema: "soraku",
            table:  "notifications",
            filter: `userid=eq.${userId}`,
          },
          () => {
            // Ada perubahan di tabel notif user ini — refetch
            fetchNotifs();
          }
        )
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            setRealtimeOk(true);
            // Realtime aktif — polling sangat jarang (backup saja)
            pollTimer.current = setInterval(fetchNotifs, 5 * 60_000); // 5 menit
          } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
            setRealtimeOk(false);
            // Fallback ke polling 60s
            if (!pollTimer.current) {
              pollTimer.current = setInterval(fetchNotifs, POLL_MS);
            }
          }
        });

      // Safety timeout — jika 5s belum SUBSCRIBED, start polling
      const safetyTimer = setTimeout(() => {
        if (!realtimeOk && !pollTimer.current) {
          pollTimer.current = setInterval(fetchNotifs, POLL_MS);
        }
      }, REALTIME_TIMEOUT);

      channelRef.current = channel as typeof channelRef.current;

      return () => clearTimeout(safetyTimer);
    });

    return () => {
      if (pollTimer.current)  clearInterval(pollTimer.current);
      if (channelRef.current) supabase.removeChannel(channelRef.current as Parameters<typeof supabase.removeChannel>[0]);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  const markRead = useCallback(async (ids: string[]) => {
    setNotifications(prev => prev.map(n => ids.includes(n.id) ? { ...n, isread: true } : n));
    await fetch("/api/notifications", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    }).catch(() => {});
  }, []);

  const markAllRead = useCallback(async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isread: true })));
    await fetch("/api/notifications", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    }).catch(() => {});
  }, []);

  return {
    notifications,
    unreadCount: notifications.filter(n => !n.isread).length,
    loading,
    realtimeOk,
    markRead,
    markAllRead,
    refresh: fetchNotifs,
  };
}

'use client'

import { useEffect, useState } from 'react'

export function useDiscord() {
  const [stats, setStats] = useState<{ members: number; online: number } | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/discord')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch {
      console.error('Discord fetch error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 60000)
    return () => clearInterval(interval)
  }, [])

  return { stats, loading, refetch: fetchStats }
}
